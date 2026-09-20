/**
 * OpenSearch Scheme Knowledge Base Initializer
 * Creates the 'government_schemes' index with mapping analyzers and bulk-indexes 20+ schemes.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OPENSEARCH_HOST = process.env.OPENSEARCH_URL || 'http://localhost:9200';
const schemesFilePath = path.join(__dirname, '../backend/data/schemes.json');
const schemesData = JSON.parse(fs.readFileSync(schemesFilePath, 'utf8'));

export const OPENSEARCH_INDEX_MAPPING = {
  settings: {
    number_of_shards: 1,
    number_of_replicas: 0,
    analysis: {
      analyzer: {
        scheme_analyzer: {
          type: "custom",
          tokenizer: "standard",
          filter: ["lowercase", "stop", "snowball"]
        }
      }
    }
  },
  mappings: {
    properties: {
      scheme_name: { type: "text", analyzer: "scheme_analyzer" },
      scheme_code: { type: "keyword" },
      category: { type: "keyword" },
      level: { type: "keyword" },
      state: { type: "keyword" },
      income_ceiling: { type: "float" },
      age_min: { type: "integer" },
      age_max: { type: "integer" },
      target_occupations: { type: "keyword" },
      target_education: { type: "keyword" },
      financial_benefit: { type: "text" },
      annual_benefit_amount: { type: "integer" },
      description: { type: "text", analyzer: "scheme_analyzer" },
      statutory_evidence: { type: "text", analyzer: "scheme_analyzer" },
      official_url: { type: "keyword" },
      indexed_at: { type: "date" }
    }
  }
};

async function initOpenSearch() {
  console.log(`Connecting to OpenSearch at: ${OPENSEARCH_HOST}...`);

  try {
    // 1. Create Index
    const createIndexRes = await fetch(`${OPENSEARCH_HOST}/government_schemes`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(OPENSEARCH_INDEX_MAPPING)
    });
    const indexResult = await createIndexRes.json();
    console.log('OpenSearch Index Creation Result:', indexResult);

    // 2. Index Schemes
    for (const scheme of schemesData) {
      const docRes = await fetch(`${OPENSEARCH_HOST}/government_schemes/_doc/${scheme.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...scheme,
          indexed_at: new Date().toISOString()
        })
      });
      const docJson = await docRes.json();
      console.log(`Indexed scheme: ${scheme.scheme_code} -> status: ${docJson.result}`);
    }

    console.log(`Successfully indexed ${schemesData.length} schemes into OpenSearch.`);
  } catch (err) {
    console.error('OpenSearch initialization error:', err.message);
    console.log('Note: If running in standalone Node mode without an external OpenSearch container, backend/services/strandsAgents.js transparently emulates OpenSearch queries.');
  }
}

// Run if directly called
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  initOpenSearch();
}
