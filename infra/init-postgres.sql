-- ==============================================================================
-- CivicOS PostgreSQL Database Schema
-- Stores citizen profiles, scheme cache, document OCR outputs, and agent audit logs.
-- ==============================================================================

-- 1. Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  age INT,
  state VARCHAR(100),
  education_level VARCHAR(100),
  family_income_annual DECIMAL(10,2),
  occupation VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Schemes table (indexed from OpenSearch, cached here)
CREATE TABLE IF NOT EXISTS schemes (
  id SERIAL PRIMARY KEY,
  scheme_name VARCHAR(500),
  scheme_code VARCHAR(100) UNIQUE,
  description TEXT,
  state VARCHAR(100),
  category VARCHAR(100), -- education, healthcare, housing, etc.
  income_ceiling DECIMAL(10,2),
  age_min INT,
  age_max INT,
  required_documents JSONB, -- ["income_certificate", "aadhaar", "college_id"]
  official_url TEXT,
  indexed_at TIMESTAMP DEFAULT NOW()
);

-- 3. User documents
CREATE TABLE IF NOT EXISTS user_documents (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  document_type VARCHAR(100), -- "income_certificate", "aadhaar", etc.
  file_path TEXT, -- S3/local path
  extracted_data JSONB, -- OCR output
  uploaded_at TIMESTAMP DEFAULT NOW()
);

-- 4. Eligibility results
CREATE TABLE IF NOT EXISTS eligibility_results (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  scheme_id INT REFERENCES schemes(id),
  eligibility_score DECIMAL(5,2), -- 0-100
  status VARCHAR(50), -- "eligible", "partially_eligible", "not_eligible"
  missing_documents JSONB, -- ["college_certificate"]
  reasoning TEXT, -- AI-generated explanation
  checked_at TIMESTAMP DEFAULT NOW()
);

-- 5. Agent execution logs (for debugging & audit transparency)
CREATE TABLE IF NOT EXISTS agent_logs (
  id SERIAL PRIMARY KEY,
  user_id INT,
  agent_name VARCHAR(100),
  input_data JSONB,
  output_data JSONB,
  executed_at TIMESTAMP DEFAULT NOW()
);

-- Indices for rapid queries
CREATE INDEX IF NOT EXISTS idx_schemes_category ON schemes(category);
CREATE INDEX IF NOT EXISTS idx_schemes_state ON schemes(state);
CREATE INDEX IF NOT EXISTS idx_eligibility_user ON eligibility_results(user_id);
CREATE INDEX IF NOT EXISTS idx_agent_logs_time ON agent_logs(executed_at DESC);
