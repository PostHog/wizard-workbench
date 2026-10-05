# PostHog Revenue Analytics Setup

## Changes made

- Confirmed that the canonical PostHog distinct ID is the authenticated database user ID serialized with `String(user.id)` / `user.id.toString()`.
- Added `posthog_person_distinct_id` to Stripe Checkout Session metadata.
- Added the same metadata to `subscription_data`, ensuring the Subscription created by Checkout is linked to the matching PostHog person.
- Preserved the existing `client_reference_id`, which already uses the same canonical user ID.
- Added no Stripe API calls, dependencies, analytics events, or payment-flow changes.

## Files modified or created

- Modified `lib/payments/stripe.ts`
- Created `posthog-revenue-report.md`

## Verification

- Restored the existing locked dependencies with `pnpm install` so project verification could run.
- `pnpm build` compiled the application successfully and completed TypeScript checking.
- The build later stopped while collecting page data because `POSTGRES_URL` is not configured in the current environment. This is unrelated to the Stripe metadata change.

## Manual next steps

1. Configure `POSTGRES_URL` in the build environment and rerun `pnpm build` to complete production-build verification.
2. If Stripe is not already connected as a PostHog data warehouse source, connect it in PostHog so revenue tables and customer revenue reporting can ingest the tagged Stripe objects.
3. Complete a test subscription checkout and confirm the resulting Checkout Session and Subscription contain `posthog_person_distinct_id` with the authenticated user's database ID.
