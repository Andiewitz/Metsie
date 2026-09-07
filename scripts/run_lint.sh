#!/usr/bin/env bash
# Run Lint Checks for both Backend (Ruff) and Frontend (ESLint)

set -e
cd "$(dirname "$0")/.."

echo "=========================================================="
echo " Running Backend Lint Checks (Ruff)"
echo "=========================================================="
services/.venv/bin/ruff check services/
echo "✅ Backend lint passed!"

echo ""
echo "=========================================================="
echo " Running Frontend Lint Checks (ESLint)"
echo "=========================================================="
(cd client && npm run lint)
echo "✅ Frontend lint passed!"

echo ""
echo "🎉 All lint checks passed with zero errors!"
