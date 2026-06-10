# PostHog Revenue Analytics Setup Report

## Summary

Added `posthog_person_distinct_id` metadata to all Stripe object creation calls so PostHog can link Stripe revenue data to person profiles. This enables the Top Customers dashboard and `persons_revenue_analytics` table in PostHog.

## Changes Made

### PostHog distinct_id

The project identifies users with `posthogDistinctId || email` — the frontend-provided PostHog ID when available, falling back to email. This matches the existing `posthog.identify()` call in `customers.ts`.

### Files Modified

#### `backend/routes/customers.ts`

Added `metadata.posthog_person_distinct_id` to `stripe.customers.create`:

```typescript
const customer = await stripe.customers.create({
  email,
  name,
  metadata: {
    posthog_person_distinct_id: posthogDistinctId || email,
  },
});
```

#### `backend/routes/subscriptions.ts`

Extended the existing user lookup (already used for logging) to capture the PostHog distinct_id, then added it to `stripe.subscriptions.create` metadata:

```typescript
let posthogDistinctId: string | undefined;
if (userId) {
  const user = getUser(userId);
  if (user) {
    posthogDistinctId = user.posthogDistinctId || user.email;
  }
}

const subscription = await stripe.subscriptions.create({
  // ...
  ...(posthogDistinctId && { metadata: { posthog_person_distinct_id: posthogDistinctId } }),
});
```

#### `backend/routes/checkout.ts`

Added `import { getUser } from "../users"`, looked up the user by `userId`, and added `subscription_data.metadata.posthog_person_distinct_id` to `stripe.checkout.sessions.create`:

```typescript
const user = userId ? getUser(userId) : undefined;
const posthogDistinctId = user?.posthogDistinctId || user?.email;

const session = await stripe.checkout.sessions.create({
  // ...
  ...(posthogDistinctId && {
    subscription_data: {
      metadata: { posthog_person_distinct_id: posthogDistinctId },
    },
  }),
});
```

## Files Created

None.

## Manual Steps

1. **Ensure `posthogDistinctId` is sent from the frontend** when calling `POST /api/customers`. The frontend should pass the value from `posthog.get_distinct_id()` so the Stripe customer gets the correct distinct_id in metadata.

2. **Connect Stripe to PostHog Data Warehouse** — in PostHog, go to [Data Warehouse](https://us.posthog.com/project/2/data-warehouse) and add your Stripe account as a source if you haven't already. PostHog will use `posthog_person_distinct_id` from the Stripe metadata to link revenue to persons.

3. **Existing Stripe customers** — customers created before this change won't have the metadata on their Customer objects. PostHog resolves the distinct_id from the most recently created child object (subscription, invoice, or charge), so new subscriptions for existing customers will be linked correctly going forward.

4. **Webhook verification** — ensure `STRIPE_WEBHOOK_SECRET` is set in production to enable Stripe webhook signature verification.
