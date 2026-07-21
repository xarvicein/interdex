# InterDex

A full-stack SaaS app for browsing and contributing programming interview questions and answers (Python, SQL, TypeScript, JavaScript, React, System Design). Every category, question, answer, and tag is stored in PostgreSQL — nothing is hardcoded in the frontend.

## Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui (Radix), Zustand (client state), TanStack Query (server state), Monaco Editor, react-hook-form + zod
- **Backend**: Express, TypeScript, Prisma ORM, PostgreSQL, JWT auth (access + refresh) with Google OAuth 2.0 SSO
- **Infra**: Docker Compose for `backend` + `frontend`. PostgreSQL runs **outside** Docker Compose — point `DATABASE_URL` at any reachable Postgres instance.

## Project layout

```
packages/
  shared/    # TS types/enums shared by frontend and backend
  backend/   # Express API + Prisma schema/migrations/seed
  frontend/  # React SPA
```

## Prerequisites

- Node.js 22+, npm 11+ (only needed for local dev outside Docker)
- A running PostgreSQL 14+ instance reachable from your machine (and from Docker containers, if using Compose)
- Optional: a Google Cloud OAuth 2.0 Client ID/Secret for Google SSO

## 1. Configure environment

```bash
cp .env.example .env
```

Fill in:
- `DATABASE_URL` — your external Postgres connection string. If Postgres runs on your host machine and the backend runs in Docker, use `host.docker.internal` instead of `localhost` as the hostname (Docker Desktop on Windows/Mac).
- `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` — generate with `openssl rand -base64 48` (or any random string generator).
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` / `GOOGLE_CALLBACK_URL` — see [Google SSO setup](#google-sso-setup) below. Leave blank to disable Google sign-in (the UI hides the button automatically).
- `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` — credentials for the admin account the seed script creates.

Also copy `packages/frontend/.env.example` to `packages/frontend/.env` for local (non-Docker) frontend dev.

## 2. Install dependencies (local dev)

```bash
npm install
```

## 3. Run database migrations + seed

```bash
npm run build:shared
npm run prisma:generate
npm run prisma:migrate     # creates tables (dev migration)
npm run prisma:seed        # creates admin user + ~200 approved Q&A across 6 categories
```

## 4. Run locally (without Docker)

```bash
npm run dev:backend   # http://localhost:4000
npm run dev:frontend  # http://localhost:5173
```

## 5. Run with Docker Compose

Postgres is **not** included in `docker-compose.yml` — it must already be running and reachable via `DATABASE_URL` in `.env`.

```bash
docker compose up --build
```

This starts:
- `backend` on `:4000` — runs `prisma migrate deploy` automatically on container start
- `frontend` on `:5173` — nginx serving the production Vite build

Run the seed once (from your host, against the same `DATABASE_URL`):

```bash
npm run prisma:seed
```

## Google SSO setup

1. In the [Google Cloud Console](https://console.cloud.google.com/apis/credentials), create an **OAuth 2.0 Client ID** (type: Web application).
2. Add an authorized redirect URI matching `GOOGLE_CALLBACK_URL`, e.g. `http://localhost:4000/api/auth/google/callback`.
3. Copy the Client ID/Secret into `.env`.
4. Restart the backend. The "Continue with Google" button appears automatically on `/login` and `/register` once `GET /api/auth/google/status` reports `enabled: true`.

## How the review workflow works

- Any signed-in user can submit a new question with one or more answers (`POST /api/questions`) — it's created with `status = PENDING` and is invisible on public listings.
- Any signed-in user can also propose an additional answer to an already-approved question (`POST /api/questions/:id/answers`) — that answer starts `PENDING` independently of the question.
- Admins review both queues from **Admin → Review queue** (`/admin/review`), approving or rejecting with an optional note. Approving a question also approves any answers submitted alongside it.
- Categories are fully DB-managed under **Admin → Manage Categories** (`/admin/categories`) — no code changes needed to add a new category.

## Default accounts after seeding

| Role  | Email                     | Password (from `.env`)   |
|-------|----------------------------|---------------------------|
| Admin | value of `SEED_ADMIN_EMAIL` | value of `SEED_ADMIN_PASSWORD` |

Register a normal account via `/register` to test the submit → review → publish flow end-to-end.
