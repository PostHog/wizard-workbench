// Order API: accepts orders over HTTP, retries fulfillment in a background loop.
import 'dotenv/config';
import express from 'express';
import { PostHog } from 'posthog-node';

import { fulfillPending, pendingCount, submitOrder } from './fulfillment.js';

const posthogApiKey = process.env.POSTHOG_API_KEY;
const posthogHost = process.env.POSTHOG_HOST;

if (process.env.NODE_ENV !== 'production' && !posthogApiKey) {
  throw new Error('POSTHOG_API_KEY variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_API_KEY is configured');
}

if (process.env.NODE_ENV !== 'production' && !posthogHost) {
  throw new Error('POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_HOST is configured');
}

export const posthog = posthogApiKey && posthogHost
  ? new PostHog(posthogApiKey, {
      host: posthogHost,
      enableExceptionAutocapture: true,
      metrics: { serviceName: 'express-orders' },
    })
  : null;

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  const startedAt = performance.now();
  res.on('finish', () => {
    const attributes = {
      method: req.method,
      route: req.route?.path ?? 'unmatched',
      outcome: res.statusCode < 500 ? 'success' : 'error',
    };
    posthog?.metrics.count('http.requests', 1, { attributes });
    posthog?.metrics.histogram('http.request.duration', performance.now() - startedAt, {
      unit: 'ms',
      attributes,
    });
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
  posthog?.metrics.count('orders.placed');
  posthog?.metrics.gauge('fulfillment.queue.depth', pendingCount());
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
  const startedAt = performance.now();
  let outcome = 'success';
  try {
    await fulfillPending(posthog);
  } catch {
    outcome = 'error';
  } finally {
    const attributes = { job: 'fulfillment', outcome };
    posthog?.metrics.count('jobs.processed', 1, { attributes });
    posthog?.metrics.histogram('job.duration', performance.now() - startedAt, {
      unit: 'ms',
      attributes,
    });
    posthog?.metrics.gauge('fulfillment.queue.depth', pendingCount());
  }
}, 2000);

app.listen(5002, () => {
  console.log('express-orders listening on :5002');
});
