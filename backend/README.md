# Questify Backend

Express + Prisma API for authentication and tasks.

## Requirements
- Node.js 18+
- PostgreSQL 14+

## Setup
1. Install dependencies:

```bash
npm install
```

2. Configure environment variables (already provided in `.env` for local use):

- `DATABASE_URL`
- `SESSION_SECRET`
- `FRONTEND_ORIGIN`
- `PORT`

3. Run migrations:

```bash
npx prisma migrate dev
```

4. Start the API:

```bash
npm run dev
```

## Scripts
- `npm run dev` watch mode
- `npm run start` production mode
- `npm run prisma:migrate` deploy migrations
- `npm run prisma:generate` generate Prisma client

## API
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/tasks`
- `POST /api/tasks`
- `DELETE /api/tasks/:id`
