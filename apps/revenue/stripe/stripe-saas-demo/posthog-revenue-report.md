# PostHog Revenue Analytics Setup

## Changes made

- Traced the project’s PostHog person identifier from `posthog.identify(email, …)` and the frontend’s `posthog.get_distinct_id()` value.
- Added `posthog_person_distinct_id` metadata to new Stripe Customer objects when the identifier is available.
- Added the same metadata to custom-flow Stripe Subscription objects using the identifier stored on the local user.
- Added the identifier to Stripe Checkout Session metadata and the Checkout-created Subscription metadata.
- Changed Checkout `client_reference_id` to use the PostHog distinct ID, allowing webhook processing to recover the same identity.
- Configured the provided PostHog project token and host through frontend environment variables.
- Added no Stripe API calls, packages, or unrelated payment-flow changes.

## Files modified or created

- Modified `backend/routes/customers.ts`
- Modified `backend/routes/subscriptions.ts`
- Modified `backend/routes/checkout.ts`
- Created `frontend/.env` with `VITE_POSTHOG_API_KEY` and `VITE_POSTHOG_HOST`
- Created `posthog-revenue-report.md`

## Verification

- Re-read all modified routes and confirmed metadata uses the existing PostHog distinct ID rather than a fabricated Stripe or internal identifier.
- Confirmed the environment keys are present in `frontend/.env`.
- Confirmed no new Stripe API operations or dependencies were introduced.
- The backend package does not define a build, typecheck, or lint script, so verification was performed by targeted source review.

## Manual next steps

1. Run both the hosted Checkout and custom card subscription flows with Stripe test data.
2. Confirm the resulting Stripe Customer, Checkout Session, and Subscription objects contain `posthog_person_distinct_id` metadata.
3. Ensure the Stripe source is connected and syncing in the intended PostHog project, then allow the revenue tables and customer analytics views time to refresh.
4. Keep `frontend/.env` local and out of version control; configure the same environment variables in the deployment platform.
