# PostHog Revenue Analytics Setup Report

## Summary

Connected Stripe revenue data to PostHog by adding `posthog_person_distinct_id` metadata to the Stripe Checkout session. This enables PostHog to link Stripe subscriptions, charges, and invoices back to PostHog persons.

## PostHog distinct_id

The project uses `String(user.id)` (the user's numeric database ID as a string) as the PostHog distinct_id. This is consistent across all PostHog `capture` and `identify` calls in the codebase.

## Files Modified

### `lib/payments/stripe.ts`

Added `posthog_person_distinct_id: user.id.toString()` in two places inside `createCheckoutSession`:

1. **Session-level `metadata`** — allows PostHog to read the distinct_id directly from the checkout session object.
2. **`subscription_data.metadata`** — ensures the subscription created by Stripe Checkout carries the distinct_id, which PostHog uses to link revenue to the correct person.

The `client_reference_id` was already set to `user.id.toString()`, so no change was needed there.

```diff
  const session = await stripe.checkout.sessions.create({
    ...
    client_reference_id: user.id.toString(),
+   metadata: {
+     posthog_person_distinct_id: user.id.toString()
+   },
    subscription_data: {
      trial_period_days: 14,
+     metadata: {
+       posthog_person_distinct_id: user.id.toString()
+     }
    }
  });
```

## Files Created

- `posthog-revenue-report.md` — this report

## Notes

- No `stripe.customers.create()` calls exist in this codebase — customers are auto-created by Stripe Checkout, so there is no Step 1 customer creation call to modify.
- The webhook handler (`app/api/stripe/webhook/route.ts`) handles `customer.subscription.updated` and `customer.subscription.deleted` but does not create customers, so no changes are needed there.

## Manual Steps

1. **Deploy the changes** — the `posthog_person_distinct_id` metadata will only appear on new Stripe subscriptions created after deployment.
2. **Verify in Stripe Dashboard** — after a test checkout, confirm that the subscription's metadata contains `posthog_person_distinct_id` set to the user's numeric ID.
3. **Connect Stripe in PostHog** — if not already done, go to [PostHog Data Pipeline](https://us.posthog.com/pipeline) and connect your Stripe account as a data source to enable the revenue analytics tables (`persons_revenue_analytics`, `groups_revenue_analytics`).
4. **Existing customers** — customers created before this change will not have the metadata on their customer object. PostHog will pick it up from the first new subscription or invoice they generate after deployment.
