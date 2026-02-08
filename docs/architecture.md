# Architecture (Simplified)

Questify is now a single backend-only Node.js app for Docker training.

## Components
- **Backend**: Express API with in-memory users and tasks.
- **Storage**: In-memory Maps (data resets on restart).

## Data Flow
1. Register or log in to receive a token.
2. Send `Authorization: Bearer <token>` for task endpoints.
3. Tasks are stored per user in memory.

## Why Simplified
This version removes the frontend, database, and orchestration so you can practice:
- writing a Dockerfile
- building and running a single container
- exposing ports
