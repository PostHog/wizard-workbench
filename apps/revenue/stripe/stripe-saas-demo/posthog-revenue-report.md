# PostHog Revenue Analytics — Setup Report

## Summary

Connected Stripe revenue data to PostHog by adding `posthog_person_distinct_id` metadata to Stripe objects. This enables the Top Customers dashboard and the `persons_revenue_analytics` / `groups_revenue_analytics` tables in PostHog's data warehouse.

## Distinct ID Used

`posthogDistinctId` — captured on the frontend via `posthog.get_distinct_id()` and stored on the user object. After `posthog.identify(email, ...)` is called, this value equals the user's email.

## Files Modified

### `backend/routes/customers.ts`

Added `posthog_person_distinct_id` to the `stripe.customers.create()` metadata. Both `posthogDistinctId` (from the request body) and `email` are in scope; the former is used with the latter as a fallback.

```ts
const customer = await stripe.customers.create({
  email,
  name,
  metadata: { posthog_person_distinct_id: posthogDistinctId || email },
});
```

### `backend/routes/checkout.ts`

- Imported `getUser` from `../users` to resolve the user's stored PostHog distinct ID.
- Set `client_reference_id` to the PostHog distinct ID (previously set to the internal `userId`).
- Added `subscription_data.metadata.posthog_person_distinct_id` to the `stripe.checkout.sessions.create()` call.

```ts
const user = userId ? getUser(userId) : undefined;
const posthogDistinctId = user?.posthogDistinctId || customerEmail;

const session = await stripe.checkout.sessions.create({
  // ...
  client_reference_id: posthogDistinctId,
  subscription_data: {
    metadata: { posthog_person_distinct_id: posthogDistinctId },
  },
});
```

### `backend/routes/subscriptions.ts`

Looked up the user's `posthogDistinctId` via the already-imported `getUser`, then conditionally added metadata to `stripe.subscriptions.create()`.

```ts
const posthogDistinctId = userId ? getUser(userId)?.posthogDistinctId : undefined;

const subscription = await stripe.subscriptions.create({
  // ...
  ...(posthogDistinctId ? { metadata: { posthog_person_distinct_id: posthogDistinctId } } : {}),
});
```

## Files Created

- `posthog-revenue-report.md` (this file)

## No Changes Made To

- `backend/routes/webhooks.ts` — no Stripe object creation calls; webhook PostHog capture logic already resolves the correct distinct ID.
- `frontend/` — no frontend changes required.
- All other backend files.

## Manual Steps Required

1. **Verify your Stripe secret key** is set in the backend environment (`STRIPE_SECRET_KEY`). New Stripe objects created after this change will carry the metadata automatically.

2. **Existing customers** — customers created before this change will not have the metadata on the customer object itself. PostHog will backfill the link when those customers make a new subscription or payment (which will carry the metadata). No manual Stripe customer updates are needed.

3. **Connect Stripe as a data source in PostHog** (if not already done):
   - Go to [Data Warehouse](https://us.posthog.com/data-warehouse) in PostHog.
   - Add Stripe as a source and enter your Stripe API key.
   - PostHog will automatically use `posthog_person_distinct_id` from the metadata to link revenue to person profiles.

4. Once connected, revenue data will appear in:
   - The [Revenue Analytics dashboard](https://us.posthog.com/revenue_analytics#top-customers)
   - The `persons_revenue_analytics` table in the data warehouse
   - The `groups_revenue_analytics` table in the data warehouse
