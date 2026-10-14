# PostHog Revenue Analytics Setup

## Changes made

- Traced the canonical PostHog distinct ID from `posthog.identify(...)` and `posthog.get_distinct_id()` through both subscription flows.
- Added `posthog_person_distinct_id` metadata to existing Stripe Customer and Subscription creation calls.
- Added the same metadata to Stripe Checkout Sessions and their generated subscriptions, and set `client_reference_id` to the PostHog distinct ID.
- Updated frontend API calls to pass the real PostHog distinct ID to the backend without adding any Stripe API requests.
- Updated Checkout and Subscription failure events to use the supplied PostHog distinct ID only.
- Configured the supplied PostHog project token and host in the frontend environment.

## Files modified or created

- `backend/routes/customers.ts`
- `backend/routes/checkout.ts`
- `backend/routes/subscriptions.ts`
- `frontend/src/api.ts`
- `frontend/src/pages/Home.tsx`
- `frontend/src/pages/Subscribe.tsx`
- `frontend/.env` (created or updated; local environment configuration)
- `posthog-revenue-report.md` (created)

## Manual next steps

1. Ensure the Stripe data source is connected to PostHog project `483112`.
2. Create a new test customer and complete each subscription flow, then confirm Stripe Customer, Checkout Session, and Subscription objects contain `posthog_person_distinct_id` metadata.
3. Confirm the resulting customer revenue appears in PostHog Revenue Analytics after Stripe data syncs.
4. Run `npm run build` from the `frontend` directory locally. The automated environment could not invoke the nested frontend build script from the repository root.
5. If the backend does not start, restore or add the pre-existing `backend/posthog.ts` module referenced by the routes; it was absent from the inspected project and was outside this metadata-only change.
