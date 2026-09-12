# Metsie Railway Deployment Guide

> **Single-Instance Deployment**: Metsie runs as **one unified service** on Railway. An internal **Nginx** reverse proxy routes incoming traffic to the **Next.js frontend** and the **Django backend** inside the same container, connecting to a managed **PostgreSQL** database.

---

## Architecture on Railway

```
                   Internet (https://<your-app>.up.railway.app)
                                       │
                                       ▼
                       Railway Edge SSL ($PORT)
                                       │
                                       ▼
                     ┌───────────────────────────────────┐
                     │          Nginx Reverse Proxy       │
                     │  (listens on Railway's $PORT)     │
                     └───────────────┬───────────────────┘
                                     │
                 ┌───────────────────┴───────────────────┐
                 │                                       │
         / (all page routes)                   /api/* and /admin/*
                 │                                       │
                 ▼                                       ▼
      Next.js (Node 20)                       Django 5.1 (Gunicorn)
      127.0.0.1:3001                          127.0.0.1:8000
                                                         │
                                                         ▼
                                              PostgreSQL Plugin (DB)
                                              (via DATABASE_URL)
```

### Key Advantages
- **Single Service**: Only 1 web service to pay for and manage on Railway.
- **Same-Origin**: Frontend and API share the exact same domain. Zero CORS issues and 7-day `httpOnly` cookies work out of the box with `SameSite=Lax`.
- **Fast Static Files**: Nginx serves `/static/` directly from disk with caching headers.
- **Supervisord Management**: Automatic process monitoring, auto-restart on crashes.

---

## Prerequisites

- A [Railway](https://railway.app) account
- The Metsie repo at [github.com/Andiewitz/Metsie](https://github.com/Andiewitz/Metsie)

---

## Step 1 — Create Project & Deploy

1. Go to [railway.app/new](https://railway.app/new)
2. Select **Deploy from GitHub repo** → pick **Andiewitz/Metsie**
3. Railway automatically detects the root `railway.json` and builds via the root `Dockerfile`.

---

## Step 2 — Add PostgreSQL Database

1. In the project canvas, click **+ New** → **Database** → **Add PostgreSQL**
2. In your Metsie service → **Variables** tab:
   - Click **+ Link Variable** → choose the Postgres service → link `DATABASE_URL`
   *(Railway automatically injects the connection string into the app).*

---

## Step 3 — Set Environment Variables

In your Metsie service → **Variables** tab, configure the following:

| Variable | Value | Description |
|---|---|---|
| `DJANGO_SECRET_KEY` | `python -c "import secrets; print(secrets.token_urlsafe(50))"` | Strong random Django secret key |
| `JWT_SECRET_KEY` | Strong random string (different from Django secret) | Signs the 7-day auth tokens |
| `DEBUG` | `False` | Disables debug mode in production |
| `ENVIRONMENT` | `production` | Production mode |
| `COOKIE_SECURE` | `True` | Enforces HTTPS on the auth cookie |
| `DATABASE_URL` | *(Linked from Postgres plugin)* | Auto-injected by Railway |

> [!NOTE]
> `PORT`, `RAILWAY_PUBLIC_DOMAIN`, and `NODE_ENV` are handled automatically.
> `ALLOWED_HOSTS` and `CSRF_TRUSTED_ORIGINS` automatically permit all `*.railway.app` and `*.up.railway.app` domains out of the box.

---

## Step 4 — Generate a Public Domain

1. In your service settings, click **Settings** → **Networking** → **Generate Domain**.
2. Railway will give you a public URL like `https://metsie-production.up.railway.app`.
3. Open the URL in your browser — your full app (Next.js + Django API) is live!

---

## Step 5 — Verify Live Production

```bash
# 1. Health check (returns 200 OK from Next.js home page)
curl -I https://<your-app>.up.railway.app/

# 2. Django API session check (returns 401 Unauthorized because no cookie sent yet — backend is live)
curl -I https://<your-app>.up.railway.app/api/auth/me/

# 3. Verify former dev backdoor is eliminated (returns 400 Bad Request)
curl -X POST https://<your-app>.up.railway.app/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username_or_email": "dev@metsie.local", "password": "devpassword123"}'
```

---

## Troubleshooting

- **Container Logs**: Go to **Deployments** → click the latest deploy → **Deploy Logs**. Supervisord logs output from `django`, `nextjs`, and `nginx` with clear prefixes.
- **Database Migrations**: `start.sh` automatically runs `python manage.py migrate --noinput` on container start before launching services.
- **Static Assets**: `collectstatic` runs on container boot to ensure Django Admin assets are up to date.
