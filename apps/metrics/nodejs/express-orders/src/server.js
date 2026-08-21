// Order API: accepts orders over HTTP, retries fulfillment in a background loop.
import express from 'express';
import { PostHog } from 'posthog-node';

const POSTHOG_KEY = process.env.POSTHOG_API_KEY;
const POSTHOG_HOST = process.env.POSTHOG_HOST ?? 'https://us.i.posthog.com';

let posthog;
if (POSTHOG_KEY) {
  posthog = new PostHog(POSTHOG_KEY, {
    host: POSTHOG_HOST,
    metrics: { serviceName: 'express-orders' },
  });
} else if (process.env.NODE_ENV !== 'production') {
  console.error('POSTHOG_API_KEY variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_API_KEY is configured');
}
if (posthog) initMetrics(posthog);

import { fulfillPending, initMetrics, pendingCount, submitOrder } from './fulfillment.js';

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    if (!posthog) return;
    const route = req.route?.path ?? 'unknown';
    const attrs = { method: req.method, route, status: String(res.statusCode) };
    posthog.metrics.count('http.requests', 1, { attributes: attrs });
    posthog.metrics.histogram('http.request.duration', Date.now() - start, { unit: 'ms', attributes: attrs });
  });
  next();
});

const orders = [];

app.post('/orders', (req, res) => {
  const order = {
    id: orders.length + 1,
    item: req.body.item ?? 'unknown',
    qty: Number(req.body.qty ?? 1),
    createdAt: Date.now(),
  };
  orders.push(order);
  submitOrder(order);
  if (posthog) posthog.metrics.count('orders.placed', 1);
  res.status(201).json(order);
});

app.get('/orders', (_req, res) => {
  res.json(orders);
});

app.get('/health', (_req, res) => {
  res.json({ ok: true, pending: pendingCount() });
});

// Background job: drain pending fulfillments every two seconds.
setInterval(async () => {
  if (posthog) posthog.metrics.gauge('queue.depth', pendingCount());
  const start = Date.now();
  await fulfillPending().catch(() => {});
  if (posthog) {
    posthog.metrics.count('job.runs', 1);
    posthog.metrics.histogram('job.duration', Date.now() - start, { unit: 'ms' });
  }
}, 2000);

app.listen(5002, () => {
  console.log('express-orders listening on :5002');
});
