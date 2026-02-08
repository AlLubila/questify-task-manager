# Questify Task Manager

Questify is a lightweight Trello/Todo-style task manager built as a full-stack SaaS-ready application.

## Stack
- **Frontend**: React (Vite) served by Node
- **Backend**: Node.js + Express + Prisma ORM
- **Database**: PostgreSQL

## Requirements
- Docker (recommended) or Node.js 18+ + PostgreSQL 14+

## Project Structure
- `frontend/` React application
- `backend/` Express API + Prisma
- `docs/` architecture notes

## Ports
- Frontend server: `5173`
- Backend API: `4000`
- PostgreSQL: `5432`

## Quick Start (Docker)
```bash
docker-compose up --build
```

Open the app in your browser at `http://localhost:5173`.

## Run Locally (without Docker)
### 1) Database
Create a local database named `questify` and ensure your Postgres user/password match `backend/.env`.

### 2) Backend
```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
```

### 3) Frontend
```bash
cd frontend
npm install
npm run dev
```

Open the app in your browser at `http://127.0.0.1:5173`.

## Production-like Build
### Backend
```bash
cd backend
npm install
npm run prisma:migrate
npm run start
```

### Frontend
```bash
cd frontend
npm install
npm run build
npm run start
```

## Environment Variables
All required environment variables are already provided via `.env` files for local execution.

Backend (`backend/.env`):
- `PORT`
- `DATABASE_URL`
- `SESSION_SECRET`
- `FRONTEND_ORIGIN`

Frontend (`frontend/.env`):
- `VITE_API_URL`
- `PORT`

## Notes
- Authentication is session-based (no JWT, no external auth providers).
- API is RESTful and scoped to the logged-in user.
- Prisma migrations are included in `backend/prisma/migrations`.
- `docker-compose up --build` runs PostgreSQL and applies migrations automatically.
