# PostHog Revenue Analytics Setup Report

## Summary

Connected Stripe revenue data to PostHog by adding `posthog_person_distinct_id` metadata to Stripe subscription objects. This enables PostHog to link Stripe revenue to person profiles using the same distinct ID already used throughout the app.

## PostHog distinct_id

The app identifies users with `String(user.id)` — the user's numeric database ID converted to a string. This is confirmed by:
- `app/(dashboard)/layout.tsx`: `posthog.identify(String(userData.id), ...)`
- `app/(login)/actions.ts`: `posthog.identify({ distinctId: String(foundUser.id), ... })`

## Changes Made

### `lib/payments/stripe.ts`

Added `posthog_person_distinct_id` to the `subscription_data.metadata` in `createCheckoutSession`. The `user` object is already fetched at the top of the function via `getUser()`, so `user.id` is directly in scope.

```diff
     subscription_data: {
       trial_period_days: 14,
+      metadata: {
+        posthog_person_distinct_id: String(user.id)
+      }
     }
```

The checkout session already had `client_reference_id: user.id.toString()` set, which correctly matches the distinct_id.

## Files Modified

| File | Change |
|------|--------|
| `lib/payments/stripe.ts` | Added `posthog_person_distinct_id` to `subscription_data.metadata` in `createCheckoutSession` |

## How it works

When a user subscribes, Stripe Checkout creates a subscription with the `posthog_person_distinct_id` metadata set to the user's ID. PostHog reads this metadata from the subscription object and links the Stripe revenue to the correct person profile.

No `stripe.customers.create` call exists in this codebase — customers are auto-created by Stripe Checkout, so the subscription metadata is the correct attachment point.

## Manual Steps

No manual steps are required. Once deployed, new subscriptions created through Stripe Checkout will automatically carry the `posthog_person_distinct_id` metadata, and PostHog will begin linking revenue to person profiles.

To verify the setup is working:
1. Complete a test checkout flow
2. In Stripe, check the subscription's metadata for `posthog_person_distinct_id`
3. In PostHog, navigate to **Revenue Analytics** or query the `persons_revenue_analytics` data warehouse table
