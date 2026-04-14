# PostHog Revenue Analytics Setup Report

## Summary

Three backend route files were modified to attach `posthog_person_distinct_id` metadata to Stripe objects. This enables PostHog to connect Stripe revenue data to person profiles, unlocking the Top Customers dashboard and the `persons_revenue_analytics` / `groups_revenue_analytics` data warehouse tables.

The distinct_id used throughout this project is `posthogDistinctId` (from the `User` model), falling back to `email` when not set.

## Changes Made

### `routes/customers.ts`
- Added `posthog_person_distinct_id` to the `metadata` of `stripe.customers.create()`.
- Value: `posthogDistinctId || email` — matches the value used in `posthog.identify()` in the same file.

### `routes/checkout.ts`
- Destructured `posthogDistinctId` from the request body (new optional field).
- Added `subscription_data.metadata.posthog_person_distinct_id` to `stripe.checkout.sessions.create()`.
- Value: `posthogDistinctId || customerEmail || userId` (priority order).
- The `client_reference_id` was already set to `userId`, which the webhook handler uses to look up the user's `posthogDistinctId`.

### `routes/subscriptions.ts`
- Moved the `getUser(userId)` lookup outside the `if (userId)` block so the result is accessible before the Stripe call.
- Conditionally added `metadata.posthog_person_distinct_id` to `stripe.subscriptions.create()` when the user's `posthogDistinctId` is available.

## Files Modified

| File | Change |
|------|--------|
| `routes/customers.ts` | Added metadata to `stripe.customers.create()` |
| `routes/checkout.ts` | Threaded `posthogDistinctId` from request body; added `subscription_data.metadata` to checkout session |
| `routes/subscriptions.ts` | Added conditional metadata to `stripe.subscriptions.create()` |

## Manual Steps

1. **Update your frontend** to pass `posthogDistinctId` in the request body when calling `POST /api/checkout`. This is the PostHog distinct ID obtained from `posthog.get_distinct_id()` on the client side. Without it, the checkout flow falls back to `customerEmail` or `userId`.

2. **Connect Stripe as a data source in PostHog** if you haven't already. Go to [Data Warehouse → Sources](https://us.posthog.com/data-warehouse) and add your Stripe account.

3. **Verify the metadata** by creating a test customer or subscription and checking in the Stripe dashboard that the `posthog_person_distinct_id` key appears in the object's metadata.

4. **Check the Top Customers dashboard** in PostHog under Revenue Analytics after data begins flowing. It may take up to 24 hours for the warehouse tables to populate.
