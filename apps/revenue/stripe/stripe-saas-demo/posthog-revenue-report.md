# PostHog Revenue Analytics Setup Report

## Summary

This project now passes `posthog_person_distinct_id` as metadata on all Stripe objects that PostHog reads to connect revenue data to persons. The distinct_id used is the value obtained from `posthog.get_distinct_id()` on the frontend (which resolves to the user's email after `posthog.identify(email, ...)` is called), falling back to email when unavailable.

## Changes Made

### Files Modified

#### `backend/routes/customers.ts`
Added `posthog_person_distinct_id` to the metadata of `stripe.customers.create`. The value `posthogDistinctId || email` was already present in the request body and matches the existing PostHog identify pattern in the codebase.

```diff
 const customer = await stripe.customers.create({
   email,
   name,
+  metadata: { posthog_person_distinct_id: posthogDistinctId || email },
 });
```

#### `backend/routes/checkout.ts`
- Imported `getUser` from `../users`
- Added user lookup to retrieve `posthogDistinctId` before creating the checkout session
- Added `subscription_data.metadata` with `posthog_person_distinct_id` to the Stripe Checkout Session (subscription mode)

```diff
+import { getUser } from "../users";
 ...
+const user = userId ? getUser(userId) : undefined;
+const posthogDistinctId = user?.posthogDistinctId || customerEmail;
+
 const session = await stripe.checkout.sessions.create({
   mode: "subscription",
   ...
+  subscription_data: {
+    metadata: { posthog_person_distinct_id: posthogDistinctId },
+  },
 });
```

#### `backend/routes/subscriptions.ts`
Extended the existing user lookup (already present for logging) to capture `posthogDistinctId`, then added conditional metadata to `stripe.subscriptions.create`.

```diff
 if (userId) {
   const user = getUser(userId);
   if (user) {
     console.log(`Creating subscription for user ${user.email} (${user.id})`);
+    posthogDistinctId = user.posthogDistinctId;
   }
 }

 const subscription = await stripe.subscriptions.create({
   customer: customerId,
   items: [{ price: priceId }],
   ...
+  ...(posthogDistinctId && { metadata: { posthog_person_distinct_id: posthogDistinctId } }),
 });
```

## How the distinct_id is determined

The frontend calls `posthog.identify(email, { email, name })` on sign-up, making the email the PostHog distinct_id. When the user proceeds to checkout, `posthog.get_distinct_id()` returns the email, which is sent to the backend as `posthogDistinctId` and stored on the `User` object. All Stripe metadata now uses this same value, consistent with the existing PostHog capture calls in the backend.

## Manual Steps Required

1. **Connect Stripe as a data warehouse source in PostHog** — Go to [Data Warehouse](https://us.posthog.com/project/483112/data-warehouse) and add your Stripe account as a source. PostHog will use the `posthog_person_distinct_id` metadata field to link revenue data to person profiles.

2. **Test the flow end-to-end** — Create a test customer and complete a subscription purchase. Verify in Stripe that the customer and subscription objects have `posthog_person_distinct_id` in their metadata.

3. **Set the `STRIPE_WEBHOOK_SECRET` environment variable** — If not already configured, set this so Stripe webhook events are verified. The existing webhook handler already correctly resolves the PostHog distinct_id from `client_reference_id`.

4. **Wait for data to appear** — After your first real transactions flow through, the `persons_revenue_analytics` and `groups_revenue_analytics` tables in PostHog's data warehouse will be populated, enabling revenue queries and the Top Customers dashboard.
