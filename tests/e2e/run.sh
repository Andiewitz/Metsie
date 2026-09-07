#!/usr/bin/env bash
# Run End-to-End Flow Tests (Full user lifecycle: Register -> Session check -> Setup -> Logout -> Re-login)

set -e
cd "$(dirname "$0")/../.."

echo "=========================================================="
echo " Running End-to-End (E2E) Flow Tests"
echo "=========================================================="

PYTHONPATH=services services/.venv/bin/python services/manage.py test tests/e2e --verbosity=2 "$@"

echo ""
echo "✅ All E2E flow tests passed successfully!"
