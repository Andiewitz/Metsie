# Metsie Railway Deployment Guide

> Railway deploys Metsie as two separate services (**Backend** + **Frontend**) connected to a managed **PostgreSQL** database.

---

## Architecture on Railway

```
Internet → Frontend Service (Next.js) → /api/* → Backend Service (Django)
                                                         ↓
                                               PostgreSQL Plugin (DB)
```

- **Frontend**: Next.js 16 container, serves the UI, proxies `/api/*` to the Backend internally.
- **Backend**: Django 5.1 + Gunicorn, handles auth, JWT cookies, and all API logic.
- **Database**: Railway Postgres plugin — `DATABASE_URL` is auto-injected into the Backend.

---

## Prerequisites

- A [Railway](https://railway.app) account
- Your GitHub repo connected to Railway
- The Metsie repo at `github.com/Andiewitz/Metsie`

---

## Step 1 — Create a New Railway Project

1. Go to [railway.app/new](https://railway.app/new)
2. Click **Deploy from GitHub repo**
3. Select **Andiewitz/Metsie**

---

## Step 2 — Add the PostgreSQL Plugin

1. In your project dashboard, click **+ New** → **Database** → **Add PostgreSQL**
2. Railway provisions Postgres 16 and creates a `DATABASE_URL` variable automatically.

---

## Step 3 — Deploy the Backend Service

### Settings
- **Root Directory**: `services`
- **Dockerfile Path**: `Dockerfile`
- **Service Name**: `metsie-backend`

### Environment Variables

| Variable | Value |
|---|---|
| `DJANGO_SECRET_KEY` | Generate: `python -c "import secrets; print(secrets.token_urlsafe(50))"` |
| `JWT_SECRET_KEY` | Generate a separate strong random key |
| `DEBUG` | `False` |
| `ENVIRONMENT` | `production` |
| `COOKIE_SECURE` | `True` |
| `CORS_ALLOWED_ORIGINS` | `https://<frontend-domain>.up.railway.app` |
| `CSRF_TRUSTED_ORIGINS` | `https://<frontend-domain>.up.railway.app` |

**Link `DATABASE_URL`** from the Postgres plugin via the Variables tab → **+ Link Variable**.

`RAILWAY_PUBLIC_DOMAIN` and `PORT` are injected automatically by Railway.

---

## Step 4 — Deploy the Frontend Service

### Settings
- **Root Directory**: `client`
- **Dockerfile Path**: `Dockerfile`
- **Service Name**: `metsie-frontend`

### Environment Variables

| Variable | Value |
|---|---|
| `BACKEND_INTERNAL_URL` | `https://<backend-domain>.up.railway.app` |
| `NODE_ENV` | `production` |

> **Tip**: For private networking (lower latency), use `http://metsie-backend.railway.internal:8000` instead.

---

## Step 5 — Verify Live Production

```bash
# Backend health (expect 401 — service is up, just unauthenticated)
curl -I https://<backend>.up.railway.app/api/auth/me/

# Login with a real user (expect 200 + Set-Cookie)
curl -X POST https://<frontend>.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username_or_email": "youruser", "password": "yourpassword"}'

# Confirm dev backdoor is gone (expect 400)
curl -X POST https://<frontend>.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username_or_email": "dev@metsie.local", "password": "devpassword123"}'
```

---

## Environment Variable Reference

### Backend (`services/`)

| Variable | Required | Description |
|---|---|---|
| `DJANGO_SECRET_KEY` | ✅ | Django secret — generate fresh for production |
| `JWT_SECRET_KEY` | ✅ | JWT signing key — different from SECRET_KEY |
| `DATABASE_URL` | ✅ (auto) | Injected by Railway Postgres plugin |
| `DEBUG` | ✅ | `False` in production |
| `ENVIRONMENT` | ✅ | `production` |
| `COOKIE_SECURE` | ✅ | `True` (Railway uses HTTPS) |
| `CORS_ALLOWED_ORIGINS` | ✅ | Frontend Railway URL |
| `CSRF_TRUSTED_ORIGINS` | ✅ | Frontend Railway URL |

### Frontend (`client/`)

| Variable | Required | Description |
|---|---|---|
| `BACKEND_INTERNAL_URL` | ✅ | Backend service URL |
| `NODE_ENV` | ✅ | `production` |
