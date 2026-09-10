# Stripe billing service (Node)

An Express billing service that sells two subscription plans through Stripe
and reports conversions to PostHog with `posthog-node`. Test fixture for
`wizard warehouse` — the single-source baseline.

## The regression it guards

This is the simplest run the flow supports: one detected source, one credential
batch, one create. It fails first when anything in the happy path breaks, so it
tells you *whether* the flow works before the harder apps tell you *how* it
broke.

Expected wizard outcome:

- detects **Stripe** and nothing else — `stripe` in `package.json`, plus
  `STRIPE_SECRET_KEY` in `.env`
- asks for the Stripe credentials in **one or two** batches, never more
- creates one `Stripe` source through the MCP, with `source_type` spelled
  exactly `Stripe`
- writes a report that names the source it created

`STRIPE_WEBHOOK_SECRET` sits next to the API key on purpose. It must not add a
second signal — the registry pattern is anchored to `STRIPE_SECRET_KEY` and
`STRIPE_API_KEY`.

`POSTHOG_API_KEY` and `POSTHOG_HOST` are here because a real billing service
that already reports to PostHog is the common case. Neither is a warehouse
signal, and `forbidKinds` proves it.

## Getting started

```bash
npm install
npm start
```

`POST /checkout` opens a Stripe Checkout session. `POST /webhooks/stripe`
receives the completion event.
