#!/usr/bin/env bash
set -e

echo "=== CivicOS PostgreSQL Initializer ==="
POSTGRES_HOST="${POSTGRES_HOST:-localhost}"
POSTGRES_PORT="${POSTGRES_PORT:-5432}"
POSTGRES_USER="${POSTGRES_USER:-civicos_user}"
POSTGRES_PASSWORD="${POSTGRES_PASSWORD:-civicos_pass}"
POSTGRES_DB="${POSTGRES_DB:-civicos_dev}"

if command -v psql &> /dev/null; then
  echo "Executing init-postgres.sql against ${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}..."
  PGPASSWORD="${POSTGRES_PASSWORD}" psql -h "${POSTGRES_HOST}" -p "${POSTGRES_PORT}" -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" -f "$(dirname "$0")/../infra/init-postgres.sql"
  echo "PostgreSQL schema successfully initialized."
else
  echo "psql CLI not detected on host. The SQL script is mounted to /docker-entrypoint-initdb.d/ in the postgres container."
fi
