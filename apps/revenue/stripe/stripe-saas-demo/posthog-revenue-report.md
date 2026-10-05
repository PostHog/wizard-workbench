# PostHog Revenue Analytics Setup

## Changes made

- Added `posthog_person_distinct_id` metadata to Stripe Customer creation.
- Threaded the current `posthog.get_distinct_id()` value into the Stripe Checkout request.
- Added the distinct ID to Checkout Session metadata, Checkout `client_reference_id`, and the generated Subscription metadata.
- Added the stored PostHog distinct ID to subscriptions created through the custom card flow.
- Preserved existing Stripe creation flows and added no new Stripe API calls or dependencies.

## Files modified or created

- `backend/routes/customers.ts`
- `backend/routes/checkout.ts`
- `backend/routes/subscriptions.ts`
- `frontend/src/api.ts`
- `frontend/src/pages/Home.tsx`
- `posthog-revenue-report.md` (created)

## Manual next steps

1. Run both applications and test the Stripe Checkout and custom card subscription flows with Stripe test mode.
2. Confirm new Stripe Customers, Checkout Sessions, and Subscriptions contain `posthog_person_distinct_id` metadata.
3. Ensure the Stripe data source is connected to PostHog project `483112`, then allow ingestion time before checking Top Customers and the `persons_revenue_analytics` table.
4. The repository currently imports `backend/posthog.ts`, but that file was not present during verification. Restore or add the existing server PostHog client module before running the backend.

Verification was performed by reading every modified file and tracing the distinct ID through both payment flows. No project-level build command was available from the repository root; the backend package also defines no build or typecheck script.
