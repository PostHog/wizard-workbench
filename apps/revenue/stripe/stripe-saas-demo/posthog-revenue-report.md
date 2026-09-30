# PostHog Revenue Analytics Setup

## Changes made

- Added `posthog_person_distinct_id` metadata when creating Stripe customers.
- Added the same metadata to direct Stripe subscription creation.
- Added the metadata to Stripe Checkout sessions and their generated subscriptions.
- Set Checkout `client_reference_id` to the exact PostHog distinct ID stored for the user.
- Kept metadata conditional when no real PostHog distinct ID is available; no fallback or fabricated identifier is written to Stripe.
- Added no new Stripe API calls or dependencies.

## Files modified or created

- Modified `backend/routes/customers.ts`
- Modified `backend/routes/checkout.ts`
- Modified `backend/routes/subscriptions.ts`
- Created `posthog-revenue-report.md`

## Manual next steps

1. Ensure the Stripe account is connected as a source in PostHog project `483112`.
2. Create a new test customer and complete both a Checkout subscription and a custom-form subscription.
3. In Stripe, confirm the customer, Checkout session, and subscription contain `posthog_person_distinct_id` metadata.
4. After Stripe data syncs, confirm customers appear in PostHog Revenue Analytics and the `persons_revenue_analytics` table.

No existing Stripe objects were updated because the workflow intentionally avoids extra Stripe API calls. Existing customers can be resolved by PostHog after a newly created related subscription or other supported revenue object carries the metadata.
