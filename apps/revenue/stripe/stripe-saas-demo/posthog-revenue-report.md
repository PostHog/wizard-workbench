# PostHog Revenue Analytics Setup Report

## Summary

Added `posthog_person_distinct_id` metadata to Stripe object creation calls so PostHog can automatically connect Stripe revenue data to person profiles. This enables the Top Customers dashboard and the `persons_revenue_analytics` / `groups_revenue_analytics` data warehouse tables.

## PostHog Distinct ID

The project uses `posthogDistinctId` (passed from the frontend via the PostHog JS SDK) as the distinct ID, falling back to `email` when not set. This is consistent with the existing `posthog.identify` call in `customers.ts`.

## Files Modified

### `backend/routes/customers.ts`

Added `metadata: { posthog_person_distinct_id: posthogDistinctId || email }` to the `stripe.customers.create` call. The value was already in scope from `req.body`.

### `backend/routes/subscriptions.ts`

- Moved the `getUser(userId)` lookup outside the `if (userId)` block so the result is accessible when building the Stripe call.
- Added `metadata: { posthog_person_distinct_id: user.posthogDistinctId }` to `stripe.subscriptions.create` (conditionally, only when `posthogDistinctId` is set on the user).

### `backend/routes/checkout.ts`

- Added `import { getUser } from "../users"`.
- Looked up the user from `userId` to retrieve `posthogDistinctId`.
- Added `subscription_data: { metadata: { posthog_person_distinct_id: posthogDistinctId } }` to `stripe.checkout.sessions.create` (conditionally, falling back to `customerEmail` if no `posthogDistinctId` on the user).

## No Files Created

No new files were added — only existing Stripe call sites were modified.

## Manual Steps

1. **Connect Stripe as a data source in PostHog**: Go to [Data Warehouse](https://us.posthog.com/project/483112/data-warehouse) → Add source → Stripe, and enter your Stripe API key. This is required for the `persons_revenue_analytics` table to populate.

2. **Verify metadata on new Stripe objects**: After deploying, create a test customer and check the Stripe dashboard to confirm the `posthog_person_distinct_id` metadata key appears on the Customer, Subscription, and/or Checkout Session objects.

3. **Existing customers**: Customers created before this change will not have the metadata on their Customer object. PostHog will pick up the distinct ID from the next Subscription or Checkout Session they create — no backfill needed.

4. **Check the Top Customers dashboard**: Once Stripe is connected and events flow in, visit [Revenue Analytics](https://us.posthog.com/project/483112/revenue_analytics#top-customers) to see customer revenue linked to PostHog persons.
