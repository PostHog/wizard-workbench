# express-orders

Tiny order API with a background fulfillment loop. No PostHog anywhere — the
fresh path under test: install `posthog-node`, initialize one client with
`metrics: { serviceName }`, instrument the request handling, the background
job, and the external call.

Run:

```bash
npm install
npm start
```

Traffic:

```bash
curl -X POST localhost:5002/orders -H 'Content-Type: application/json' -d '{"item": "widget", "qty": 2}'
curl localhost:5002/orders
curl localhost:5002/health
```
