# FastAPI Training API

A simple backend API built for containerization training. This service exposes a few HTTP endpoints and keeps data in memory only.

## Requirements
- Python 3.11+

## Setup
Install dependencies:

```bash
python -m pip install -r requirements.txt
```

## Run
Start the API server:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## Port
The API listens on port `8000`.

## Endpoints
- `GET /health`
- `GET /tasks`
- `POST /tasks`
- `DELETE /tasks/{task_id}`

## Notes
- All data is stored in memory and resets on restart.
- No database or external services are required.
