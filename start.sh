#!/bin/sh
set -e

echo "==> Running Django database migrations..."
cd /app/services
PYTHONPATH=/app/services python manage.py migrate --noinput || {
    echo "==> Warning: Migration command failed or DB unavailable at startup, continuing..."
}

echo "==> Collecting Django static files..."
PYTHONPATH=/app/services python manage.py collectstatic --noinput

echo "==> Configuring nginx on port ${PORT:-80}..."
export NGINX_PORT=${PORT:-80}
envsubst '${NGINX_PORT}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

echo "==> Starting supervisord (nginx + Django + Next.js)..."
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/metsie.conf
