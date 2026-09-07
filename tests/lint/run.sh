#!/usr/bin/env bash
# Run Lint Checks for both Backend (Ruff) and Frontend (ESLint)

set -e
cd "$(dirname "$0")/../.."

MODE="${1:-all}"

run_backend() {
    echo "=========================================================="
    echo " Running Backend Lint Checks (Ruff)"
    echo "=========================================================="
    services/.venv/bin/ruff check services/ tests/ --config services/pyproject.toml
    echo "✅ Backend lint passed!"
}

run_frontend() {
    echo "=========================================================="
    echo " Running Frontend Lint Checks (ESLint)"
    echo "=========================================================="
    (cd client && npm run lint)
    echo "✅ Frontend lint passed!"
}

case "$MODE" in
    --backend|backend)
        run_backend
        ;;
    --frontend|frontend)
        run_frontend
        ;;
    *)
        run_backend
        echo ""
        run_frontend
        echo ""
        echo "🎉 All lint checks passed with zero errors!"
        ;;
esac
