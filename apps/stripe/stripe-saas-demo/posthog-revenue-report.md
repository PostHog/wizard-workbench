# PostHog Revenue Analytics — Setup Report

## Summary

`posthog_person_distinct_id` metadata has been added to all Stripe object creation calls in this project. This connects Stripe revenue data to PostHog persons, enabling the Top Customers dashboard and revenue analytics tables.

## PostHog distinct_id

The project uses **`email`** as the PostHog distinct_id (from `posthog.identify(email, { email, name })` in `frontend/src/pages/Home.tsx`). The backend receives it from the frontend as `posthogDistinctId` (the result of `posthog.get_distinct_id()` at checkout time) and stores it on the user object.

## Files Modified

### `backend/routes/customers.ts`
Added `posthog_person_distinct_id` to the `metadata` parameter of `stripe.customers.create`. The value is `posthogDistinctId || email`, both of which are already in scope from the request body.

### `backend/routes/checkout.ts`
- Imported `getUser` from `../users`
- Added a lookup of `posthogDistinctId` via `getUser(userId)?.posthogDistinctId` (no new Stripe API call — local in-memory store only)
- Added `posthog_person_distinct_id` to the `metadata` parameter of `stripe.checkout.sessions.create`, with fallback chain: `posthogDistinctId || customerEmail || userId`

### `backend/routes/subscriptions.ts`
- Extended the existing user lookup (already present for logging) to capture `posthogDistinctId = user.posthogDistinctId`
- Added `posthog_person_distinct_id` to the `metadata` parameter of `stripe.subscriptions.create` when `posthogDistinctId` is available

## Stripe Objects Updated

| Object | File | distinct_id source |
|---|---|---|
| `Customer` | `customers.ts` | `posthogDistinctId \|\| email` |
| `checkout.Session` | `checkout.ts` | `posthogDistinctId \|\| customerEmail \|\| userId` |
| `Subscription` | `subscriptions.ts` | `user.posthogDistinctId` (when userId provided) |

## Manual Steps

1. **Enable Revenue Analytics in PostHog**: In your PostHog project, navigate to **Data Management > Revenue analytics** and ensure Stripe is connected and the `posthog_person_distinct_id` metadata key is configured.

2. **Deploy the backend changes**: The three modified backend route files need to be deployed so new Stripe objects are created with the metadata.

3. **Webhook secret**: Ensure `STRIPE_WEBHOOK_SECRET` is set in your backend environment so the `checkout.session.completed` webhook handler runs with signature verification.

4. **Historical data**: Existing Stripe customers/subscriptions created before this change will not have the metadata. Only newly created objects will be linked to PostHog persons.
