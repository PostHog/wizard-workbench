# inventory-api

Inventory and stock-level API built with FastAPI. Dependencies are managed with [uv](https://docs.astral.sh/uv/).

## Requirements

- [uv](https://docs.astral.sh/uv/getting-started/installation/) (installs Python 3.13 from `.python-version` if needed)

## Setup

```bash
uv sync
```

## Running locally

```bash
uv run uvicorn app.main:app --reload
```

The API is at http://127.0.0.1:8000 and the interactive docs at `/docs`.

## Endpoints

| Method | Path                      | Description                     |
| ------ | ------------------------- | ------------------------------- |
| GET    | `/healthz`                | Health check                    |
| GET    | `/items`                  | List items                      |
| GET    | `/items/{sku}`            | Get one item                    |
| GET    | `/items/{sku}/reorder`    | Reorder lead time for an item   |
| GET    | `/reports/stock-levels`   | Stock totals per warehouse      |
| GET    | `/reports/supplier-sync`  | Sync supplier feeds             |

Unhandled errors return `500` with `{"error": "internal_error", "detail": "..."}`.

## Tests and linting

```bash
uv run pytest
uv run ruff check
```

## Project layout

```
src/app/main.py        FastAPI app and error handler
src/app/routers/       Route modules
tests/                 API tests
```

## Deployment

The app deploys to Fly.io (`fly.toml`, `Dockerfile`). Pushes to `main` run `.github/workflows/deploy.yml`, which lints, tests and runs `flyctl deploy`. It needs the `FLY_API_TOKEN` repository secret.
