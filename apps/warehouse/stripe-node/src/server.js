import express from 'express';

import { posthog, shutdown } from './analytics.js';
import { PLANS, stripe } from './stripe.js';

const app = express();

/**
 * Stripe signs webhooks over the RAW body, so this route has to see the bytes
 * before any JSON parser touches them. It is registered ahead of
 * `express.json()` for that reason.
 */
app.post(
  '/webhooks/stripe',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        req.headers['stripe-signature'],
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (error) {
      return res.status(400).send(`Webhook signature failed: ${error.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      posthog.capture({
        distinctId: session.client_reference_id ?? session.customer,
        event: 'subscription started',
        properties: { plan: session.metadata?.plan, amount: session.amount_total },
      });
    }

    res.json({ received: true });
  },
);

app.use(express.json());

app.post('/checkout', async (req, res) => {
  const { plan, userId } = req.body;
  const price = PLANS[plan];
  if (!price) return res.status(400).json({ error: 'unknown plan' });

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price, quantity: 1 }],
    client_reference_id: userId,
    metadata: { plan },
    success_url: 'https://example.com/billing/done',
    cancel_url: 'https://example.com/billing',
  });

  res.json({ url: session.url });
});

app.get('/customers/:id/invoices', async (req, res) => {
  const invoices = await stripe.invoices.list({
    customer: req.params.id,
    limit: 20,
  });
  res.json(invoices.data.map(({ id, total, status }) => ({ id, total, status })));
});

const server = app.listen(process.env.PORT ?? 3000);

process.on('SIGTERM', () => {
  server.close(shutdown);
});
