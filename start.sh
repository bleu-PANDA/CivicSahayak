#!/bin/bash
# CivicOS / CivicSahayak — Single-Command Launcher
# Usage: ./start.sh [--docker | --local]
# Default: --local (no Docker required)

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

MODE="${1:---local}"

cleanup() {
  echo -e "\n${YELLOW}⏹  Shutting down CivicOS services...${NC}"
  if [ ! -z "$BACKEND_PID" ]; then
    kill "$BACKEND_PID" 2>/dev/null || true
    echo -e "${GREEN}✓ Backend stopped${NC}"
  fi
  if [ ! -z "$FRONTEND_PID" ]; then
    kill "$FRONTEND_PID" 2>/dev/null || true
    echo -e "${GREEN}✓ Frontend stopped${NC}"
  fi
  exit 0
}

trap cleanup SIGINT SIGTERM

if [ "$MODE" = "--docker" ]; then
  echo -e "${CYAN}🐳 Starting CivicOS via Docker Compose...${NC}"
  docker compose up -d
  echo -e "${GREEN}✅ All services started. Access:${NC}"
  echo -e "   Frontend:  http://localhost:3000"
  echo -e "   Backend:   http://localhost:8080"
  echo -e "   OpenSearch: http://localhost:9200"
  echo -e "\n${YELLOW}To stop: docker compose down${NC}"
  exit 0
fi

# --- Local development mode ---
echo -e "${CYAN}"
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║       🏛️  CivicOS / CivicSahayak — Local Dev Launcher       ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Set ports (use env vars or defaults)
BACKEND_PORT="${BACKEND_PORT:-8090}"
FRONTEND_PORT="${FRONTEND_PORT:-5173}"

# 1. Install dependencies if needed
echo -e "${YELLOW}📦 Checking dependencies...${NC}"
if [ ! -d "backend/node_modules" ]; then
  echo -e "   Installing backend dependencies..."
  npm --prefix backend install --silent
fi
if [ ! -d "frontend/node_modules" ]; then
  echo -e "   Installing frontend dependencies..."
  npm --prefix frontend install --silent
fi
echo -e "${GREEN}✓ Dependencies ready${NC}"

# 2. Start Backend
echo -e "${YELLOW}🚀 Starting Backend API on port ${BACKEND_PORT}...${NC}"
PORT="$BACKEND_PORT" node backend/server.js &
BACKEND_PID=$!
sleep 2

# Verify backend
if curl -s "http://localhost:${BACKEND_PORT}/api/health" > /dev/null 2>&1; then
  echo -e "${GREEN}✓ Backend API healthy on port ${BACKEND_PORT}${NC}"
else
  echo -e "${RED}✗ Backend failed to start${NC}"
  exit 1
fi

# 3. Start Frontend
echo -e "${YELLOW}🚀 Starting Frontend on port ${FRONTEND_PORT}...${NC}"
BACKEND_PORT="$BACKEND_PORT" PORT="$FRONTEND_PORT" npm --prefix frontend run dev &
FRONTEND_PID=$!
sleep 3

echo ""
echo -e "${GREEN}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                   ✅ CivicOS is running!                     ║${NC}"
echo -e "${GREEN}╠═══════════════════════════════════════════════════════════════╣${NC}"
echo -e "${GREEN}║  Frontend UI:    http://localhost:${FRONTEND_PORT}                      ║${NC}"
echo -e "${GREEN}║  Backend API:    http://localhost:${BACKEND_PORT}                      ║${NC}"
echo -e "${GREEN}║  Health Check:   http://localhost:${BACKEND_PORT}/api/health            ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"
echo ""

# Wait for processes
wait
