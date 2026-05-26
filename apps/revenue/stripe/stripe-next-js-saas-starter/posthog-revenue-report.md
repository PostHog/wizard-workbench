# PostHog Revenue Analytics Setup Report

## Summary

This project uses Stripe Checkout (subscription mode) to handle payments. The PostHog distinct_id is `String(user.id)` — the user's numeric database ID converted to a string, consistent with how `posthog.identify` is called in both the frontend (`app/(dashboard)/layout.tsx`) and backend (`app/(login)/actions.ts`).

There are no direct `stripe.customers.create` calls in the codebase — customers are created by Stripe automatically during checkout. The only create call is `stripe.checkout.sessions.create` in `lib/payments/stripe.ts`.

## Changes Made

### `lib/payments/stripe.ts`

Added `posthog_person_distinct_id` to `subscription_data.metadata` in the `createCheckoutSession` function. The `client_reference_id` was already set to `user.id.toString()` (the same distinct_id), so no change was needed there.

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
  metadata: {
    posthog_person_distinct_id: String(user.id)
  }
}
```

This ensures that every new subscription created via Stripe Checkout will carry the `posthog_person_distinct_id` metadata field, allowing PostHog to link revenue data to the correct person profile.

## Files Modified

| File | Change |
|------|--------|
| `lib/payments/stripe.ts` | Added `posthog_person_distinct_id` to `subscription_data.metadata` in `createCheckoutSession` |

## Files Created

| File | Description |
|------|-------------|
| `posthog-revenue-report.md` | This report |

## Manual Steps

1. **Connect Stripe to PostHog**: In your PostHog project, go to [Data pipeline](https://us.posthog.com/pipeline) and connect your Stripe account as a data source. This enables the revenue analytics tables and dashboards.

2. **Deploy the change**: Deploy the updated `lib/payments/stripe.ts` to production so that new subscriptions automatically include the `posthog_person_distinct_id` metadata.

3. **Verify in Stripe**: After a test checkout, inspect the created subscription in the Stripe Dashboard and confirm the `posthog_person_distinct_id` metadata field is present with the correct user ID.

4. **Existing customers**: For customers created before this change, PostHog will pick up `posthog_person_distinct_id` from the subscription metadata on their next billing cycle. No backfill is needed — PostHog resolves the ID from the most recently created child object.

5. **Check Top Customers dashboard**: Once revenue data starts flowing, visit the [Top Customers dashboard](https://us.posthog.com/revenue_analytics#top-customers) in PostHog to verify persons are being matched to revenue correctly.
