# PostHog Revenue Analytics Setup

## Changes made

- Added `posthog_person_distinct_id` to Stripe Checkout Session metadata.
- Added the same metadata to `subscription_data`, so subscriptions created by Checkout are linked to the correct PostHog person.
- Reused the existing canonical PostHog distinct ID: the authenticated database user ID converted to a string.
- Preserved the existing `client_reference_id` mapping and added no new Stripe API calls or dependencies.

## Files modified or created

- Modified `lib/payments/stripe.ts`
- Created `posthog-revenue-report.md`

## Manual steps

- Configure `POSTGRES_URL` in a local `.env` file, then run `pnpm build`. Compilation and TypeScript validation succeeded, but the build could not finish page-data collection because this variable is currently missing.
- Create a test subscription checkout and verify that both the Checkout Session and resulting Subscription contain `posthog_person_distinct_id` with the authenticated user's database ID.
- Existing Stripe customers are not backfilled by this change; PostHog can associate them when a newly created linked subscription carries this metadata.
