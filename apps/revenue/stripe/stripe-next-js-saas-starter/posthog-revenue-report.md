# PostHog Revenue Analytics Setup Report

## Summary

Connected Stripe revenue data to PostHog by adding `posthog_person_distinct_id` metadata to the Stripe Checkout Session's subscription data. This enables PostHog to associate Stripe revenue with the correct person profiles.

## PostHog distinct_id

The project uses `String(user.id)` (the user's numeric database ID converted to a string) as the PostHog distinct_id. This is confirmed by consistent usage across:
- `app/(login)/actions.ts` — `distinctId: String(user.id)` in all capture calls
- `app/(dashboard)/layout.tsx` — `posthog.identify(String(userData.id), ...)`

## Changes Made

### Modified files

**`lib/payments/stripe.ts`**

Added `posthog_person_distinct_id` to the `subscription_data.metadata` field inside `createCheckoutSession`. The `user` variable was already in scope (fetched via `getUser()`), and `client_reference_id` was already set to `user.id.toString()`.

```diff
     subscription_data: {
       trial_period_days: 14,
+      metadata: {
+        posthog_person_distinct_id: String(user.id)
+      }
     }
```

### No files created

No new files were needed. No new Stripe API calls were added.

## What this enables

- **Top Customers dashboard**: PostHog can now join Stripe subscription revenue to person profiles.
- **`persons_revenue_analytics` table**: Available in the PostHog data warehouse — maps person IDs to all-time revenue.
- **`groups_revenue_analytics` table**: Available in the PostHog data warehouse for group-level revenue.

## Manual steps

1. **Deploy the change** — the metadata is only added to new checkout sessions going forward. Existing customers created before this change will not have the metadata on their customer object, but PostHog will pick it up from the subscription object on any future subscription event (renewal, update, cancellation).

2. **Verify in Stripe** — after a test checkout, open the subscription in the Stripe dashboard and confirm the metadata key `posthog_person_distinct_id` is present with the correct user ID value.

3. **Verify in PostHog** — after a test checkout, open the PostHog person profile for that user and confirm revenue data appears under the Revenue Analytics section.

4. **Stripe webhook** — the `app/api/stripe/webhook/route.ts` handler currently uses the Stripe `customerId` as the PostHog `distinctId` for `subscription_canceled`/`subscription_updated` events. This is intentional (the user ID is not available in the webhook context), and PostHog will resolve the person mapping via the subscription metadata added above.
