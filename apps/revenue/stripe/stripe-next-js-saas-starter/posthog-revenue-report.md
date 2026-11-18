# PostHog Revenue Analytics Setup

## Changes made

- Confirmed that PostHog identifies authenticated people with the database user ID as a string (`String(user.id)`).
- Added `posthog_person_distinct_id` metadata to the existing Stripe Checkout Session creation.
- Added the same metadata to `subscription_data`, so Stripe applies it to the Subscription created by Checkout.
- Kept `client_reference_id` aligned with the same PostHog distinct ID.
- Added no Stripe API calls, packages, or payment-flow changes.
- Confirmed there is no direct `stripe.customers.create` call in this project; Stripe Checkout creates the customer within the existing flow.

See [PostHog's customer connection guide](https://posthog.com/docs/revenue-analytics/connect-to-customers) for the metadata behavior.

## Files modified or created

- Modified `lib/payments/stripe.ts`
- Created `posthog-revenue-report.md`

## Verification

- Reviewed all relevant Stripe creation calls; the subscription Checkout Session is the only applicable runtime creation path.
- `pnpm build` compiled the application and completed TypeScript checking successfully.
- The build later stopped during page-data collection because `POSTGRES_URL` is not configured in this environment. The build-generated `tsconfig.json` adjustment was reverted, so no unrelated config change remains.

## Manual next steps

1. Ensure the Stripe source is connected and enabled in PostHog Revenue Analytics, preferably with webhook syncing.
2. Run a test subscription Checkout and verify that both the Checkout Session and generated Subscription contain `posthog_person_distinct_id` with the authenticated user's database ID.
3. Configure `POSTGRES_URL` locally and rerun `pnpm build` for a complete production-build verification.
4. After Stripe data syncs, confirm person-level revenue and Top Customers populate in PostHog. Existing customers will be resolved when a newly created linked child object, such as a subscription, carries this metadata.
