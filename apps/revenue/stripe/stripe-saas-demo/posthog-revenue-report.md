# PostHog Revenue Analytics Setup

## Changes made

- Added `posthog_person_distinct_id` metadata to Stripe Customer creation when the exact browser PostHog distinct ID is available.
- Added the same metadata to direct Stripe Subscription creation using the distinct ID already stored on the local user.
- Added the distinct ID to Stripe Checkout Session metadata, the generated subscription metadata, and `client_reference_id`.
- Configured the existing frontend PostHog initialization with the supplied project token and ingestion host.
- Preserved existing Stripe creation flows and added no Stripe API calls or dependencies.

## Files modified or created

- Modified `backend/routes/customers.ts`
- Modified `backend/routes/subscriptions.ts`
- Modified `backend/routes/checkout.ts`
- Created `frontend/.env` with `VITE_POSTHOG_API_KEY` and `VITE_POSTHOG_HOST`
- Created `posthog-revenue-report.md`

## Verification

- Re-read every modified route and confirmed all Customer, Subscription, and Checkout creation sites use the existing PostHog distinct ID without fabricated fallbacks.
- Confirmed no new Stripe API calls were introduced.
- Confirmed both frontend PostHog environment keys are present.
- The runner could not invoke the nested frontend build command. The backend package also has no build, typecheck, or lint script.

## Manual next steps

1. Run the frontend build from the `frontend` directory with `npm run build`.
2. Restore or add the existing backend `posthog` module expected by route imports (`backend/posthog.ts`) if it is not supplied outside this checkout; it was already missing before these changes.
3. Deploy the updated app and complete one test Checkout and one custom subscription flow.
4. After Stripe data syncs into PostHog, verify that customers resolve in Revenue Analytics and that `persons_revenue_analytics` contains linked rows.
