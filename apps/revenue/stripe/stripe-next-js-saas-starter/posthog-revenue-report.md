# PostHog Revenue Analytics Setup Report

## Summary

Configured the Stripe integration to attach `posthog_person_distinct_id` metadata to Stripe objects, enabling PostHog to connect revenue data to persons.

## PostHog distinct_id

The project uses `String(user.id)` (the database user ID as a string) as the PostHog distinct_id, consistent with all `posthog.identify()` calls across the codebase (e.g. `posthog.identify(String(userData.id), ...)` in `app/(dashboard)/layout.tsx`).

## Changes Made

### Modified Files

**`lib/payments/stripe.ts`**

Added `posthog_person_distinct_id` to the `subscription_data.metadata` of the Stripe Checkout Session create call in `createCheckoutSession`. The `user` object was already available in scope from `getUser()`. The `client_reference_id` was already set to `user.id.toString()`.

```diff
     subscription_data: {
       trial_period_days: 14,
+      metadata: {
+        posthog_person_distinct_id: String(user.id)
+      }
     }
```

## What was not changed

- No `stripe.customers.create()` calls exist in the codebase (Stripe creates customers implicitly via Checkout).
- No `stripe.subscriptions.create()`, `stripe.paymentIntents.create()`, `stripe.charges.create()`, or `stripe.invoices.create()` calls exist — all billing flows go through Stripe Checkout.
- The webhook handler (`app/api/stripe/webhook/route.ts`) only handles subscription lifecycle events and does not create new Stripe objects.

## Manual Steps

1. **Deploy the change** so new subscriptions created via Stripe Checkout will carry the `posthog_person_distinct_id` metadata on the subscription object.

2. **Connect Stripe as a data warehouse source in PostHog** if not already done. Go to [Data warehouse](https://us.posthog.com/project/483112/data-warehouse) → New source → Stripe, and enter your Stripe API key.

3. **Verify in PostHog** after the first new subscription is created. In the [Revenue analytics](https://us.posthog.com/project/483112/revenue_analytics) view, the Top Customers table should show the person linked to their revenue. You can also query `persons_revenue_analytics` in SQL.

4. **Existing customers** will automatically be linked once they renew or update their subscription (PostHog resolves `posthog_person_distinct_id` from the most recently created child object — subscription, charge, or invoice).
