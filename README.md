# Metsie: Next.js + Modular Django Services

A clean, decoupled full-stack starter featuring **Next.js (Tailwind CSS, App Router)** and a **modular Django backend (`/services`)** designed with separate single-responsibility files and **7-day httpOnly JWT cookies** (zero `localStorage`).

---

## 📁 Project Structure

```text
Metsie/
├── client/                     # Next.js frontend (Tailwind CSS, App Router)
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx      # Root layout & AuthProvider
│   │   │   ├── page.tsx        # Overview & session status landing page
│   │   │   ├── login/          # Login page
│   │   │   ├── register/       # Registration page
│   │   │   ├── account-setup/  # Profile onboarding step
│   │   │   └── dashboard/      # Protected user dashboard
│   │   ├── components/
│   │   │   └── Navbar.tsx      # Responsive navigation & dynamic auth state
│   │   ├── context/
│   │   │   └── AuthContext.tsx # User session hydration (/api/auth/me/)
│   │   └── lib/
│   │       └── api.ts          # Fetch wrapper with credentials: 'include'
│   ├── next.config.ts          # Proxies /api/* to Django in dev (no CORS issues)
│   └── package.json
│
├── services/                   # Django backend (services root)
│   ├── manage.py
│   ├── config/                 # Core settings and URL routing
│   │   ├── settings.py         # App config, CORS, and cookie settings
│   │   ├── urls.py             # Root URL router (/api/auth/...)
│   │   ├── wsgi.py
│   │   └── asgi.py
│   ├── auth/                   # Authentication service (modular jobs)
│   │   ├── apps.py             # AppConfig (labeled auth_service)
│   │   ├── models.py           # UserProfile model & signal
│   │   ├── jwt.py              # 7-day token signing, decoding, cookie logic
│   │   ├── authentication.py   # DRF CookieJWTAuthentication backend
│   │   ├── serializers.py      # Registration, Login, and User serializers
│   │   ├── views.py            # Register, Login, Logout, and Me endpoints
│   │   ├── account_setup.py    # Dedicated account onboarding service & view
│   │   ├── urls.py             # Auth route mappings
│   │   └── tests.py            # Unit tests for auth & cookies
│   ├── requirements.txt
│   └── .env                    # Environment config
│
├── nginx/
│   └── nginx.conf              # Production Nginx reverse proxy configuration
│
├── dev.sh                      # One-command development runner
└── README.md
```

---

## 🔒 Security Architecture: 7-Day HttpOnly Cookies

Rather than storing vulnerable tokens inside `localStorage` or `sessionStorage` (which can be read by malicious scripts during XSS attacks):

1. **HttpOnly**: The `access_token` cookie is flagged `HttpOnly = True`, strictly inaccessible to JavaScript running in the browser.
2. **Lifespan**: Set to exactly 7 days (`max_age = 604800` seconds / `JWT_EXPIRATION_DAYS = 7`).
3. **SameSite**: Set to `Lax` to safeguard against cross-site request forgery (CSRF).
4. **Transparent Transmission**: Every request made from the frontend uses `credentials: 'include'` (configured in [`client/src/lib/api.ts`](client/src/lib/api.ts)).
5. **Session Hydration**: On initial load, [`AuthContext.tsx`](client/src/context/AuthContext.tsx) calls `/api/auth/me/`. If a valid 7-day cookie exists, the user session is hydrated immediately.

---

## 🧩 Modular Backend Design (Separate Job Files)

Instead of dumping everything into one monolithic `views.py`:

- **[`services/auth/jwt.py`](services/auth/jwt.py)**: Pure token generation, validation, and cookie set/clear logic.
- **[`services/auth/authentication.py`](services/auth/authentication.py)**: DRF custom authentication class pulling the token from cookies.
- **[`services/auth/account_setup.py`](services/auth/account_setup.py)**: Isolated service and API view handling post-signup profile onboarding.
- **[`services/auth/serializers.py`](services/auth/serializers.py)**: Strict input validation and serialization.
- **[`services/auth/views.py`](services/auth/views.py)**: Endpoints for Register, Login, Logout, and Me.

---

## 🧪 Testing & Linting (Separated Commands)

Tests and lint checks are strictly separated into dedicated scripts and npm commands:

```bash
# 1. Run Unit Tests (JWT, Login Auth & Cookies, Account Setup)
npm run test:unit

# 2. Run End-to-End Flow Tests (Full User Lifecycle)
npm run test:e2e

# 3. Run Lint Checks (Backend Ruff + Frontend ESLint)
npm run lint

# Or individually:
npm run lint:backend   # Ruff check services/
npm run lint:frontend  # ESLint in client/
```

### What the Unit Tests Verify (`npm run test:unit`):
1. **Login with Username & Password**:
   - Returns `200 OK` with user details.
   - Attaches `access_token` cookie with `HttpOnly=True`, `max-age=604800` (7 days), `SameSite=Lax`, and `path=/`.
   - Ensures JWT token is NOT exposed in the JSON response body.
   - Decodes JWT cryptographically to confirm user identity and signature.
2. **Login with Email & Password**:
   - Case-insensitive lookup and proper 7-day cookie attachment.
3. **Subsequent Authenticated Requests**:
   - Protected endpoints (`/api/auth/me/`) validate the incoming cookie and return the session.
4. **Invalid Credentials & Inactive Accounts**:
   - Rejects bad passwords, unknown accounts, and inactive accounts with `400 Bad Request` and sets NO cookies.
5. **Cookie Helpers & Expiration**:
   - Tests signature tampering detection and rejection of expired tokens.
6. **Account Onboarding**:
   - Tests profile saving and sets `is_onboarded=True`.

---

## 🚀 Quick Start (Development)

### Option 1: Start Both Services Concurrently (Recommended)

Run the included runner script from the project root:

```bash
./dev.sh
```

This starts:
- **Next.js Client**: `http://localhost:3000`
- **Django Backend**: `http://127.0.0.1:8000`

---

### Option 2: Run Services in Separate Terminals

#### 1. Backend (`/services`)

```bash
cd services

# Activate virtualenv (already set up in services/.venv)
source .venv/bin/activate

# Run migrations (already applied)
python manage.py migrate

# Start development server
python manage.py runserver 127.0.0.1:8000
```

#### 2. Frontend (`/client`)

```bash
cd client

# Install dependencies (already installed)
npm install

# Start Next.js development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

---

---

## 🐳 Container Architecture: Dedicated Auth PostgreSQL & Dockerfiles

The stack includes production-ready Dockerfiles and a `docker-compose.yml` that implements the **Database-per-Service** pattern:

- **Dedicated Auth DB (`auth-db`)**: Runs PostgreSQL 16 Alpine specifically for the authentication service. It is attached to an internal private network (`auth_internal_net`), strictly isolating it from external traffic.
- **Auth Service (`auth-service`)**: Built with [`services/Dockerfile`](services/Dockerfile), connects to `auth-db` via the internal network, waits for database readiness, runs migrations automatically on container start, and serves requests via Gunicorn.
- **Client (`client`)**: Multi-stage build in [`client/Dockerfile`](client/Dockerfile) using Node 20 Alpine and a non-root system user.
- **Nginx (`nginx`)**: Reverse proxy in [`nginx/Dockerfile`](nginx/Dockerfile) and [`nginx/nginx.conf`](nginx/nginx.conf) routing `/api/` to `auth-service` and `/` to `client`.

### Running with Docker (When Ready)

```bash
docker compose up --build -d
```

> **Note**: For local development on machines with limited resources, you don't need to run Docker. You can run `./dev.sh` to run the frontend and backend locally with SQLite.

---

## 📡 API Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register/` | Register user & set 7-day httpOnly cookie | No |
| `POST` | `/api/auth/login/` | Log in user & set 7-day httpOnly cookie | No |
| `POST` | `/api/auth/logout/` | Expire & delete auth cookie | No |
| `GET` | `/api/auth/me/` | Retrieve current authenticated user | Yes (Cookie) |
| `GET` | `/api/auth/account-setup/` | Get onboarding details | Yes (Cookie) |
| `POST` | `/api/auth/account-setup/` | Save onboarding profile details | Yes (Cookie) |
