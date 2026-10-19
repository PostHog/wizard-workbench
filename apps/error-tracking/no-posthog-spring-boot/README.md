# orders-service

REST API for customer orders. Spring Boot 3, Java 17, Gradle.

## Requirements

- JDK 17

## Development

```bash
./gradlew bootRun
```

The service listens on port 8080 (override with `PORT`).

## Build and test

```bash
./gradlew build
```

The runnable jar is written to `build/libs/`.

## Endpoints

| Method | Path                        | Description          |
| ------ | --------------------------- | -------------------- |
| GET    | `/api/orders`               | List orders          |
| GET    | `/api/orders/{id}`          | Get one order        |
| POST   | `/api/orders/{id}/refund`   | Refund an order      |
| GET    | `/api/orders/reports/daily` | Daily order report   |
| GET    | `/actuator/health`          | Health check         |

Errors are returned as JSON: `{ "status", "error", "message", "path", "timestamp" }`.

## Docker

```bash
docker build -t orders-service .
docker run -p 8080:8080 orders-service
```

## Deployment

Pushes to `main` run `.github/workflows/deploy.yml`: build and test with Gradle, push the image to GHCR, then trigger the rollout webhook. The workflow needs the `DEPLOY_WEBHOOK_URL` and `DEPLOY_TOKEN` repository secrets.
