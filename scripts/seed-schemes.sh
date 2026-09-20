#!/usr/bin/env bash
set -e

echo "=== CivicOS Scheme Knowledge Base Seeder ==="
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "1. Generating 50 comprehensive schemes with 384-dim dense vectors..."
node "${SCRIPT_DIR}/seed-schemes.js"

echo "2. Attempting indexing into OpenSearch if available..."
OPENSEARCH_URL="${OPENSEARCH_URL:-http://localhost:9200}"
if curl -s -f "${OPENSEARCH_URL}/_cluster/health" > /dev/null 2>&1; then
  echo "OpenSearch reachable at ${OPENSEARCH_URL}. Indexing schemes..."
  node "${SCRIPT_DIR}/../infra/init-opensearch.js"
else
  echo "OpenSearch is not currently reachable at ${OPENSEARCH_URL}. Standalone in-memory search fallback is active in backend."
fi

echo "=== Seeding Complete (50 Schemes Ready) ==="
