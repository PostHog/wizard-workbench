# PostHog Revenue Analytics — Setup Report

## Summary

Three backend route files were modified to attach `posthog_person_distinct_id` metadata to Stripe objects. This enables PostHog to connect Stripe revenue data to person profiles, powering the Top Customers dashboard and `persons_revenue_analytics` / `groups_revenue_analytics` data warehouse tables.

## PostHog distinct_id

The project identifies users with their email address via `posthog.identify(email, ...)` in `frontend/src/pages/Home.tsx`. Before creating a customer, the frontend calls `posthog.get_distinct_id()` and passes the result to the backend as `posthogDistinctId`, which is then stored on the `User` model.

## Files Modified

### `backend/routes/customers.ts`

Added `posthog_person_distinct_id` to the metadata of `stripe.customers.create`. The `posthogDistinctId` value is already present in the request body.

```ts
const customer = await stripe.customers.create({
  email,
  name,
  ...(posthogDistinctId && { metadata: { posthog_person_distinct_id: posthogDistinctId } }),
});
```

### `backend/routes/checkout.ts`

- Added import of `getUser` from `../users`
- Looks up the user's `posthogDistinctId` via `getUser(userId)`
- Adds `subscription_data.metadata.posthog_person_distinct_id` to `stripe.checkout.sessions.create` (subscription mode)

```ts
const posthogDistinctId = userId ? getUser(userId)?.posthogDistinctId : undefined;

const session = await stripe.checkout.sessions.create({
  // ...existing params...
  ...(posthogDistinctId && {
    subscription_data: {
      metadata: { posthog_person_distinct_id: posthogDistinctId },
    },
  }),
});
```

### `backend/routes/subscriptions.ts`

Looks up the user's `posthogDistinctId` via `getUser(userId)` (already imported) and adds it to `stripe.subscriptions.create` metadata.

```ts
const posthogDistinctId = userId ? getUser(userId)?.posthogDistinctId : undefined;

const subscription = await stripe.subscriptions.create({
  // ...existing params...
  ...(posthogDistinctId && { metadata: { posthog_person_distinct_id: posthogDistinctId } }),
});
```

## Files Created

- `posthog-revenue-report.md` — this report

## Manual Steps

1. **Connect Stripe as a data source in PostHog** — go to [PostHog Data Pipeline](https://us.posthog.com/pipeline/sources) and add your Stripe account as a revenue source if you haven't already.

2. **Verify the metadata appears on new Stripe objects** — after deploying, create a test customer and subscription in your Stripe dashboard and confirm the `posthog_person_distinct_id` metadata key is present on the Customer and Subscription objects.

3. **Existing customers** — customers created before this change won't have the metadata on their Customer object. PostHog will pick it up from subscriptions or invoices created going forward, so no backfill is needed unless you want immediate coverage of historical customers.

4. **Deploy the backend** — the changes are backend-only; no frontend deployment is required.
