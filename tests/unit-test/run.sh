#!/usr/bin/env bash
# Run Unit Tests (Fast, DB-isolated tests for JWT, Login & Cookies, and Account Setup)

set -e
cd "$(dirname "$0")/../.."

echo "=========================================================="
echo " Running Unit Tests (JWT, Login Auth & Account Setup)"
echo "=========================================================="

PYTHONPATH=services services/.venv/bin/python services/manage.py test tests/unit-test --verbosity=2 "$@"

echo ""
echo "✅ All unit tests passed successfully!"
