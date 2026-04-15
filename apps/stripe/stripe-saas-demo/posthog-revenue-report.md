# PostHog Revenue Analytics — Setup Report

## Summary

Connected Stripe revenue data to PostHog by adding `posthog_person_distinct_id` metadata to Stripe objects. This enables the Top Customers dashboard, `persons_revenue_analytics` table, and `groups_revenue_analytics` table in PostHog.

## PostHog distinct_id

The project identifies users with their **email address** via `posthog.identify(email, { email, name })` in the frontend. The backend also accepts the frontend's anonymous `posthog.get_distinct_id()` value (passed as `posthogDistinctId`) and falls back to email: `posthogDistinctId || email`.

## Files Modified

### `backend/routes/customers.ts`

Added `posthog_person_distinct_id` to the `metadata` of `stripe.customers.create()`.

- Value used: `posthogDistinctId || email` (matches the existing PostHog identify pattern)
- Both values are already in scope from the request body

### `backend/routes/checkout.ts`

- Added `import { getUser } from "../users"` to look up the user's stored `posthogDistinctId`
- Added `posthogDistinctId` resolution: looks up user by `userId`, falls back to `customerEmail`
- Added `subscription_data.metadata` with `posthog_person_distinct_id` to `stripe.checkout.sessions.create()` (subscription-mode checkout)

### `backend/routes/subscriptions.ts`

- Extended the existing user lookup (already present) to capture `posthogDistinctId` from `user.posthogDistinctId`
- Added conditional `metadata: { posthog_person_distinct_id: posthogDistinctId }` to `stripe.subscriptions.create()`

## No Files Created

No new files were created.

## Manual Steps

No manual steps are required for the code changes to take effect once deployed. However, to fully use PostHog revenue analytics:

1. **Connect your Stripe account in PostHog**: Go to PostHog > Data pipelines > Sources and add your Stripe account as a data source.
2. **Wait for data sync**: PostHog will begin syncing Stripe data. New customers/subscriptions created after this deployment will automatically have `posthog_person_distinct_id` set, enabling person-level revenue attribution.
3. **Historical data**: Existing Stripe customers created before this change will not have the metadata on the customer object. PostHog will resolve the distinct ID from the most recently created child object (subscription, invoice, or charge) once those objects are created with metadata going forward.
4. **Top Customers dashboard**: Once data is synced, visit the PostHog Revenue Analytics section to see the Top Customers dashboard and query `persons_revenue_analytics` in the data warehouse.
