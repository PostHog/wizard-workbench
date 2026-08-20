# Inventory API (FastAPI)

A pure-backend JSON service with no web frontend.
Test fixture for `wizard replay-vision` - the platform-gate abort (negative case).

Session replay cannot record a backend-only Python service, so there is nothing for
Replay Vision to watch here.

Expected wizard outcome:

- aborts at framework detection with the "session replay isn't available for this platform" message
- makes **no** code changes, installs no skills, and calls no scanner endpoints

## Getting started

```bash
pip install -r requirements.txt
uvicorn main:app --reload
```

Open http://localhost:8000/docs.
