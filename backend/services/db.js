/**
 * PostgreSQL Database Service
 * Provides connection pooling, schema initialization, and transactional persistence
 * for users, user_documents, eligibility_results, and agent_logs.
 * Resiliently handles offline PostgreSQL with transparent in-memory logging.
 */

import pg from 'pg';

const { Pool } = pg;

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/civicos';

export const pool = new Pool({
  connectionString: DATABASE_URL,
  connectionTimeoutMillis: 1500,
  idleTimeoutMillis: 10000,
  max: 10
});

let isConnected = false;

// Prevent idle client errors from crashing process
pool.on('error', (err) => {
  console.warn('[PostgreSQL Pool Warning]:', err.message);
  isConnected = false;
});

/**
 * Check if PostgreSQL is live and initialize schema tables if needed
 */
export async function initDb() {
  try {
    const client = await pool.connect();
    isConnected = true;
    console.log('[PostgreSQL] Connected successfully to:', DATABASE_URL.replace(/:[^:@]+@/, ':****@'));

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        user_key VARCHAR(100) UNIQUE,
        name VARCHAR(255),
        age INT,
        state VARCHAR(100),
        education_level VARCHAR(100),
        family_income_annual DECIMAL(10,2),
        occupation VARCHAR(100),
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS user_documents (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(100),
        document_type VARCHAR(100),
        file_path TEXT,
        extracted_data JSONB,
        uploaded_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS eligibility_results (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(100),
        scheme_code VARCHAR(100),
        eligibility_score DECIMAL(5,2),
        status VARCHAR(50),
        missing_documents JSONB,
        reasoning TEXT,
        checked_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS agent_logs (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(100),
        agent_name VARCHAR(100),
        input_data JSONB,
        output_data JSONB,
        executed_at TIMESTAMP DEFAULT NOW()
      );
    `);
    client.release();
    console.log('[PostgreSQL] Database schema verified & ready.');
  } catch (err) {
    isConnected = false;
    console.log('[PostgreSQL] Not reachable at host (' + err.message + '). Relational persistence active in graceful in-memory standby.');
  }
}

// In-memory fallback stores for when PG server is not running
const memoryStores = {
  users: new Map(),
  user_documents: [],
  eligibility_results: [],
  agent_logs: []
};

/**
 * Record an Agent execution log
 */
export async function persistAgentLog(agentName, inputData, outputData, userId = 'citizen-123') {
  if (isConnected) {
    try {
      await pool.query(
        'INSERT INTO agent_logs (user_id, agent_name, input_data, output_data) VALUES ($1, $2, $3, $4)',
        [userId, agentName, JSON.stringify(inputData), JSON.stringify(outputData)]
      );
      return;
    } catch (err) {
      console.warn('[PostgreSQL] Could not persist agent log, using in-memory store:', err.message);
    }
  }

  memoryStores.agent_logs.push({
    id: memoryStores.agent_logs.length + 1,
    user_id: userId,
    agent_name: agentName,
    input_data: inputData,
    output_data: outputData,
    executed_at: new Date().toISOString()
  });
}

/**
 * Record an uploaded document record
 */
export async function persistUserDocument(userId, documentType, filePath, extractedData) {
  if (isConnected) {
    try {
      const res = await pool.query(
        'INSERT INTO user_documents (user_id, document_type, file_path, extracted_data) VALUES ($1, $2, $3, $4) RETURNING *',
        [userId, documentType, filePath, JSON.stringify(extractedData)]
      );
      return res.rows[0];
    } catch (err) {
      console.warn('[PostgreSQL] Could not persist user document, using in-memory store:', err.message);
    }
  }

  const record = {
    id: memoryStores.user_documents.length + 1,
    user_id: userId,
    document_type: documentType,
    file_path: filePath,
    extracted_data: extractedData,
    uploaded_at: new Date().toISOString()
  };
  memoryStores.user_documents.push(record);
  return record;
}

/**
 * Record eligibility evaluation results
 */
export async function persistEligibilityResults(userId, schemeCode, score, status, missingDocs, reasoning) {
  if (isConnected) {
    try {
      await pool.query(
        'INSERT INTO eligibility_results (user_id, scheme_code, eligibility_score, status, missing_documents, reasoning) VALUES ($1, $2, $3, $4, $5, $6)',
        [userId, schemeCode, score, status, JSON.stringify(missingDocs), reasoning]
      );
      return;
    } catch (err) {
      console.warn('[PostgreSQL] Could not persist eligibility result:', err.message);
    }
  }

  memoryStores.eligibility_results.push({
    id: memoryStores.eligibility_results.length + 1,
    user_id: userId,
    scheme_code: schemeCode,
    eligibility_score: score,
    status,
    missing_documents: missingDocs,
    reasoning,
    checked_at: new Date().toISOString()
  });
}

/**
 * Upsert User Profile
 */
export async function upsertUserProfile(userKey, profile) {
  if (isConnected) {
    try {
      const res = await pool.query(
        `INSERT INTO users (user_key, age, state, education_level, family_income_annual, occupation)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (user_key) 
         DO UPDATE SET age = EXCLUDED.age, state = EXCLUDED.state, education_level = EXCLUDED.education_level, family_income_annual = EXCLUDED.family_income_annual, occupation = EXCLUDED.occupation
         RETURNING *`,
        [userKey, profile.age, profile.state, profile.education_level || profile.education, profile.family_income_annual || profile.income, profile.occupation]
      );
      return res.rows[0];
    } catch (err) {
      console.warn('[PostgreSQL] Could not upsert user profile:', err.message);
    }
  }

  memoryStores.users.set(userKey, {
    user_key: userKey,
    ...profile,
    updated_at: new Date().toISOString()
  });
  return memoryStores.users.get(userKey);
}

export function getDbStats() {
  return {
    isPostgresConnected: isConnected,
    databaseUrl: DATABASE_URL.replace(/:[^:@]+@/, ':****@'),
    inMemoryCounts: {
      users: memoryStores.users.size,
      user_documents: memoryStores.user_documents.length,
      eligibility_results: memoryStores.eligibility_results.length,
      agent_logs: memoryStores.agent_logs.length
    }
  };
}
