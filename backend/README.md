# Questify Backend (Simplified)

Simple Express API with in-memory data. No database required.

## Requirements
- Node.js 18+

## Start
```bash
npm install
npm start
```

## Environment
- `PORT` (default 4000)
- `FRONTEND_ORIGIN` (default `*`)

## API
Authentication returns a token that must be sent as:
`Authorization: Bearer <token>`

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/tasks`
- `POST /api/tasks`
- `DELETE /api/tasks/:id`
