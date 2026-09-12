# Dockerfile for Django Auth Service
FROM python:3.13-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    netcat-openbsd \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY requirements.txt .
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy application source code
COPY . .

# Ensure entrypoint script is executable
RUN chmod +x /app/docker-entrypoint.sh

# Railway dynamically assigns PORT — default to 8000 for local docker-compose
EXPOSE 8000

ENTRYPOINT ["/app/docker-entrypoint.sh"]
# Bind to Railway's $PORT at runtime; default to 8000 if not set
CMD sh -c "gunicorn config.wsgi:application --bind 0.0.0.0:${PORT:-8000} --workers 3 --timeout 120"
