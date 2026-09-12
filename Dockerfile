# ─── Stage 1: Build Next.js ───────────────────────────────────────────────────
FROM node:20-alpine AS nextjs-builder
WORKDIR /build/client

COPY client/package.json client/package-lock.json ./
RUN npm ci

COPY client/ .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
# At build time, rewrites point to the local Django process (runtime config)
ENV BACKEND_INTERNAL_URL=http://127.0.0.1:8000

RUN npm run build

# ─── Stage 2: Monolith Runtime ────────────────────────────────────────────────
# Python + Node.js + nginx + supervisord — all in one container
FROM python:3.13-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    NEXT_TELEMETRY_DISABLED=1

# System packages: nginx, supervisord, gettext (envsubst), Node.js
RUN apt-get update && apt-get install -y --no-install-recommends \
        curl \
        nginx \
        supervisor \
        netcat-openbsd \
        gettext-base \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# ─── Python dependencies ──────────────────────────────────────────────────────
COPY services/requirements.txt ./services/requirements.txt
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r services/requirements.txt

# ─── Django source ────────────────────────────────────────────────────────────
COPY services/ ./services/

# ─── Next.js: source + built artifacts from builder ──────────────────────────
COPY client/ ./client/
COPY --from=nextjs-builder /build/client/.next         ./client/.next
COPY --from=nextjs-builder /build/client/node_modules  ./client/node_modules

# ─── nginx: install template, supervisord config, startup script ──────────────
# nginx.conf uses ${NGINX_PORT} placeholder — envsubst fills it at runtime
COPY nginx/nginx.conf      /etc/nginx/nginx.conf.template
COPY supervisord.conf      /etc/supervisor/conf.d/metsie.conf
COPY start.sh              /start.sh
RUN chmod +x /start.sh

# Railway injects $PORT — expose the default
EXPOSE 80

CMD ["/start.sh"]
