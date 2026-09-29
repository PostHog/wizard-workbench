# Orders API

Small Flask service behind gunicorn.

## Development

```bash
bin/dev              # creates .venv on first run, flask dev server on :8000
.venv/bin/pytest
```

## Deployment

Every push to `main` runs `.github/workflows/deploy.yml`: it builds the image
from `Dockerfile`, pushes it to GHCR, and replaces the `orders-api` container on
the production server over SSH. `.github/workflows/ci.yml` runs the tests on
pull requests and pushes.
