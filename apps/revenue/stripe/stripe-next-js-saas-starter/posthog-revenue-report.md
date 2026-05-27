# PostHog Revenue Analytics Setup Report

## What Was Done

Connected Stripe revenue data to PostHog by adding `posthog_person_distinct_id` metadata to the Stripe Checkout Session's `subscription_data`. This enables PostHog to link Stripe subscriptions, invoices, and charges to the corresponding person profiles via their distinct ID.

### PostHog distinct_id

The project identifies users with `String(user.id)` — confirmed in `app/(dashboard)/layout.tsx`:

```ts
posthog.identify(String(userData.id), { email: userData.email, name: userData.name });
```

This same value is now written to Stripe subscription metadata so PostHog can resolve which person owns each subscription.

## Files Modified

### `lib/payments/stripe.ts`

Added `posthog_person_distinct_id` to the `subscription_data.metadata` object inside `createCheckoutSession`:

```ts
subscription_data: {
  trial_period_days: 14,
  metadata: {
    posthog_person_distinct_id: String(user.id)
  }
}
```

The `client_reference_id` field was already set to `user.id.toString()` — no changes needed there.

## Files Created

- `posthog-revenue-report.md` (this file)

## What PostHog Will Now Show

Once subscriptions are created with this metadata:

- **Top Customers dashboard** — links Stripe revenue to persons
- **`persons_revenue_analytics` table** — maps `person_id` to all-time revenue in the data warehouse
- **`groups_revenue_analytics` table** — maps group keys to revenue

## Manual Steps

1. **Existing customers**: Existing Stripe customers created before this change won't have the metadata on their customer objects. PostHog will pick up the metadata from newly created subscriptions, so new sign-ups will be linked automatically. No backfill is required for the integration to work going forward.

2. **Deploy the change**: Push and deploy `lib/payments/stripe.ts` to production so new checkout sessions include the metadata.

3. **Verify in Stripe**: After a test checkout, inspect the subscription in the Stripe dashboard and confirm `posthog_person_distinct_id` appears under **Metadata**.

4. **Verify in PostHog**: After a test checkout, check the [Revenue Analytics dashboard](/revenue_analytics) and the [Data Warehouse](/data-warehouse) for the `persons_revenue_analytics` table to confirm the person is linked.
