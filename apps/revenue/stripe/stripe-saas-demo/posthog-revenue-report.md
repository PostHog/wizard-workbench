# PostHog Revenue Analytics Setup Report

## Summary

PostHog revenue analytics has been connected to Stripe by adding `posthog_person_distinct_id` metadata to all Stripe object creation calls. This enables the Top Customers dashboard and the `persons_revenue_analytics` / `groups_revenue_analytics` tables in PostHog.

## PostHog distinct_id

The project's PostHog distinct_id is `posthogDistinctId || email` — sourced from the request body in the customer creation flow, and stored on the `User` model as `posthogDistinctId`. For checkout and subscription flows where only the internal `userId` is available, the distinct_id is resolved via `user?.posthogDistinctId ?? userId`, matching the pattern already used in the webhook handler.

## Files Modified

### `backend/routes/customers.ts`

Added `metadata: { posthog_person_distinct_id: posthogDistinctId || email }` to the `stripe.customers.create()` call. The value matches what `posthog.identify()` already uses in this file.

### `backend/routes/checkout.ts`

- Added import: `import { getUser } from "../users";`
- Resolves `posthogDistinctId` from the user record (via `userId`) before creating the checkout session.
- Added `subscription_data: { metadata: { posthog_person_distinct_id: posthogDistinctId } }` to `stripe.checkout.sessions.create()`. Only applied when `posthogDistinctId` is available.

### `backend/routes/subscriptions.ts`

- Refactored the existing `getUser(userId)` call to be unconditional so the result can be used outside the `if` block.
- Added `metadata: { posthog_person_distinct_id: posthogDistinctId }` to `stripe.subscriptions.create()`. Only applied when `posthogDistinctId` is available.

## Files Created

None.

## Manual Steps

No manual steps are required for the code changes. However, to fully enable revenue analytics in PostHog:

1. **Connect Stripe as a data warehouse source** in PostHog under Data Warehouse → Sources → Stripe. This is required for the `persons_revenue_analytics` table to populate.
2. **Ensure `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET`** are set in your environment so the backend can communicate with Stripe and verify webhook payloads.
3. **Test the flow** by creating a new customer and completing a checkout — then verify the Stripe customer object has `posthog_person_distinct_id` in its metadata via the Stripe Dashboard.
4. **Existing customers** created before this change will be linked to PostHog automatically as soon as a new subscription or invoice is created for them (PostHog resolves the distinct_id from the most recently created child object).
