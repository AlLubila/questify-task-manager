# Questify Task Manager (Simplified)

This is a minimal backend-only project for learning Docker basics.

## Goals
Practice:
- writing a simple Dockerfile
- `docker build`
- `docker run` (single container)
- exposing a port
- `docker push`

## Stack
- Node.js + Express
- In-memory data (no database)

## Run Locally
```bash
cd backend
npm install
npm start
```

API runs on `http://localhost:4000`.

## Example Usage
Register:
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"secret123"}'
```

Use the returned token:
```bash
curl http://localhost:4000/api/tasks \
  -H "Authorization: Bearer <token>"
```

## Docker (single container)
A simple Dockerfile is provided at the repo root.

```bash
docker build -t questify-backend .
docker run -p 4000:4000 questify-backend
```
