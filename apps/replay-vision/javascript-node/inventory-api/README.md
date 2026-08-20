# Inventory API (Node)

A bike-parts inventory JSON service on Node's built-in http module - no web framework, no frontend.
Test fixture for `wizard replay-vision` - the platform-gate abort (negative case).

Session replay cannot record a backend-only Node service, so there is nothing for
Replay Vision to watch here.

Expected wizard outcome:

- detects a plain Node backend, then aborts at the session-replay platform gate, before any agent work
- makes **no** code changes and calls no scanner endpoints

## Getting started

```bash
npm install
npm start
```

Open http://localhost:8000/items.
