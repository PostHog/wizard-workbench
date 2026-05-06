# PostHog Revenue Analytics Setup Report

## Summary

This project was updated to connect Stripe revenue data to PostHog by adding `posthog_person_distinct_id` metadata to Stripe objects. This enables the Top Customers dashboard, `persons_revenue_analytics` table, and `groups_revenue_analytics` table in PostHog.

### PostHog distinct_id

The project identifies users by **email** as the PostHog distinct_id (frontend: `posthog.identify(email, { email, name })`). On the backend, the pattern `posthogDistinctId || email` is used, falling back to email when no explicit distinct_id is provided.

---

## Files Modified

### `backend/routes/customers.ts`

Added `posthog_person_distinct_id` to the `metadata` of `stripe.customers.create`:

```typescript
const customer = await stripe.customers.create({
  email,
  name,
  metadata: { posthog_person_distinct_id: posthogDistinctId || email },
});
```

The value `posthogDistinctId || email` mirrors the existing PostHog identify call in this file, ensuring consistency.

### `backend/routes/subscriptions.ts`

- Hoisted the `getUser(userId)` lookup out of the logging block so the user's distinct_id is accessible at the subscription create call.
- Added `posthog_person_distinct_id` to the `metadata` of `stripe.subscriptions.create`:

```typescript
const user = userId ? getUser(userId) : undefined;
// ...
const subscription = await stripe.subscriptions.create({
  // ...existing fields...
  metadata: { posthog_person_distinct_id: user?.posthogDistinctId || user?.email },
});
```

### `backend/routes/checkout.ts`

- Changed `client_reference_id` from `userId` to `customerEmail` (the PostHog distinct_id) so it can be retrieved in the `checkout.session.completed` webhook.
- Added `posthog_person_distinct_id` to the `metadata` of `stripe.checkout.sessions.create`:

```typescript
const session = await stripe.checkout.sessions.create({
  // ...existing fields...
  client_reference_id: customerEmail,
  customer_email: customerEmail,
  metadata: { posthog_person_distinct_id: customerEmail },
});
```

---

## What Was Not Changed

- No new Stripe API calls were added.
- No new packages or dependencies were introduced.
- All existing business logic, imports, and error handling are preserved.

---

## Manual Steps Required

1. **Connect Stripe to PostHog Data Warehouse**: In PostHog, go to **Data Warehouse > Sources** and add Stripe as a source using your Stripe secret key. This populates the `persons_revenue_analytics` and `groups_revenue_analytics` tables.

2. **Enable the Top Customers Dashboard**: Once the Stripe data warehouse source is active, the Top Customers dashboard in PostHog will automatically populate using the `posthog_person_distinct_id` metadata set on your Stripe customers and subscriptions.

3. **Deploy the backend changes**: Restart or redeploy the backend service so the updated Stripe metadata starts being written to new customers, subscriptions, and checkout sessions.

4. **Backfill existing customers (optional)**: Existing Stripe customers created before this change will not have the `posthog_person_distinct_id` metadata. You may want to backfill these using the Stripe API or by updating customers as they interact with your app.
