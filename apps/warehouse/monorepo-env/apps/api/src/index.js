import express from 'express';

import { activeSubscriptions, invoices } from './billing.js';

const app = express();

app.get('/stats', (_req, res) => {
  res.json({ openTickets: 42, medianFirstResponseMinutes: 17 });
});

app.get('/customers/:id/billing', async (req, res) => {
  const [subs, bills] = await Promise.all([
    activeSubscriptions(req.params.id),
    invoices(req.params.id),
  ]);
  res.json({ subscriptions: subs.data, invoices: bills.data });
});

app.listen(process.env.PORT ?? 4000);
