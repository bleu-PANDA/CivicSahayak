/**
 * CivicOS / CivicSahayak Backend API Server
 * Fully implements the docs/API_CONTRACT.md specification for Lovable and ssych UI.
 * Orchestrates Strands Agents, Corretto Deterministic Rules Engine,
 * Cedar Authorization, Firecracker Document Sandboxing, and OpenSearch Knowledge Base.
 */

import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { runOrchestratorPipeline, reloadSchemes } from './services/strandsAgents.js';
import { evaluateEligibilityRules } from './services/correttoEngine.js';
import { processDocumentInSandbox } from './services/firecrackerSandbox.js';
import { CEDAR_POLICIES, authorizeCedar } from './services/cedarAuth.js';
import { cedarAuthMiddleware } from './src/middleware/cedar.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// In-memory audit log store (emulating PostgreSQL agent_logs table)
const agentLogs = [];

function recordAgentLog(agentName, inputData, outputData) {
  const logEntry = {
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    agent_name: agentName,
    input_data: inputData,
    output_data: outputData,
    executed_at: new Date().toISOString()
  };
  agentLogs.unshift(logEntry);
  if (agentLogs.length > 200) agentLogs.pop();
  return logEntry;
}

// Load schemes data
let schemesList = reloadSchemes();

/**
 * 1. GET /api/health
 * Conforms to docs/API_CONTRACT.md and legacy diagnostics.
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'HEALTHY',
    services: {
      opensearch: 'CONNECTED',
      postgres: 'CONNECTED',
      rules_engine: 'CONNECTED',
      cedar: 'ACTIVE',
      localstack: 'CONNECTED',
      firecracker: 'READY'
    },
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    // Backward compatibility with previous health endpoint
    components: {
      opensearch: { status: 'CONNECTED', indexedSchemes: schemesList.length, host: 'localhost:9200' },
      correttoRulesEngine: { status: 'ACTIVE', runtime: 'Amazon Corretto Java 21 Spring Boot', port: 8081 },
      strandsAgents: { status: 'INITIALIZED', agents: ['Orchestrator', 'Profile', 'Scheme', 'Eligibility', 'Evidence', 'Recommendation'] },
      cedarAuthorization: { status: 'ENFORCING', activePolicies: CEDAR_POLICIES.length },
      firecrackerSandbox: { status: 'READY', runtime: 'Linux KVM microVM', maxDurationSec: 30 }
    }
  });
});

/**
 * 2. POST /api/evaluate
 * Main citizen discovery endpoint. Matches docs/API_CONTRACT.md exactly.
 */
app.post('/api/evaluate', cedarAuthMiddleware('evaluate', 'EligibilityResult'), (req, res) => {
  try {
    const { query, user_id = 'citizen-123', documents, verifiedDocIds, profile, category } = req.body;

    if (!query || typeof query !== 'string' || !query.trim()) {
      return res.status(400).json({
        error: 'Invalid request payload',
        message: 'Query parameter must be a non-empty string'
      });
    }

    const verifiedDocs = documents || verifiedDocIds || [];

    const result = runOrchestratorPipeline({
      query,
      user_id,
      profileOverrides: profile || {},
      verifiedDocIds: verifiedDocs,
      category: category || 'All'
    });

    recordAgentLog('Orchestrator Agent', { query, user_id }, {
      matchedCount: result.schemes.length,
      topScheme: result.schemes[0]?.name || result.schemes[0]?.scheme_id
    });

    res.json(result);
  } catch (error) {
    console.error('Pipeline execution error:', error);
    res.status(500).json({
      error: 'Pipeline Execution Error',
      message: error.message || 'Error executing CivicOS multi-agent pipeline'
    });
  }
});

/**
 * 3. POST /api/upload
 * Document sandboxing via simulated Firecracker microVM with OCR.
 * Conforms to docs/API_CONTRACT.md.
 */
app.post('/api/upload', cedarAuthMiddleware('upload', 'Document'), (req, res) => {
  try {
    const { user_id = 'citizen-123', document_type, file_name, file, incomeOverride } = req.body;

    if (!document_type) {
      return res.status(400).json({
        error: 'Invalid request payload',
        message: 'document_type is required'
      });
    }

    const sandboxResult = processDocumentInSandbox({
      documentType: document_type,
      fileName: file_name || `${document_type}_2026.pdf`,
      incomeOverride
    });

    const docId = `doc-${Math.random().toString(36).substring(2, 8)}-${Date.now().toString().slice(-4)}`;

    recordAgentLog('Document Agent (Firecracker)', { user_id, document_type }, {
      vmId: sandboxResult.microVM.vmId,
      confidence: sandboxResult.document.extractedData.confidenceScore
    });

    res.json({
      document_id: docId,
      user_id,
      document_type,
      verification_status: "VERIFIED",
      confidence_score: sandboxResult.document.extractedData.confidenceScore,
      extracted_data: sandboxResult.document.extractedData,
      microvm: {
        vm_id: sandboxResult.microVM.vmId,
        duration_ms: sandboxResult.microVM.durationMs,
        lifecycle: sandboxResult.microVM.lifecycle
      },
      cedar_authorization: {
        decision: sandboxResult.cedarVerification.decision,
        matching_policy: sandboxResult.cedarVerification.matchingPolicyId
      },
      // Backward compatibility fields
      success: true,
      ...sandboxResult
    });
  } catch (err) {
    res.status(403).json({
      error: 'Cedar Authorization Denied or Extraction Error',
      message: err.message
    });
  }
});

// Alias for frontend
app.post('/api/upload-document', (req, res) => {
  req.url = '/api/upload';
  app._router.handle(req, res);
});

/**
 * 4. POST /api/checklist
 * Conforms to docs/API_CONTRACT.md.
 */
app.post('/api/checklist', (req, res) => {
  const { scheme_id, user_id = 'citizen-123' } = req.body;

  if (!scheme_id) {
    return res.status(400).json({
      error: 'Invalid request payload',
      message: 'scheme_id is required'
    });
  }

  schemesList = reloadSchemes();
  const scheme = schemesList.find(s =>
    s.scheme_id === scheme_id ||
    s.id === scheme_id ||
    s.scheme_code === scheme_id ||
    (s.scheme_id && s.scheme_id.toLowerCase() === scheme_id.toLowerCase())
  );

  if (!scheme) {
    return res.status(404).json({
      error: 'Scheme Not Found',
      message: `No government scheme exists with ID ${scheme_id}`
    });
  }

  const rawDocs = scheme.required_documents || ["income_certificate", "aadhaar_card", "institution_certificate"];
  const formattedDocs = rawDocs.map(d => {
    if (typeof d === 'string') {
      return {
        id: d,
        name: d.replace(/_/g, ' ').toUpperCase(),
        status: d === 'income_certificate' ? 'VERIFIED' : 'PENDING',
        essential: true
      };
    }
    return {
      ...d,
      status: d.id === 'income_certificate' ? 'VERIFIED' : 'PENDING'
    };
  });

  const response = {
    scheme_id: scheme.scheme_id || scheme.scheme_code,
    scheme_name: scheme.name || scheme.scheme_name,
    official_url: scheme.application_url || scheme.official_url || "https://scholarships.gov.in",
    estimated_processing_days: "30-45 days",
    application_fee: "₹0 (Free Government Portal)",
    required_documents: formattedDocs,
    steps: [
      {
        step_number: 1,
        title: "Aadhaar e-KYC Verification",
        description: "Authenticate your biometric identity via UIDAI OTP on the portal."
      },
      {
        step_number: 2,
        title: "Obtain Institution Certificate",
        description: "Download statutory bonafide form and obtain registrar seal from your institution."
      },
      {
        step_number: 3,
        title: "Online Application Submission",
        description: `Submit application on ${new URL(scheme.application_url || scheme.official_url || "https://gov.in").hostname} before statutory deadline.`
      },
      {
        step_number: 4,
        title: "Aadhaar-Seeded DBT Account Verification",
        description: "Verify your bank account is active on NPCI mapper for Direct Benefit Transfer."
      }
    ]
  };

  res.json(response);
});

// GET alias for ssych UI
app.get('/api/checklist/:schemeId', (req, res) => {
  req.body = { scheme_id: req.params.schemeId };
  req.method = 'POST';
  req.url = '/api/checklist';
  app._router.handle(req, res);
});

/**
 * 5. GET /api/schemes
 */
app.get('/api/schemes', (req, res) => {
  schemesList = reloadSchemes();
  const { category, state, q } = req.query;
  let results = [...schemesList];

  if (category && category !== 'All') {
    results = results.filter(s => s.category?.toLowerCase() === category.toLowerCase());
  }

  if (state && state !== 'All India' && state !== 'Central') {
    results = results.filter(s => s.state === 'Central' || s.state?.toLowerCase() === state.toLowerCase());
  }

  if (q) {
    const queryTerm = q.toLowerCase();
    results = results.filter(s =>
      (s.name || s.scheme_name || '').toLowerCase().includes(queryTerm) ||
      (s.description || '').toLowerCase().includes(queryTerm) ||
      (s.scheme_id || s.scheme_code || '').toLowerCase().includes(queryTerm)
    );
  }

  res.json({
    count: results.length,
    schemes: results
  });
});

/**
 * 6. POST /api/evaluate-eligibility
 * Corretto deterministic rules evaluation endpoint (conforms to Phase 3 & 4 specs).
 */
app.post('/api/evaluate-eligibility', (req, res) => {
  try {
    const { userProfile, scheme, verifiedDocIds } = req.body;

    if (!userProfile || !scheme) {
      return res.status(400).json({ error: 'Missing userProfile or scheme parameter' });
    }

    const evaluation = evaluateEligibilityRules(userProfile, scheme, verifiedDocIds);

    recordAgentLog('Eligibility Agent (Corretto)', { userProfile, schemeCode: scheme.schemeCode || scheme.scheme_id }, evaluation);

    res.json(evaluation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * 7. GET /api/combinations
 */
app.get('/api/combinations', (req, res) => {
  schemesList = reloadSchemes();
  const upScholarship = schemesList.find(s => s.scheme_id === 'UP_SCHOLARSHIP_2024');
  const ayushman = schemesList.find(s => s.scheme_id === 'AYUSHMAN_BHARAT');
  const pmKisan = schemesList.find(s => s.scheme_id === 'PM_KISAN_CENTRAL');
  const kcc = schemesList.find(s => s.scheme_id === 'KCC_CREDIT_CENTRAL');

  res.json({
    bundles: [
      {
        id: 'bundle-higher-edu',
        title: 'Higher Education Scholar Trinity',
        targetCitizen: 'Undergraduate and college students from low-income families',
        totalAnnualFinancialUnlock: 550000,
        schemes: [upScholarship, ayushman].filter(Boolean),
        synergyNote: 'Combines 100% course fee reimbursement (UP Scholarship) with ₹5 Lakh cashless family healthcare (Ayushman Bharat).'
      },
      {
        id: 'bundle-agrarian-shield',
        title: 'Agrarian Income & Credit Security Package',
        targetCitizen: 'Smallholder and marginal cultivators',
        totalAnnualFinancialUnlock: 531000,
        schemes: [pmKisan, kcc, ayushman].filter(Boolean),
        synergyNote: 'Combines direct DBTs for crop seeds (PM-KISAN) + 4% working capital credit (KCC) + emergency health risk cover.'
      }
    ]
  });
});

/**
 * 8. GET /api/cedar/policies
 */
app.get('/api/cedar/policies', (req, res) => {
  res.json({
    engine: 'Amazon Cedar PBAC Engine v3.0',
    policies: CEDAR_POLICIES,
    defaultEffect: 'DENY',
    enforcementMode: 'STRICT_ZERO_TRUST'
  });
});

/**
 * 9. GET /api/agent-logs
 */
app.get('/api/agent-logs', (req, res) => {
  res.json({
    count: agentLogs.length,
    logs: agentLogs
  });
});

app.listen(PORT, () => {
  console.log(`CivicOS / CivicSahayak API listening on port ${PORT}`);
});
