# PostHog Revenue Analytics — Setup Report

## Summary

Added `posthog_person_distinct_id` metadata to all Stripe object creation calls in the backend. This connects Stripe revenue data to PostHog person profiles, enabling the Top Customers dashboard and the `persons_revenue_analytics` / `groups_revenue_analytics` tables.

**PostHog distinct_id used:** `posthogDistinctId || email`
- The frontend calls `posthog.identify(email, ...)`, making `email` the canonical distinct_id.
- Before creating a customer, the frontend also calls `posthog.get_distinct_id()` and passes the browser-generated anonymous ID as `posthogDistinctId`. The backend uses whichever is available first (`posthogDistinctId || email`).

---

## Files Modified

### `backend/routes/customers.ts`

**Change:** Added `metadata.posthog_person_distinct_id` to `stripe.customers.create()`.

```ts
const customer = await stripe.customers.create({
  email,
  name,
  metadata: { posthog_person_distinct_id: posthogDistinctId || email },
});
```

The `posthogDistinctId` is already received from the request body and falls back to `email`, which matches the value used in `posthog.identify()`.

---

### `backend/routes/checkout.ts`

**Changes:**
1. Added `import { getUser } from "../users"` to look up the user's stored `posthogDistinctId`.
2. Added a user lookup before the session create call.
3. Added `subscription_data.metadata.posthog_person_distinct_id` to `stripe.checkout.sessions.create()`.

```ts
const user = userId ? getUser(userId) : undefined;
const posthogDistinctId = user?.posthogDistinctId || customerEmail;

const session = await stripe.checkout.sessions.create({
  // ...existing params...
  ...(posthogDistinctId ? {
    subscription_data: {
      metadata: { posthog_person_distinct_id: posthogDistinctId },
    },
  } : {}),
});
```

The session already sets `client_reference_id: userId` (as required for Stripe Checkout webhook handling).

---

### `backend/routes/subscriptions.ts`

**Changes:**
1. Moved the `getUser(userId)` lookup outside the `if (userId)` block to make `user` accessible when creating the subscription.
2. Added `metadata.posthog_person_distinct_id` to `stripe.subscriptions.create()`.

```ts
const user = userId ? getUser(userId) : undefined;
// ...

const subscription = await stripe.subscriptions.create({
  // ...existing params...
  ...(user?.posthogDistinctId ? { metadata: { posthog_person_distinct_id: user.posthogDistinctId } } : {}),
});
```

---

## What Was Not Changed

- `backend/routes/webhooks.ts` — No Stripe object creation calls; only reads events.
- All frontend files — No Stripe API calls made from the frontend.
- No new packages or dependencies were added.
- No existing logic, error handling, or imports were removed.

---

## Manual Steps

1. **Verify your Stripe webhook is configured** to send `checkout.session.completed`, `customer.subscription.created`, and `invoice.paid` events to your backend `/api/webhooks` endpoint.

2. **Set `STRIPE_WEBHOOK_SECRET`** in your environment if not already set — the webhook handler logs a warning if it is missing.

3. **Connect your Stripe data source in PostHog** (if not already done) at [PostHog Data Warehouse](https://us.posthog.com/data-warehouse) to enable the revenue analytics tables.

4. **Existing Stripe customers** created before this change will not have the metadata on their customer objects. PostHog will pick up the `posthog_person_distinct_id` from the next subscription or invoice tied to each customer, so they will be connected once their next billing event fires.
