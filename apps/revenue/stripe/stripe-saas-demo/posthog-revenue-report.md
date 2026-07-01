# PostHog Revenue Analytics Setup Report

## Summary

Three backend route files were modified to attach `posthog_person_distinct_id` metadata to Stripe objects. This enables PostHog to connect Stripe revenue data to user person profiles.

The PostHog distinct_id used is the value from `posthog.get_distinct_id()` on the frontend (set via `posthog.identify(email, ...)` on sign-up), stored as `posthogDistinctId` on the user object. When not available, it falls back to `email`.

## Files Modified

### `backend/routes/customers.ts`
- Added `metadata: { posthog_person_distinct_id: posthogDistinctId || email }` to `stripe.customers.create`.
- Both `posthogDistinctId` and `email` were already in scope from the request body.

### `backend/routes/checkout.ts`
- Added import for `getUser` from `../users`.
- Added a user lookup (`getUser(userId)`) before the Stripe call to retrieve the stored `posthogDistinctId`.
- Added `subscription_data: { metadata: { posthog_person_distinct_id: posthogDistinctId } }` to `stripe.checkout.sessions.create` (mode: `subscription`). The `client_reference_id` was already set to `userId`.
- Falls back to `customerEmail` when no user is found.

### `backend/routes/subscriptions.ts`
- Moved the `getUser(userId)` lookup to execute unconditionally before the Stripe call (preserving the existing console log).
- Added `posthogDistinctId` derived from `user?.posthogDistinctId || user?.email`.
- Added `metadata: { posthog_person_distinct_id: posthogDistinctId }` to `stripe.subscriptions.create` when a distinct_id is available.

## No Files Created

No new files were created. No new packages or dependencies were added.

## Manual Steps

1. **Verify your Stripe webhook secret** is set in your environment (`STRIPE_WEBHOOK_SECRET`) so webhook signature verification is active.
2. **Existing Stripe customers** created before this change will not have `posthog_person_distinct_id` on their customer object. PostHog will automatically pick up the metadata from new subscriptions or charges tied to those customers going forward.
3. Once live traffic flows through, check the [PostHog Revenue Analytics dashboard](https://us.posthog.com/revenue_analytics) and the `persons_revenue_analytics` table in the [data warehouse](https://us.posthog.com/data-warehouse) to confirm customer linkage is working.
