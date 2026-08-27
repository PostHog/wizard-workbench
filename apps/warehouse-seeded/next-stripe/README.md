# Storefront (Next.js + Stripe)

A Next.js App Router storefront that sells two subscription plans through
Stripe Checkout. PostHog is **not** installed. Test fixture for the seeded
warehouse task — the keep-the-notice case.

## The regression it guards

The warehouse step here is not a command the user ran. It is a task the wizard
queued inside the default install run, and it only exists because detection
found `stripe` in `package.json` and `STRIPE_SECRET_KEY` in `.env.local`.

That makes four things testable that the standalone command cannot reach:

1. The task is queued at all. It is dropped in CI and during signup, so a run
   that forgets to keep the `wizard_ask` bridge alive silently loses it.
2. The user is shown a notice before the run starts, minutes before the
   credential prompt arrives.
3. The task runs at the **end** of the queue, after the code changes, not at
   the start.
4. The task reaches a terminal status. A task left running at the end of the
   run is the failure this fixture is here to catch.

Expected wizard outcome:

- installs PostHog into the app (the integration part of the run)
- shows **one** task notice covering Stripe
- asks for the Stripe credentials in **one or two** batches, never more
- creates one `Stripe` source through the MCP, with `source_type` spelled
  exactly `Stripe`
- writes a report that names the source it created
- ends the warehouse task `completed`

`STRIPE_WEBHOOK_SECRET` sits next to the API key on purpose. It must not add a
second signal — the registry pattern is anchored to `STRIPE_SECRET_KEY` and
`STRIPE_API_KEY`.

The decline half of the scenario lives in
[`../next-stripe-declined`](../next-stripe-declined), which runs this same
source tree.

## Getting started

```bash
npm install
npm run dev
```

`POST /api/checkout` opens a Stripe Checkout session for the cart it is given.
