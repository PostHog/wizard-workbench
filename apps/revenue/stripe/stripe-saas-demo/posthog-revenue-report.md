# PostHog Revenue Analytics Setup

## Changes made

- Added `posthog_person_distinct_id` metadata to new Stripe Customer objects using the existing PostHog distinct ID supplied by the frontend.
- Added the same metadata to direct Stripe Subscription creation.
- Added the metadata to Stripe Checkout Sessions and their generated subscriptions.
- Set Checkout `client_reference_id` to the canonical PostHog distinct ID.
- Kept metadata conditional so missing identification data is never replaced with an incorrect fallback.
- Added no Stripe API calls, packages, or dependencies.

## Files modified or created

- Modified `backend/routes/customers.ts`
- Modified `backend/routes/subscriptions.ts`
- Modified `backend/routes/checkout.ts`
- Created `posthog-revenue-report.md`

## Verification

- Reviewed every modified file for syntax and preserved control flow.
- Confirmed all relevant Customer, Subscription, and Checkout creation sites are instrumented.
- Confirmed no new Stripe API calls were introduced.
- The backend package does not define a build, typecheck, or lint script, so verification was performed by source inspection.

## Manual next steps

1. Deploy the updated backend.
2. Run one Stripe Checkout subscription and one custom card-form subscription, then verify the created Stripe objects contain `posthog_person_distinct_id` metadata.
3. Ensure the Stripe source is connected and syncing in PostHog project `483112`; after sync, confirm person-linked revenue and the `persons_revenue_analytics` table populate.
4. Existing customers do not need a separate update call; a newly created tagged subscription can link their subsequent revenue to the PostHog person.
