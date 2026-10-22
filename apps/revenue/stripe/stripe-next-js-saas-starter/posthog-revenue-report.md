# PostHog Revenue Analytics Setup

## Changes made

- Configured the provided PostHog project token and ingestion host in the local environment.
- Confirmed that the canonical PostHog distinct ID is the authenticated database user ID converted to a string.
- Added `posthog_person_distinct_id` to the existing Stripe Checkout Session metadata.
- Added the same metadata to `subscription_data`, linking the Stripe subscription and resulting revenue to the correct PostHog person.
- Reused that distinct ID for `client_reference_id` so the checkout return flow remains consistent.
- Added no Stripe API calls and preserved the existing checkout and payment behavior.

## Files modified or created

- Modified `lib/payments/stripe.ts`
- Created `.env.local`
- Created `posthog-revenue-report.md`

## Verification

- The production build compiled successfully and passed its TypeScript phase.
- Final page-data collection could not finish because `POSTGRES_URL` is not configured in this environment; this is unrelated to the revenue metadata change.

## Manual next steps

1. Configure a valid `POSTGRES_URL` in the local/deployment environment, then rerun `pnpm build`.
2. Deploy the change and complete a test subscription checkout.
3. Confirm the resulting Stripe Checkout Session and Subscription contain `posthog_person_distinct_id` matching the user ID used by PostHog.
4. Confirm the Stripe data source is connected and syncing in PostHog before using person-level revenue analytics and Top Customers.
