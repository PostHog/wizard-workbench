// Order API: accepts orders over HTTP, retries fulfillment in a background loop.
import express from 'express';

import { fulfillPending, pendingCount, submitOrder } from './fulfillment.js';

const app = express();
app.use(express.json());

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
  res.status(201).json(order);
});

app.get('/orders', (_req, res) => {
  res.json(orders);
});

app.get('/health', (_req, res) => {
  res.json({ ok: true, pending: pendingCount() });
});

// Background job: drain pending fulfillments every two seconds.
setInterval(() => {
  fulfillPending().catch(() => {});
}, 2000);

app.listen(5002, () => {
  console.log('express-orders listening on :5002');
});
