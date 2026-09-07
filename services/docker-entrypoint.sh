#!/bin/sh
set -e

echo "==> Starting Auth Service Container..."

# If PostgreSQL host is provided, wait for it to be reachable
if [ "$DB_HOST" ]; then
    echo "==> Waiting for database at $DB_HOST:${DB_PORT:-5432}..."
    while ! nc -z "$DB_HOST" "${DB_PORT:-5432}"; do
        sleep 1
    done
    echo "==> Database is reachable and ready!"
fi

# Apply migrations to ensure tables exist in the dedicated auth database
echo "==> Applying database migrations..."
python manage.py migrate --noinput

echo "==> Executing application process..."
exec "$@"
