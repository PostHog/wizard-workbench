# PostHog Revenue Analytics — Setup Report

## Summary

Three backend files were modified to attach `posthog_person_distinct_id` metadata to Stripe objects. This enables PostHog to connect Stripe revenue data to person profiles, powering the Top Customers dashboard and the `persons_revenue_analytics` / `groups_revenue_analytics` data warehouse tables.

## PostHog distinct_id used

The project identifies users with `posthogDistinctId || email` (backend) and `email` (frontend). Both values originate from the same sign-up flow in `frontend/src/pages/Home.tsx` where `posthog.identify(email, { email, name })` is called.

## Files modified

### `backend/routes/customers.ts`
Added `posthog_person_distinct_id` to the `metadata` of the `stripe.customers.create` call. Both `posthogDistinctId` and `email` were already in scope from `req.body`.

```ts
const customer = await stripe.customers.create({
  email,
  name,
  metadata: { posthog_person_distinct_id: posthogDistinctId || email },
});
```

### `backend/routes/checkout.ts`
- Added `import { getUser } from "../users"` to resolve the user's `posthogDistinctId` from the internal user store.
- Added `subscription_data.metadata` to the `stripe.checkout.sessions.create` call with `posthog_person_distinct_id`. Falls back to `customerEmail` if no stored `posthogDistinctId` is found.

```ts
const posthogDistinctId = userId ? getUser(userId)?.posthogDistinctId : undefined;

const session = await stripe.checkout.sessions.create({
  // ...existing params...
  subscription_data: {
    metadata: { posthog_person_distinct_id: posthogDistinctId || customerEmail },
  },
});
```

### `backend/routes/subscriptions.ts`
Added a lookup of the user's `posthogDistinctId` via the existing `getUser` import, then conditionally added `metadata` to the `stripe.subscriptions.create` call. Metadata is omitted if no `posthogDistinctId` is available (no fallback to an unrelated identifier).

```ts
const posthogDistinctId = userId ? getUser(userId)?.posthogDistinctId : undefined;

const subscription = await stripe.subscriptions.create({
  // ...existing params...
  ...(posthogDistinctId ? { metadata: { posthog_person_distinct_id: posthogDistinctId } } : {}),
});
```

## Files created

None.

## Manual steps to take next

1. **Connect your Stripe account in PostHog** — Go to [PostHog Data Pipelines](https://us.posthog.com/pipeline) and add the Stripe source if you haven't already. This syncs your Stripe data warehouse tables.

2. **Verify the metadata appears in Stripe** — After a test sign-up and subscription, inspect the Stripe customer/subscription objects in the Stripe dashboard to confirm `posthog_person_distinct_id` is present in their metadata.

3. **Check the Top Customers dashboard** — Once data flows through, visit [Revenue Analytics](https://us.posthog.com/revenue_analytics) in PostHog to see persons linked to their revenue.

4. **Existing customers** — Customers created before this change will not have the metadata on their customer object. They will be linked via the `posthog_person_distinct_id` on their next subscription or invoice once the updated code runs.
