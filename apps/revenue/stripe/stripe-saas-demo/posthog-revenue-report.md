# PostHog Revenue Analytics Setup Report

## Summary

Connected Stripe revenue data to PostHog by adding `posthog_person_distinct_id` metadata to Stripe objects. This enables the Top Customers dashboard, `persons_revenue_analytics` table, and `groups_revenue_analytics` table in PostHog.

## PostHog distinct_id

The project uses `email` as the PostHog distinct_id, set via `posthog.identify(email, ...)` in `frontend/src/pages/Home.tsx`. The frontend captures the current distinct_id with `posthog.get_distinct_id()` before each checkout flow and sends it to the backend as `posthogDistinctId`, where it is stored on the user object.

## Files Modified

### `backend/routes/customers.ts`

Added `posthog_person_distinct_id` to the metadata of `stripe.customers.create`. The value is `posthogDistinctId` (sent from the frontend) falling back to `email` — both resolve to the same PostHog distinct_id.

```diff
 const customer = await stripe.customers.create({
   email,
   name,
+  metadata: { posthog_person_distinct_id: posthogDistinctId || email },
 });
```

### `backend/routes/checkout.ts`

Added `getUser` import, looked up the user by `userId` to retrieve their `posthogDistinctId`, and added `subscription_data.metadata` to the checkout session (mode is `subscription`). The existing `client_reference_id` was left unchanged as the webhook handler already resolves the distinct_id from it via user lookup.

```diff
+import { getUser } from "../users";
 ...
+const user = userId ? getUser(userId) : undefined;
+const posthogDistinctId = user?.posthogDistinctId || user?.email;
+
 const session = await stripe.checkout.sessions.create({
   mode: "subscription",
   ...
+  ...(posthogDistinctId ? {
+    subscription_data: {
+      metadata: { posthog_person_distinct_id: posthogDistinctId },
+    },
+  } : {}),
 });
```

### `backend/routes/subscriptions.ts`

Threaded `posthogDistinctId` out of the existing user lookup block and added it to `stripe.subscriptions.create` metadata. No new user lookups or Stripe API calls were added.

```diff
+let posthogDistinctId: string | undefined;
 if (userId) {
   const user = getUser(userId);
   if (user) {
     console.log(`Creating subscription for user ${user.email} (${user.id})`);
+    posthogDistinctId = user.posthogDistinctId || user.email;
   }
 }

 const subscription = await stripe.subscriptions.create({
   customer: customerId,
   items: [{ price: priceId }],
   payment_behavior: "default_incomplete",
   payment_settings: { save_default_payment_method: "on_subscription" },
   expand: ["latest_invoice.payment_intent"],
+  ...(posthogDistinctId ? { metadata: { posthog_person_distinct_id: posthogDistinctId } } : {}),
 });
```

## Files Created

- `posthog-revenue-report.md` — this file

## Manual Steps

1. **Connect Stripe to PostHog** — in PostHog, go to [Data pipelines](https://us.posthog.com/pipeline/sources) and add Stripe as a data warehouse source using your Stripe API key. This ingests historical data.

2. **Verify the metadata is flowing** — after deploying these changes, create a test customer and subscription, then check in Stripe that the customer and subscription objects have `posthog_person_distinct_id` in their metadata.

3. **Check the Top Customers dashboard** — once PostHog has ingested Stripe data with the metadata, the [Revenue Analytics](https://us.posthog.com/revenue_analytics) section should start linking revenue to person profiles.

4. **Existing customers** — customers created before this change will be retroactively linked as new charges, subscriptions, or invoices are created with the metadata (PostHog resolves the distinct_id from the most recently created child object).
