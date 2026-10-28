# PostHog Revenue Analytics Setup

## Changes made

- Configured the existing PostHog SDK through `.env.local` using the supplied project token and host.
- Confirmed that the project’s canonical PostHog distinct ID is `String(user.id)`.
- Updated the existing Stripe Checkout Session creation flow to attach `posthog_person_distinct_id` to both Checkout Session metadata and the created Subscription metadata.
- Reused the same distinct ID for `client_reference_id` so checkout completion can continue resolving the authenticated user.
- Added no Stripe API calls, packages, or payment-logic changes.

## Files modified or created

- Modified `lib/payments/stripe.ts`
- Created `.env.local`
- Created `posthog-revenue-report.md`

## Verification

- The edited application compiled successfully and passed the TypeScript phase of `pnpm build`.
- The full build could not finish page-data collection because `POSTGRES_URL` is not configured in the local environment. This is unrelated to the revenue metadata change.

## Manual next steps

1. Set `POSTGRES_URL` in the local/deployment environment, then run `pnpm build` again.
2. Complete a test subscription checkout and confirm the resulting Stripe Checkout Session and Subscription contain `posthog_person_distinct_id`.
3. After Stripe data syncs into PostHog, verify that the customer appears in Top Customers and the `persons_revenue_analytics` table.
