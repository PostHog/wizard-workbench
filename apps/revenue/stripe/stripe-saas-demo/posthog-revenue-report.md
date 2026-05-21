# PostHog Revenue Analytics Setup Report

## Summary

Added `posthog_person_distinct_id` metadata to Stripe objects so PostHog can correlate revenue data with identified users. This enables the Top Customers dashboard and `persons_revenue_analytics` / `groups_revenue_analytics` tables in PostHog.

## PostHog distinct_id

The project uses `email` as the PostHog distinct_id (via `posthog.identify(email, ...)` in the frontend). On the backend, the value is `posthogDistinctId || email`, where `posthogDistinctId` is the result of `posthog.get_distinct_id()` captured on the client and passed through the API.

## Files Modified

### `backend/routes/customers.ts`

- Moved `const distinctId = posthogDistinctId || email` to before the `stripe.customers.create` call
- Added `metadata: { posthog_person_distinct_id: distinctId }` to `stripe.customers.create`

### `backend/routes/checkout.ts`

- Added import for `getUser` from `../users`
- Computed `posthogPersonDistinctId = getUser(userId)?.posthogDistinctId || customerEmail` before the session create call
- Added `metadata: { posthog_person_distinct_id: posthogPersonDistinctId }` to `stripe.checkout.sessions.create`

### `backend/routes/subscriptions.ts`

- Extended the existing `getUser(userId)` lookup to also capture `user.posthogDistinctId`
- Added `metadata: { posthog_person_distinct_id: posthogPersonDistinctId }` to `stripe.subscriptions.create` (only set when `posthogPersonDistinctId` is available)

## Files Created

- `posthog-revenue-report.md` (this file)

## Manual Steps

1. **Verify Stripe webhook secret**: Ensure `STRIPE_WEBHOOK_SECRET` is set in your backend environment so webhook signature verification is active in production.

2. **Enable Revenue Analytics in PostHog**: In your PostHog project settings, go to **Data pipelines** > **Revenue analytics** and confirm Stripe is connected or follow the in-app setup flow.

3. **Test the integration**: Create a test customer and complete a checkout or subscription flow, then confirm the Stripe Customer and Subscription objects have `posthog_person_distinct_id` in their metadata by checking the Stripe dashboard.

4. **Check the Top Customers dashboard**: After data flows through, navigate to **Revenue analytics** in PostHog to verify customers are being matched to person profiles.
