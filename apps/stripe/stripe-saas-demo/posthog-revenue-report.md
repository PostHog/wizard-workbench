# PostHog Revenue Analytics Setup Report

## Summary

Stripe revenue data has been connected to PostHog by adding `posthog_person_distinct_id` metadata to Stripe objects. This enables the Top Customers dashboard, `persons_revenue_analytics` table, and `groups_revenue_analytics` table in PostHog.

## PostHog Distinct ID

The project identifies users with the PostHog distinct ID set via `posthog.identify(email, ...)` on the frontend, and `posthogDistinctId || email` on the backend. The `posthogDistinctId` is captured from `posthog.get_distinct_id()` in the browser and forwarded to the backend on each customer creation request.

## Files Modified

### `backend/routes/customers.ts`
- Added `metadata: { posthog_person_distinct_id: posthogDistinctId || email }` to `stripe.customers.create`.
- The `posthogDistinctId` value was already available in `req.body` and used elsewhere in the same handler.

### `backend/routes/checkout.ts`
- Added import for `getUser` from `../users`.
- Before creating the checkout session, the user is looked up by `userId` to retrieve their stored `posthogDistinctId` (with `customerEmail` as fallback).
- Added `metadata: { posthog_person_distinct_id: ... }` to the checkout session itself.
- Added `subscription_data: { metadata: { posthog_person_distinct_id: ... } }` so the created subscription also carries the metadata.
- `client_reference_id` was left unchanged (`userId`) because the existing webhook handler relies on it to look up the user record.

### `backend/routes/subscriptions.ts`
- Extracted `posthogDistinctId` from the user record (already fetched via the existing `getUser(userId)` call).
- Added `metadata: { posthog_person_distinct_id: posthogDistinctId || "TODO_POSTHOG_DISTINCT_ID" }` to `stripe.subscriptions.create`.

## No Files Created

No new files were created. All changes are minimal additions to existing Stripe API calls.

## Manual Steps

1. **Verify the PostHog Data Warehouse Stripe source is connected** — In PostHog → Data Warehouse, confirm you have a Stripe source syncing customer and subscription data. The `posthog_person_distinct_id` metadata will appear on new Stripe objects going forward; historical objects will not have it.

2. **Enable the Revenue Analytics feature** — In PostHog, navigate to the Revenue Analytics section (or the Top Customers dashboard) and confirm data is flowing after your next real transaction.

3. **Test with a new sign-up** — Create a new customer and complete a subscription to confirm `posthog_person_distinct_id` appears in the Stripe Customer and Subscription metadata in your Stripe dashboard.

4. **`TODO_POSTHOG_DISTINCT_ID` fallback** — If a checkout or subscription request arrives without a valid `userId` or `customerEmail`, the metadata value falls back to the string `"TODO_POSTHOG_DISTINCT_ID"`. This is a safety placeholder and should not occur in normal usage, but monitor Stripe for any such values and investigate the calling code if they appear.
