# PostHog Revenue Analytics Setup

## Changes made

- Confirmed the project uses `String(user.id)` as its canonical PostHog `distinct_id`.
- Updated the existing Stripe subscription Checkout flow to attach `posthog_person_distinct_id` to both the Checkout Session and generated Subscription metadata.
- Reused the same distinct ID for `client_reference_id` so checkout completion remains linked to the correct PostHog person.
- Added the supplied PostHog project token and ingestion host to the local environment configuration.
- Added no Stripe API calls and did not change payment behavior.

## Files modified or created

- Modified `lib/payments/stripe.ts`
- Created/updated `.env.local`
- Created `posthog-revenue-report.md`

## Verification

- The Next.js production build compiled successfully and passed its TypeScript phase.
- The build later stopped during page-data collection because `POSTGRES_URL` is not configured; this is unrelated to the revenue analytics change.

## Manual next steps

1. Connect Stripe as a PostHog data source and enable Stripe in Revenue Analytics settings if it is not already enabled. Webhook sync is recommended for current data.
2. Configure `POSTGRES_URL`, then rerun `pnpm build` to complete full production-build verification.
3. Complete a new test subscription checkout and confirm the Checkout Session and Subscription contain `posthog_person_distinct_id` metadata in Stripe.
