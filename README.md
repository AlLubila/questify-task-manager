# Questify Tasks Monorepo

## Structure
- `backend/` Node.js API (Express + TypeScript + Prisma)
- `frontend/` React UI (Vite + TypeScript)
- `nginx/` Reverse proxy configuration

## Backend (local)
Requires a PostgreSQL database and Redis instance running locally.

```bash
cd backend
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

## Frontend (local)
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables
Backend (`backend/.env.example`):
- `PORT`
- `DATABASE_URL`
- `REDIS_URL`
- `JWT_SECRET`

Frontend (`frontend/.env.example`):
- `VITE_API_BASE` (default `/api`)

## Endpoints
Backend:
- `POST /auth/login`
- `POST /auth/logout`
- `GET /tasks`
- `POST /tasks`
- `DELETE /tasks/:id`
- `GET /health`

Frontend:
- `GET /` (static app)

Nginx:
- `GET /healthz`
- `/api/*` proxied to backend

## Notes
- Dockerfiles exist for `backend/` and `frontend/` only.
- No docker-compose is provided.
- The frontend calls `/api/*` and expects the reverse proxy to route it.
