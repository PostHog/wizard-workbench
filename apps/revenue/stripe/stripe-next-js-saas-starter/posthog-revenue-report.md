# PostHog Revenue Analytics Setup

## Changes made

- Confirmed the canonical PostHog person `distinct_id` is the authenticated user ID serialized with `String(user.id)` / `user.id.toString()`.
- Added `posthog_person_distinct_id` to the existing Stripe Checkout Session metadata.
- Added the same metadata to `subscription_data`, ensuring the subscription created by Checkout is linked to the correct PostHog person.
- Kept `client_reference_id` aligned with the same user ID.
- Added the supplied PostHog project token and host to the local environment configuration.
- Added no Stripe API calls, dependencies, or unrelated payment-flow changes.

## Files modified or created

- `lib/payments/stripe.ts` — added PostHog person metadata to the existing Checkout Session and subscription creation parameters.
- `.env.local` — added `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`.
- `posthog-revenue-report.md` — this report.

## Verification

- Re-read the modified Stripe integration and confirmed both metadata values use the same authenticated user ID already used by PostHog identification.
- Confirmed no new Stripe customer update call was introduced.
- Restored project dependencies with `pnpm install`.
- `pnpm build` compiled successfully and passed TypeScript checking, then stopped during page-data collection because `POSTGRES_URL` is not configured.

## Manual steps

1. Set `POSTGRES_URL` in a local environment file, then run `pnpm build` again to complete the production-build verification.
2. Complete a new test subscription checkout and confirm the Checkout Session and Subscription in Stripe contain `posthog_person_distinct_id` with the application user ID.
3. Ensure the Stripe source is connected and syncing in the same PostHog project so the tagged objects populate revenue analytics, Top Customers, and the revenue analytics tables.
