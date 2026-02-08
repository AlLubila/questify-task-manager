# Architecture

Questify is a lightweight task management SaaS-style app with a React frontend and a Node/Express backend.

## Components
- **Frontend**: React SPA built with Vite. In production, static assets are served by a Node server (`frontend/server.js`).
- **Backend**: Express API with session-based authentication and Prisma ORM.
- **Database**: PostgreSQL, with Prisma migrations committed to the repo.

## Data Flow
1. User registers or logs in via `/api/auth/*`.
2. A session cookie is stored by the backend (no external auth providers).
3. Task CRUD is scoped to the authenticated user via `/api/tasks/*`.

## Configuration
All services use environment variables with default local values committed in `.env` files. This allows the app to run locally without extra setup and to be containerized by DevOps later.
