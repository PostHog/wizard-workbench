# PostHog Revenue Analytics Setup Report

## What was done

Connected Stripe revenue data to PostHog by adding `posthog_person_distinct_id` metadata to Stripe objects. This enables PostHog to link Stripe charges, subscriptions, and invoices to the correct person profiles.

### PostHog distinct_id used

The app calls `posthog.get_distinct_id()` on the frontend before creating a customer, and sends that value to the backend as `posthogDistinctId`. The backend stores it on the user record (`user.posthogDistinctId`) and uses `posthogDistinctId || email` as the canonical distinct_id (matching the existing PostHog identify and capture calls). This same value is now written into every relevant Stripe metadata field.

## Files modified

### `backend/routes/customers.ts`
Added `posthog_person_distinct_id` to the `stripe.customers.create` metadata. The value is `posthogDistinctId || email` — the same expression already used for PostHog identify/capture calls in this file.

### `backend/routes/checkout.ts`
- Added `import { getUser } from "../users"` to look up the user's stored `posthogDistinctId`.
- Looks up the user by `userId` (already in the request body) before creating the Checkout Session.
- Added `subscription_data.metadata.posthog_person_distinct_id` to the `stripe.checkout.sessions.create` call, using `checkoutUser?.posthogDistinctId || customerEmail` as the value.

### `backend/routes/subscriptions.ts`
Added `posthog_person_distinct_id` to the `stripe.subscriptions.create` metadata via a conditional spread (`...(phDistinctId && { metadata: ... })`), so the field is only included when a `userId` is present and the user record has a `posthogDistinctId`.

## No files created

All changes were edits to existing files. No new files, packages, or dependencies were added.

## Manual steps

No manual steps are required for the code changes. However, to complete the integration end-to-end:

1. **Configure the PostHog data source** — In your PostHog project, go to **Data Warehouse → Sources** and connect your Stripe account if you haven't already.
2. **Verify metadata in Stripe** — After your next sign-up or checkout, open the Stripe dashboard and confirm that new Customer, Subscription, and Checkout Session objects have a `posthog_person_distinct_id` metadata key with a valid value.
3. **Check Top Customers dashboard** — Once data is flowing, visit [PostHog Revenue Analytics](https://us.posthog.com/revenue_analytics#top-customers) to confirm persons are linked to their revenue.
