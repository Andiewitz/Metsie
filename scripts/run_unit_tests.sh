#!/usr/bin/env bash
# Run Unit Tests (Fast, DB-isolated tests for JWT, Login & Cookies, and Account Setup)

set -e
cd "$(dirname "$0")/.."

echo "=========================================================="
echo " Running Unit Tests (JWT, Login Auth & Account Setup)"
echo "=========================================================="

services/.venv/bin/python services/manage.py test \
    auth.tests.test_unit_jwt \
    auth.tests.test_login_auth \
    auth.tests.test_account_setup --verbosity=2

echo ""
echo "✅ All unit tests passed successfully!"
