# PostHog Revenue Analytics Setup

## Changes made

- Added `posthog_person_distinct_id` metadata to new Stripe Customer objects when the browser-provided PostHog distinct ID is available.
- Added the same metadata to Stripe Checkout Sessions and their generated Subscription objects.
- Updated Stripe Checkout's `client_reference_id` to use the PostHog distinct ID rather than the app's internal user ID.
- Added the metadata to subscriptions created through the custom payment form.
- Reused the exact distinct ID captured with `posthog.get_distinct_id()` and stored on the local user; no fallback or fabricated identifier is written to Stripe metadata.
- Added no Stripe API calls and made no changes to payment behavior.

## Files modified or created

- Modified `backend/routes/customers.ts`
- Modified `backend/routes/checkout.ts`
- Modified `backend/routes/subscriptions.ts`
- Created `posthog-revenue-report.md`

## Verification

- Re-read all modified files and confirmed all Stripe creation call sites are covered.
- Confirmed existing logic, error handling, and Stripe abstraction usage are preserved.
- The backend package does not define a build or typecheck script, so verification was performed by source inspection rather than an ad-hoc compiler command.

## Manual next steps

1. Run both the Stripe Checkout and custom payment-form subscription flows in a test environment.
2. In Stripe, verify the created Customer, Checkout Session, and Subscription include `posthog_person_distinct_id` metadata.
3. Confirm the Stripe data source is connected and syncing in PostHog project `483112`; after sync, validate person-level revenue and Top Customers data.
