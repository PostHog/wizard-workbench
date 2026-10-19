# nestjs-api

Orders and users API built with [NestJS](https://nestjs.com) 11.

## Requirements

- Node.js 24
- npm 11

## Setup

```bash
npm install
cp .env.example .env
```

Configuration is read from environment variables (and `.env` in development) through `@nestjs/config`:

| Variable               | Default                                 | Description              |
| ---------------------- | --------------------------------------- | ------------------------ |
| `PORT`                 | `3000`                                  | HTTP port                |
| `NODE_ENV`             | `development`                           | Reported by `/health`    |
| `PAYMENTS_GATEWAY_URL` | `https://payments.internal.example.com` | Payment gateway base URL |

## Running

```bash
npm run start:dev    # watch mode
npm run build        # compile to dist/
npm run start:prod   # run the compiled app
```

## Endpoints

| Method | Path                 | Description                         |
| ------ | -------------------- | ----------------------------------- |
| GET    | `/health`            | Liveness check                      |
| GET    | `/users`             | List users                          |
| GET    | `/users/:id`         | Get a user                          |
| GET    | `/orders`            | List active orders                  |
| GET    | `/orders/summary`    | Order total in `?currency=USD\|EUR` |
| GET    | `/orders/:id`        | Get an order                        |
| POST   | `/orders/:id/charge` | Charge a pending order              |

Errors are returned as JSON by the global exception filter in `src/common/all-exceptions.filter.ts`.

## Tests

```bash
npm test
npm run test:e2e
```

## Deployment

Pushes to `main` (and `v*` tags) run `.github/workflows/deploy.yml`, which lints, tests and builds the app, then builds the `Dockerfile` and pushes the image to `ghcr.io/<owner>/<repo>`.
