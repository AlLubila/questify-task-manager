# Questify Task Manager (Backend-Only)

A minimal Node.js API built for local execution and containerization practice. This version is intentionally simplified: no frontend, no database, and in-memory data only.

## Overview
- **Service**: single Express API
- **State**: in-memory (resets on restart)
- **External dependencies**: none

## Requirements
- Node.js 18+

## Run Locally
```bash
cd backend
npm install
npm start
```

API runs at `http://localhost:4000`.

## Configuration
Optional environment variables:
- `PORT` (default `4000`)
- `FRONTEND_ORIGIN` (default `*`)

## API
All task endpoints require a bearer token returned by login/register.

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/tasks`
- `POST /api/tasks`
- `DELETE /api/tasks/:id`

## Example
Register:
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"secret123"}'
```

Use the token:
```bash
curl http://localhost:4000/api/tasks \
  -H "Authorization: Bearer <token>"
```

## Notes
- This service is stateless; all data is stored in memory.
- For persistence, add a database layer.
