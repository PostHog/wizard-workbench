# nextjs-storefront

Minimal full-stack Next.js shop: a client page with `posthog-js` initialized,
and a checkout route handler that calls a payment API server-side.

The disambiguation under test: metrics measure service work, so the right
variant is the **server** one — a fresh `posthog-node` client for the route
handler — not bolting metrics onto the existing browser client.

Run:

```bash
npm install
npm run dev
```

Traffic: open http://localhost:3000 and click "Buy a widget", or

```bash
curl -X POST localhost:3000/api/checkout -H 'Content-Type: application/json' -d '{"item": "widget", "qty": 1}'
```
