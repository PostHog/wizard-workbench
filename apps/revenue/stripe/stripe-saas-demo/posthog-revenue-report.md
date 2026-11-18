# PostHog Revenue Analytics Setup

## Changes made

- Configured the supplied PostHog project token and host in the local root and frontend environment files.
- Reused the app's existing PostHog distinct ID from `posthog.get_distinct_id()`; no identifier was fabricated.
- Added `posthog_person_distinct_id` metadata to existing Stripe Customer creation.
- Threaded the same distinct ID through the hosted Checkout flow and added it to both the Checkout Session and its generated Subscription metadata.
- Threaded the same distinct ID through the custom card flow and added it to Stripe Subscription metadata.
- Preserved the existing `client_reference_id` value used to reconcile Checkout Sessions with local users.
- Added no new Stripe API calls and did not change payment behavior.

## Files modified or created

- `.env` — created/updated with server-side PostHog configuration (gitignored).
- `frontend/.env` — updated with client-side PostHog configuration (gitignored).
- `frontend/src/api.ts`
- `frontend/src/pages/Home.tsx`
- `frontend/src/pages/Subscribe.tsx`
- `backend/routes/customers.ts`
- `backend/routes/checkout.ts`
- `backend/routes/subscriptions.ts`
- `posthog-revenue-report.md` — this report.

## Verification

- Re-read every modified source file and confirmed the original Stripe creation and payment logic remains intact.
- Confirmed all four PostHog environment keys are present in real local env files.
- Confirmed metadata is conditional when no distinct ID is available, rather than sending an empty or invented identifier.
- No package or dependency changes were required.

## Manual steps

1. Connect the Stripe account as a data source in PostHog project `483112` and enable the **Stripe** source in Revenue Analytics. Webhook sync is recommended for freshness and mutation handling: [Stripe revenue analytics setup](https://posthog.com/docs/revenue-analytics/payment-platforms/stripe).
2. Ensure the existing Stripe secret, publishable key, price IDs, and webhook signing secret are configured locally; these were not supplied or changed.
3. Run one test through each checkout flow and confirm newly created Stripe Customers and Subscriptions contain `posthog_person_distinct_id` metadata.
4. The repository currently imports `backend/posthog.ts` from backend routes, but that file is absent. Restore or add the intended server PostHog client module before running the backend if it is not generated elsewhere.

For how PostHog resolves Stripe revenue to persons, see [Connect to customers](https://posthog.com/docs/revenue-analytics/connect-to-customers).
