# PostHog Revenue Analytics Setup

## Changes made

- Configured the existing frontend PostHog SDK with the provided project token and ingestion host.
- Added `posthog_person_distinct_id` metadata to Stripe Customer creation.
- Persisted the resolved PostHog distinct ID on the local user so downstream payment flows reuse the same identity.
- Added `posthog_person_distinct_id` metadata to direct Stripe Subscription creation.
- Added the distinct ID to recurring Stripe Checkout Session metadata, `subscription_data.metadata`, and `client_reference_id`.
- Added no new Stripe API calls and left payment behavior unchanged.

## Files modified or created

- `backend/routes/customers.ts`
- `backend/routes/subscriptions.ts`
- `backend/routes/checkout.ts`
- `frontend/.env` (created; normally ignored by Git)
- `posthog-revenue-report.md` (created)

## Verification

- Re-read every modified TypeScript file and confirmed the existing Stripe abstraction and request flow were preserved.
- Confirmed both frontend PostHog environment variables are present.
- The backend package has no build or typecheck script, so verification was limited to source review. The existing routes import `backend/posthog.ts`, but that file is not present in this checkout.

## Manual next steps

1. In PostHog, connect the Stripe account as a revenue data source and enable Stripe under Revenue Analytics. Webhook sync is recommended for fresh updates: [Stripe revenue analytics setup](https://posthog.com/docs/revenue-analytics/payment-platforms/stripe).
2. Restore or add the existing intended `backend/posthog.ts` implementation before running the backend; its absence predates these revenue metadata changes.
3. Run both subscription flows in Stripe test mode, then confirm newly created Customers and Subscriptions contain `posthog_person_distinct_id` metadata.
4. After Stripe sync completes, verify person-level revenue and the revenue analytics views in PostHog: [Connect Stripe customers to PostHog](https://posthog.com/docs/revenue-analytics/connect-to-customers).
