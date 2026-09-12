#!/bin/sh
set -e

echo "==> Starting Metsie Auth Service..."

# Wait for Postgres when using individual DB_HOST config (docker-compose / non-Railway)
# On Railway, DATABASE_URL is used and the DB is always ready before deploy completes.
if [ -z "$DATABASE_URL" ] && [ -n "$DB_HOST" ]; then
    echo "==> Waiting for database at ${DB_HOST}:${DB_PORT:-5432}..."
    while ! nc -z "$DB_HOST" "${DB_PORT:-5432}"; do
        sleep 1
    done
    echo "==> Database is reachable!"
fi

echo "==> Collecting static files..."
python manage.py collectstatic --noinput

echo "==> Applying database migrations..."
python manage.py migrate --noinput

echo "==> Starting application server..."
exec "$@"
