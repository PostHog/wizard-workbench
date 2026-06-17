# PostHog Revenue Analytics — Setup Report

## Summary

Revenue analytics has been configured by adding `posthog_person_distinct_id` to Stripe metadata. This links Stripe subscription data to PostHog person profiles, enabling the Top Customers dashboard and `persons_revenue_analytics` / `groups_revenue_analytics` tables.

## PostHog distinct_id

The project identifies users in PostHog using `String(user.id)` (the numeric database user ID cast to string). This value is set consistently across the backend (`app/(login)/actions.ts`) and frontend (`app/(dashboard)/layout.tsx`).

## Changes Made

### `lib/payments/stripe.ts`

Added `posthog_person_distinct_id` to the `subscription_data.metadata` of the `stripe.checkout.sessions.create` call inside `createCheckoutSession`. The `client_reference_id` was already set to `user.id.toString()` (the PostHog distinct_id).

**Before:**
```typescript
subscription_data: {
  trial_period_days: 14
}
```

**After:**
```typescript
subscription_data: {
  trial_period_days: 14,
  metadata: { posthog_person_distinct_id: user.id.toString() }
}
```

## Files Modified

| File | Change |
|------|--------|
| `lib/payments/stripe.ts` | Added `posthog_person_distinct_id` to `subscription_data.metadata` in `createCheckoutSession` |

## No Stripe Customer Creation Found

The app does not call `stripe.customers.create` directly. Stripe customers are created automatically during the Checkout Session flow. There are no `PaymentIntent`, `Subscription`, `Invoice`, `Charge`, `Refund`, or `Transfer` creation calls in the application code — all such objects are managed by Stripe through the Checkout Session.

## Manual Steps

1. **Deploy the change** — the metadata will be attached to new subscriptions from the next deployment onwards.
2. **Existing customers** — subscriptions created before this change will not have `posthog_person_distinct_id` on their metadata. PostHog resolves the distinct_id from the most recently created child object, so existing customers will be linked once they trigger a subscription update or renewal.
3. **Verify in Stripe Dashboard** — after a test checkout, confirm the subscription object in Stripe has `posthog_person_distinct_id` in its metadata.
4. **Verify in PostHog** — after data syncs, check the [Revenue Analytics dashboard](https://us.posthog.com/project/2/revenue_analytics) and the `persons_revenue_analytics` table in the [Data Warehouse](https://us.posthog.com/project/2/data-warehouse).
