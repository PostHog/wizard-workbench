# PostHog Revenue Analytics Setup Report

## Summary

Three backend files were modified to add `posthog_person_distinct_id` metadata to Stripe objects. This enables PostHog to connect Stripe revenue data to person profiles, powering the Top Customers dashboard and the `persons_revenue_analytics` / `groups_revenue_analytics` data warehouse tables.

The PostHog distinct_id used is `posthogDistinctId` (the value from `posthog.get_distinct_id()` captured on the frontend and stored on the user record), falling back to the user's email when unavailable — consistent with the `posthog.identify(email, ...)` call in the frontend.

## Files Modified

### `backend/routes/customers.ts`

Added `metadata.posthog_person_distinct_id` to the `stripe.customers.create` call. The distinct_id is `posthogDistinctId || email`, matching the value already used for `posthog.identify` and `posthog.capture` in the same handler.

### `backend/routes/subscriptions.ts`

- Moved the existing `getUser(userId)` lookup out of the `if (userId)` block so the resolved user is available for the Stripe call.
- Added `metadata.posthog_person_distinct_id` to `stripe.subscriptions.create`, using `user.posthogDistinctId || user.email`. Falls back to `"TODO_POSTHOG_DISTINCT_ID"` if neither is available (i.e., if no `userId` was passed by the caller).

### `backend/routes/checkout.ts`

- Added `import { getUser } from "../users"`.
- Added a user lookup via `getUser(userId)` before the Stripe call.
- Added `subscription_data.metadata.posthog_person_distinct_id` to `stripe.checkout.sessions.create`, using `user.posthogDistinctId || user.email || customerEmail`. Falls back to `"TODO_POSTHOG_DISTINCT_ID"` if none are resolvable.

## Manual Steps

1. **Ensure `posthogDistinctId` is always passed when creating customers.** The frontend already does this (`posthog.get_distinct_id()` → `createCustomer(..., distinctId)`), but any other callers of `POST /api/customers` should also include the `posthogDistinctId` field.

2. **Ensure `userId` is passed when creating subscriptions.** The frontend passes `userId` when calling `POST /api/subscriptions` via the Subscribe page, but if any other caller omits it the metadata will fall back to `"TODO_POSTHOG_DISTINCT_ID"`. Update those callers to include `userId`.

3. **Ensure `userId` is passed to the checkout session.** The Home page already passes `user.id` when calling `POST /api/checkout`. If there are other callers that omit `userId`, the fallback chain will try `customerEmail` before using the placeholder.

4. **Backfill existing Stripe customers.** Customers created before this change will not have the metadata on their Customer object. PostHog can still resolve them via the metadata on their subscriptions or invoices going forward — no action is strictly required, but new subscriptions for existing customers will now carry the metadata automatically.

5. **Verify in PostHog.** After the next subscription or checkout event, confirm that the Top Customers dashboard and `persons_revenue_analytics` table in the data warehouse begin showing linked person data.
