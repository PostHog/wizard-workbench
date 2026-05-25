# PostHog Revenue Analytics Setup Report

## Summary

Connected Stripe revenue data to PostHog by embedding the PostHog distinct ID as metadata on Stripe Checkout sessions. This enables the Top Customers dashboard, `persons_revenue_analytics`, and `groups_revenue_analytics` tables in PostHog.

## PostHog Distinct ID

The project uses `String(user.id)` (the user's database integer ID, stringified) as the PostHog distinct ID. This was confirmed in:
- `app/(dashboard)/layout.tsx`: `posthog.identify(String(userData.id), ...)`
- `app/(login)/actions.ts`: `posthog.identify({ distinctId: String(user.id), ... })`

## Changes Made

### Modified Files

**`lib/payments/stripe.ts`**

Added `posthog_person_distinct_id` metadata to the `stripe.checkout.sessions.create` call in `createCheckoutSession`:

- Added `metadata.posthog_person_distinct_id` at the session level
- Added `subscription_data.metadata.posthog_person_distinct_id` so the metadata propagates to the created subscription

The `client_reference_id` was already set to `user.id.toString()` (the distinct ID), which is correct.

```typescript
metadata: {
  posthog_person_distinct_id: user.id.toString()
},
subscription_data: {
  trial_period_days: 14,
  metadata: {
    posthog_person_distinct_id: user.id.toString()
  }
}
```

## Stripe Objects Covered

| Object | Covered | Notes |
|---|---|---|
| Checkout Session | ✅ | `metadata.posthog_person_distinct_id` added |
| Subscription | ✅ | `subscription_data.metadata.posthog_person_distinct_id` added |
| Customer | N/A | No `customers.create` call — Stripe auto-creates via Checkout |
| PaymentIntent | N/A | No direct `paymentIntents.create` call |
| Charge | N/A | No direct `charges.create` call |

## No New Files Created

No new files were created. Only `lib/payments/stripe.ts` was modified.

## Manual Steps

1. **Deploy the changes** so new checkout sessions carry the metadata.
2. **Verify in Stripe** — open a test checkout session in the Stripe dashboard and confirm `posthog_person_distinct_id` appears in both the session metadata and subscription metadata.
3. **Connect Stripe in PostHog** (if not already done) — go to [Data Pipeline → Sources](https://us.posthog.com/pipeline/sources) and add your Stripe account.
4. **Check the Top Customers dashboard** in PostHog Revenue Analytics after a few syncs to confirm persons are being matched correctly.
5. **Existing customers** — for customers created before this change, PostHog will automatically resolve the distinct ID from the subscription metadata on their next invoice or subscription event.
