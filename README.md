# Document Verification — Full Stack

```
e:\atm\
├── doc_verify/        ← FastAPI Python backend (port 8001)
│   ├── app/
│   │   ├── core/      — auth, config, response helpers
│   │   ├── models/    — Pydantic request models
│   │   ├── routers/   — 25 document-type endpoints
│   │   └── validators/
│   ├── .env           ← backend secrets (API_KEY, etc.)
│   ├── requirements.txt
│   └── run.py
├── src/               ← React + Vite + Tailwind frontend (port 5173)
│   ├── api/client.ts  — API client (proxied via Vite → backend)
│   ├── pages/
│   └── ...
├── .env               ← frontend env (VITE_API_BASE_URL, VITE_API_KEY)
├── vite.config.ts     ← /v1/* and /health proxied to :8001
├── start.bat          ← one-click start (opens 2 terminal windows)
└── package.json
```

---

## Quick Start

### One command (Windows)
```
start.bat
```
Opens two terminal windows: backend on `:8001`, frontend on `:5173`.

---

### Manual start

**Terminal 1 — Backend**
```bash
cd doc_verify
pip install -r requirements.txt    # first time only
python run.py
# → http://localhost:8001
# → http://localhost:8001/docs  (Swagger UI)
```

**Terminal 2 — Frontend**
```bash
npm install        # first time only
npm run dev
# → http://localhost:5173
```

---

## How the connection works

```
Browser (localhost:5173)
   │
   │  POST /v1/verify/aadhaar
   ▼
Vite Dev Server (proxy)
   │
   │  forwards to → http://localhost:8001/v1/verify/aadhaar
   ▼
FastAPI backend (doc_verify/run.py)
   │
   │  validates X-API-Key header
   │  runs document validator
   ▼
JSON response back to browser
```

The Vite proxy (`vite.config.ts → server.proxy`) forwards all `/v1/*` and `/health` requests to FastAPI — **no CORS config needed in development**.

---

## API Key

The API key must match between frontend and backend:

| Where | Variable | Default |
|---|---|---|
| Backend `doc_verify/.env` | `API_KEY` | `test-api-key-change-in-prod` |
| Frontend Settings page | localStorage `docverify_api_key` | (set via UI) |
| Frontend `.env` fallback | `VITE_API_KEY` | `test-api-key-change-in-prod` |

Go to `http://localhost:5173/settings` to set the API key in the UI.

---

## API Docs

- Swagger UI: http://localhost:8001/docs  
- ReDoc: http://localhost:8001/redoc
