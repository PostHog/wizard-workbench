# PostHog Revenue Analytics Setup Report

## Summary

This project has been configured to pass `posthog_person_distinct_id` metadata to Stripe objects. This enables PostHog to join Stripe revenue data to person profiles, powering the **Top Customers dashboard**, `persons_revenue_analytics`, and `groups_revenue_analytics` tables.

## PostHog Distinct ID

The project identifies users with `posthog.get_distinct_id()` on the frontend (sourced from `posthog.identify(email, ...)`). This value is passed to the backend as `posthogDistinctId` and stored on each user record. The effective distinct_id used in Stripe metadata is `posthogDistinctId || email`.

## Files Modified

### `backend/routes/customers.ts`

Added `posthog_person_distinct_id` to the `metadata` of the existing `stripe.customers.create` call.

```ts
const customer = await stripe.customers.create({
  email,
  name,
  metadata: { posthog_person_distinct_id: posthogDistinctId || email },
});
```

### `backend/routes/checkout.ts`

- Added import for `getUser` from `../users`
- Resolved `posthogDistinctId` from the stored user record (falling back to `customerEmail`)
- Added `posthog_person_distinct_id` to the `metadata` of `stripe.checkout.sessions.create`
- Updated `client_reference_id` to use the PostHog distinct_id (so it is available in webhook handlers)

```ts
const user = userId ? getUser(userId) : undefined;
const posthogDistinctId = user?.posthogDistinctId || customerEmail;

const session = await stripe.checkout.sessions.create({
  // ...
  client_reference_id: posthogDistinctId || userId,
  metadata: { posthog_person_distinct_id: posthogDistinctId },
});
```

### `backend/routes/subscriptions.ts`

- Captured `posthogDistinctId` from the user lookup already present in the handler
- Conditionally added `posthog_person_distinct_id` to the `metadata` of `stripe.subscriptions.create`

```ts
let posthogDistinctId: string | undefined;
if (userId) {
  const user = getUser(userId);
  if (user) {
    posthogDistinctId = user.posthogDistinctId;
  }
}

const subscription = await stripe.subscriptions.create({
  // ...
  ...(posthogDistinctId ? { metadata: { posthog_person_distinct_id: posthogDistinctId } } : {}),
});
```

## Files Created

- `posthog-revenue-report.md` — this report

## Manual Steps Required

1. **Connect Stripe as a Data Source in PostHog** — Go to PostHog > Data pipelines > Sources and add your Stripe account. This pulls historical and ongoing revenue data into PostHog's data warehouse.

2. **Configure the Revenue Analytics dashboard** — In PostHog, navigate to Revenue Analytics and verify that person profiles are being matched using the `posthog_person_distinct_id` metadata on Stripe customers and subscriptions.

3. **Verify with a test transaction** — Create a test customer and subscription through your app and confirm the Stripe object has `posthog_person_distinct_id` set in its metadata (visible in the Stripe dashboard under the object's metadata tab).

4. **Stripe Webhook Secret** — Ensure `STRIPE_WEBHOOK_SECRET` is set in your environment so that webhook signature verification is active in production.
