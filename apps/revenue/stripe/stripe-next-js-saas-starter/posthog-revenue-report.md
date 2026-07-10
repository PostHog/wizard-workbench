# PostHog Revenue Analytics Setup Report

## Summary

Connected Stripe revenue data to PostHog by adding `posthog_person_distinct_id` metadata to the Stripe checkout session's subscription data. This allows PostHog to link Stripe subscriptions back to the correct person profile.

## PostHog Distinct ID

The project identifies users with `String(user.id)` — the user's numeric database ID converted to a string. This matches the `posthog.identify(String(userData.id), ...)` call in `app/(dashboard)/layout.tsx` and the backend `posthog.identify({ distinctId: String(foundUser.id), ... })` calls in `app/(login)/actions.ts`.

## Changes Made

### `lib/payments/stripe.ts`

Added `posthog_person_distinct_id` to `subscription_data.metadata` in the `createCheckoutSession` function:

```typescript
subscription_data: {
  trial_period_days: 14,
  metadata: { posthog_person_distinct_id: user.id.toString() }
}
```

- `user` is already retrieved earlier in the function via `getUser()`
- `client_reference_id` was already set to `user.id.toString()` prior to this change
- No new Stripe API calls were added; only the existing `checkout.sessions.create` call was modified

## Files Modified

| File | Change |
|------|--------|
| `lib/payments/stripe.ts` | Added `metadata.posthog_person_distinct_id` to `subscription_data` in `createCheckoutSession` |

## How It Works

When a user subscribes, Stripe Checkout creates the session with `subscription_data.metadata` containing `posthog_person_distinct_id`. PostHog reads this metadata from the subscription object and uses it to connect the Stripe revenue data to the person's profile in PostHog.

The `client_reference_id` (already present) ensures PostHog can also look up the user if needed via the checkout session webhook.

## Manual Steps

1. **Connect Stripe as a data source in PostHog**: Go to [Data Warehouse](https://us.posthog.com/project/483112/data-warehouse) and connect your Stripe account if you haven't already.

2. **Verify the metadata appears on new subscriptions**: After your next test subscription, check the subscription object in the Stripe dashboard to confirm `posthog_person_distinct_id` is present in its metadata.

3. **Existing customers**: Existing Stripe customers created before this change will not automatically have the metadata on their customer object. However, any new subscription renewals or updates will carry the metadata at the subscription level, which PostHog resolves from child objects.
