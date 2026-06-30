# PostHog Revenue Analytics Setup Report

## Summary

Connected Stripe revenue data to PostHog by adding `posthog_person_distinct_id` metadata to Stripe objects. This enables the Top Customers dashboard and `persons_revenue_analytics` / `groups_revenue_analytics` tables in PostHog.

## Distinct ID

The project uses `String(user.id)` (the database user ID as a string) as the PostHog distinct_id, confirmed across all `posthog.capture` and `posthog.identify` calls in the codebase.

## Files Modified

### `lib/payments/stripe.ts`

Added `posthog_person_distinct_id` in two places inside `createCheckoutSession`:

1. **Session-level metadata** — `metadata.posthog_person_distinct_id` on the `checkout.sessions.create` call itself.
2. **Subscription metadata** — `subscription_data.metadata.posthog_person_distinct_id` so the created subscription carries the distinct_id directly (required for PostHog to resolve revenue to persons).

The `client_reference_id` was already set to `user.id.toString()` before this change, which matches the distinct_id.

## No New Files Created

No new files were added. Only one existing file was modified.

## Manual Steps

No manual steps are required for the code changes to take effect. However:

1. **Deploy the changes** — the metadata will only appear on Stripe objects created after deployment.
2. **Existing customers** — for customers created before this change, PostHog will pick up the distinct_id from the first subscription or invoice created after deployment (PostHog resolves from the most recently created child object).
3. **Verify in PostHog** — after a test checkout, check the Stripe customer/subscription in the Stripe dashboard for the `posthog_person_distinct_id` metadata key, then confirm the person appears in the PostHog [Top Customers dashboard](https://app.posthog.com/revenue_analytics#top-customers).
