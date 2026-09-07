#!/usr/bin/env bash
# Quickstart script to start both Django (/services) and Next.js (/client) concurrently

set -e

# Change directory to project root
cd "$(dirname "$0")"

echo "=========================================================="
echo " Starting Metsie: Next.js + Modular Django Services"
echo "=========================================================="

# Trap Ctrl+C (SIGINT) and kill background child processes
cleanup() {
    echo ""
    echo "Shutting down servers..."
    kill $(jobs -p) 2>/dev/null || true
    exit 0
}
trap cleanup SIGINT SIGTERM EXIT

# 1. Start Django backend
echo "-> Starting Django backend on http://127.0.0.1:8000..."
services/.venv/bin/python services/manage.py runserver 127.0.0.1:8000 &
DJANGO_PID=$!

# Wait briefly for Django to initialize
sleep 2

# 2. Start Next.js frontend
echo "-> Starting Next.js frontend on http://localhost:3000..."
cd client && npm run dev &
NEXT_PID=$!

echo ""
echo "Both services are running!"
echo "  • Client / App:     http://localhost:3000"
echo "  • Django API:       http://127.0.0.1:8000/api/auth/"
echo "  • Django Admin:     http://127.0.0.1:8000/admin/"
echo "  • Nginx config:     nginx/nginx.conf"
echo ""
echo "Press Ctrl+C to stop both servers."

wait
