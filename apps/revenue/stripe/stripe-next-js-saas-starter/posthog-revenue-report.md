# PostHog Revenue Analytics Setup Report

## Summary

Connected Stripe subscription data to PostHog by adding `posthog_person_distinct_id` metadata to the Stripe checkout session's `subscription_data`. This enables PostHog to link Stripe subscriptions to the correct person profiles.

## PostHog distinct_id

The project identifies users with `String(user.id)` / `user.id.toString()` (the numeric database user ID converted to a string). This is confirmed by `posthog.identify(String(userData.id), ...)` in `app/(dashboard)/layout.tsx` and `distinctId: String(user[0].id)` in the checkout route.

## Changes Made

### Modified Files

**`lib/payments/stripe.ts`**

Added `posthog_person_distinct_id` to the `subscription_data.metadata` in the `createCheckoutSession` function:

```ts
subscription_data: {
  trial_period_days: 14,
  metadata: {
    posthog_person_distinct_id: user.id.toString()
  }
}
```

The `client_reference_id` was already set to `user.id.toString()` — no change needed there.

## Scope

- No `stripe.customers.create` calls exist in this codebase — customers are created implicitly by Stripe during checkout.
- No standalone `stripe.subscriptions.create`, `stripe.paymentIntents.create`, or `stripe.invoices.create` calls exist.
- The only Stripe creation call relevant to revenue is `stripe.checkout.sessions.create` (subscription mode), which has been updated.

## Manual Steps

1. **Deploy the changes** so that new checkout sessions include the `posthog_person_distinct_id` metadata on their subscriptions.
2. **Verify in Stripe** that new subscriptions have `posthog_person_distinct_id` in their metadata after a test checkout.
3. **Connect PostHog to Stripe** via the PostHog data warehouse settings if you haven't already — go to [Data warehouse](/data-warehouse) and add your Stripe integration so PostHog can read the metadata.
4. **Existing customers** — subscriptions created before this change won't have the metadata. PostHog will pick up the distinct_id from the most recently created child object (subscription, charge, or invoice), so existing customers will be linked once they next trigger a billing event.
