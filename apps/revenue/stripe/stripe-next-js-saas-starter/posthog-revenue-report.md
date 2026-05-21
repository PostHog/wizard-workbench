# PostHog Revenue Analytics Setup Report

## Summary

Connected Stripe revenue data to PostHog by adding `posthog_person_distinct_id` metadata to Stripe objects. This enables the Top Customers dashboard, `persons_revenue_analytics` table, and `groups_revenue_analytics` table in PostHog.

## PostHog distinct_id

The project uses `String(user.id)` (the user's database integer ID, cast to string) as the PostHog distinct_id. This is confirmed by:

- `app/(login)/actions.ts`: `posthog.identify({ distinctId: String(foundUser.id), ... })`
- `app/(dashboard)/layout.tsx`: `posthog.identify(String(userData.id), { ... })`

## Changes Made

### Modified Files

**`lib/payments/stripe.ts`**

Added `posthog_person_distinct_id: String(user.id)` to two places inside `createCheckoutSession`:

1. **Checkout session `metadata`** — attaches the distinct_id directly to the Stripe Checkout Session object.
2. **`subscription_data.metadata`** — attaches the distinct_id to the Subscription that Stripe auto-creates when the checkout completes.

```diff
   metadata: {
+    posthog_person_distinct_id: String(user.id)
   },
   subscription_data: {
     trial_period_days: 14,
+    metadata: {
+      posthog_person_distinct_id: String(user.id)
+    }
   }
```

Note: `client_reference_id` was already set to `user.id.toString()` (the same value), which allows the checkout completion handler (`app/api/stripe/checkout/route.ts`) to retrieve the user from the database.

No new Stripe API calls were added. No other files were modified.

## Files Modified or Created

| File | Action |
|------|--------|
| `lib/payments/stripe.ts` | Modified — added `posthog_person_distinct_id` metadata to checkout session and subscription_data |
| `posthog-revenue-report.md` | Created — this report |

## Manual Steps

No manual steps are required for the code changes to take effect. However, you should:

1. **Deploy the changes** — the metadata will only appear on new Stripe objects created after deployment.
2. **Verify in Stripe** — after a test checkout, confirm that the Checkout Session and Subscription objects in the Stripe dashboard contain `posthog_person_distinct_id` in their metadata.
3. **Verify in PostHog** — check the PostHog Revenue Analytics dashboard (Top Customers, `persons_revenue_analytics`) to confirm that revenue data is being connected to person profiles.
4. **Existing customers** — customers and subscriptions created before this change will not have the metadata. PostHog will connect revenue data going forward for new checkouts only.
