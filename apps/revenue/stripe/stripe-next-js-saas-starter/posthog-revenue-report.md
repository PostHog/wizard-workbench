# PostHog Revenue Analytics Setup

## Changes made

- Confirmed that the project identifies PostHog users with `String(user.id)`.
- Updated the existing Stripe Checkout Session creation to use that same value as:
  - `client_reference_id`
  - Checkout Session metadata: `posthog_person_distinct_id`
  - Subscription metadata: `posthog_person_distinct_id`
- Preserved the existing checkout flow and added no new Stripe API calls or dependencies.
- Confirmed there are no direct Stripe Customer, Charge, PaymentIntent, Invoice, Refund, or Transfer creation calls requiring additional metadata. Stripe customers and subscriptions are created through Checkout.
- Created the pinned **Stripe Revenue Analytics** dashboard in PostHog project `483112`:
  - [Open dashboard](https://us.posthog.com/project/483112/dashboard/2154382)
  - **Total attributed revenue** insight
  - **Top customers by attributed revenue** insight

## Files modified or created

- Modified `lib/payments/stripe.ts`
- Created `posthog-revenue-report.md`

## Verification

- The production build compiled successfully and passed its TypeScript phase.
- Full page-data collection could not finish because `POSTGRES_URL` is not configured in the current environment.
- The PostHog revenue table and insight queries were validated. It currently contains no attributed customer rows and total attributed revenue is `0`; new synced Stripe objects carrying the metadata will populate it.

## Manual next steps

1. Configure `POSTGRES_URL` in the build environment and rerun `pnpm build`.
2. Confirm the Stripe data source is connected and syncing in PostHog Revenue Analytics.
3. Deploy the code change and complete a test subscription checkout.
4. After Stripe sync completes, verify that the test customer appears on the [Stripe Revenue Analytics dashboard](https://us.posthog.com/project/483112/dashboard/2154382).
5. Existing customers will be linked when a newly created supported Stripe child object carries `posthog_person_distinct_id`; no backfill API calls were added.
