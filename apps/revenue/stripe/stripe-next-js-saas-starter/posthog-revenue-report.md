# PostHog Revenue Analytics Setup

## Changes made

- Confirmed the canonical PostHog person distinct ID is the stringified database user ID (`String(user.id)`).
- Updated Stripe Checkout Session creation to reuse that exact ID as `client_reference_id`.
- Added `posthog_person_distinct_id` to the Checkout Session metadata.
- Added the same metadata to `subscription_data`, so the Stripe Subscription created by Checkout can be connected to the PostHog person.
- Preserved existing checkout behavior and added no Stripe API calls or dependencies.

## Files modified or created

- Modified `lib/payments/stripe.ts`
- Created `posthog-revenue-report.md`

## Verification

- The Next.js production build compiled successfully and passed its TypeScript phase.
- The build later stopped during page-data collection because `POSTGRES_URL` is not configured in this environment; this is unrelated to the revenue analytics change.

## Manual next steps

1. Configure `POSTGRES_URL` and run `pnpm build` again for a complete production build.
2. Ensure the Stripe data source is connected to PostHog project `483112`.
3. After deployment, complete a test subscription checkout and confirm the resulting Stripe Checkout Session and Subscription contain `posthog_person_distinct_id` metadata matching the PostHog user distinct ID.
