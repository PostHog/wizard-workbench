# Inventory API (FastAPI)

A pure-backend JSON service with no web frontend. Negative test app for `wizard replay-vision`.

What this app exercises:

- **The platform gate**: session replay cannot record a backend-only Python service, so the run must abort at framework detection with the friendly "session replay isn't available for this platform" message - before any agent work, skill installs, or scanner calls.

## Getting started

```bash
pip install -r requirements.txt
uvicorn main:app --reload
```

Open http://localhost:8000/docs.
