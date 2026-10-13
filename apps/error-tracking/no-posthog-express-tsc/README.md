# express-tsc-esm

Catalog and checkout API built with Express 5 and TypeScript (native ES modules, compiled with `tsc`).

## Requirements

- Node.js 24
- npm 11

## Development

```bash
npm install
npm run dev        # tsx watch, restarts on change
```

The server listens on `PORT` (default `3000`).

## Production build

```bash
npm run build      # tsc -> dist/
npm start          # node dist/server.js
```

## Endpoints

| Method | Path                 | Description                                          |
| ------ | -------------------- | ---------------------------------------------------- |
| GET    | `/health`            | Liveness check                                       |
| GET    | `/products`          | List products                                        |
| GET    | `/products/:sku`     | Get a product                                        |
| POST   | `/checkout`          | Reserve stock: `{ "sku": "MUG-001", "quantity": 2 }` |
| GET    | `/reports/low-stock` | Products below the low-stock threshold               |

## Project layout

```
src/
  server.ts        app setup, error handler, listen
  routes/          one router per resource
  lib/             catalog, inventory client, HTTP errors
```

## Deployment

The service runs on Render, defined in `render.yaml`. `.github/workflows/ci.yml` builds every push and pull request; on `main` it then calls the Render deploy hook stored in the `RENDER_DEPLOY_HOOK_URL` repository secret.
