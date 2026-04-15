# PostHog Revenue Analytics — Setup Report

## Summary

Connected Stripe revenue data to PostHog by adding `posthog_person_distinct_id` metadata to Stripe objects created during checkout. This enables the Top Customers dashboard, `persons_revenue_analytics` table, and `groups_revenue_analytics` table in PostHog.

## PostHog distinct_id

The project uses `user.id.toString()` (the numeric database user ID as a string) as the PostHog distinct_id. This was confirmed in:

- `app/(dashboard)/layout.tsx`: `posthog.identify(String(userData.id), { email, name })`
- `app/api/stripe/checkout/route.ts`: `distinctId: String(user[0].id)`

## Changes Made

### Modified Files

**`lib/payments/stripe.ts`**

Added `posthog_person_distinct_id` to two places within the `createCheckoutSession` function's `stripe.checkout.sessions.create` call:

1. **Session-level `metadata`** — attaches the distinct_id to the Checkout Session object itself.
2. **`subscription_data.metadata`** — propagates the distinct_id to the Subscription object that Stripe auto-creates when the checkout completes.

No new Stripe API calls were added. `client_reference_id` was already set to `user.id.toString()` and was left unchanged.

## Manual Steps

No additional manual steps are required. Once users complete checkout, their Stripe Subscription objects will carry `posthog_person_distinct_id`, which PostHog uses to link revenue events to person profiles.

To verify the integration is working:
1. Complete a test checkout in your Stripe test environment.
2. In the Stripe dashboard, open the resulting Subscription and confirm `posthog_person_distinct_id` appears in its metadata.
3. In PostHog, check the **Revenue Analytics** section to see the customer data flowing in.
