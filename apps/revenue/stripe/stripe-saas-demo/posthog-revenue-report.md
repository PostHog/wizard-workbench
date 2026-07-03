# PostHog Revenue Analytics Setup Report

## Summary

Connected Stripe revenue data to PostHog by adding `posthog_person_distinct_id` metadata to Stripe Customer, Checkout Session, and Subscription objects. PostHog uses this metadata to link Stripe payments to person profiles in the `persons_revenue_analytics` table and the Top Customers dashboard.

**PostHog distinct_id used**: the user's email address (set via `posthog.identify(email, ...)` in `frontend/src/pages/Home.tsx:67`). When the PostHog distinct_id is available from the user record (stored as `posthogDistinctId` via `posthog.get_distinct_id()` at checkout time), that value takes priority.

---

## Files Modified

### `backend/routes/customers.ts`

Added `posthog_person_distinct_id` to the `metadata` parameter of `stripe.customers.create`. The value is `posthogDistinctId || email`, matching the pattern already used for PostHog's own `identify` call in the same handler.

```diff
  const customer = await stripe.customers.create({
    email,
    name,
+   metadata: { posthog_person_distinct_id: posthogDistinctId || email },
  });
```

### `backend/routes/checkout.ts`

- Added `import { getUser } from "../users"` to resolve the user's `posthogDistinctId` from the `userId` passed in the request.
- Added `subscription_data.metadata` to the `stripe.checkout.sessions.create` call with `posthog_person_distinct_id`.
- Fallback chain: `posthogDistinctId` → `customerEmail` → `"TODO_POSTHOG_DISTINCT_ID"`.

```diff
+ import { getUser } from "../users";
  ...
+ const posthogDistinctId = userId ? getUser(userId)?.posthogDistinctId : undefined;

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    ...
    client_reference_id: userId,
    customer_email: customerEmail,
+   subscription_data: {
+     metadata: { posthog_person_distinct_id: posthogDistinctId || customerEmail || "TODO_POSTHOG_DISTINCT_ID" },
+   },
  });
```

### `backend/routes/subscriptions.ts`

Refactored the `getUser` lookup to outer scope (behaviour-equivalent) and added `metadata` with `posthog_person_distinct_id` to `stripe.subscriptions.create`. Uses `user?.posthogDistinctId ?? "TODO_POSTHOG_DISTINCT_ID"` since `getUser` was already imported.

```diff
- if (userId) {
-   const user = getUser(userId);
-   if (user) {
-     console.log(`Creating subscription for user ${user.email} (${user.id})`);
-   }
- }
+ const user = userId ? getUser(userId) : undefined;
+ if (user) {
+   console.log(`Creating subscription for user ${user.email} (${user.id})`);
+ }

  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    payment_behavior: "default_incomplete",
    payment_settings: { save_default_payment_method: "on_subscription" },
    expand: ["latest_invoice.payment_intent"],
+   metadata: { posthog_person_distinct_id: user?.posthogDistinctId ?? "TODO_POSTHOG_DISTINCT_ID" },
  });
```

---

## Files Created

- `posthog-revenue-report.md` (this file)

---

## Manual Steps

1. **Connect Stripe to PostHog** — in your PostHog project, go to **Data warehouse → Sources** and add your Stripe account. This is required for the `persons_revenue_analytics` table and the Top Customers dashboard to populate with data.

2. **Verify the `TODO_POSTHOG_DISTINCT_ID` placeholder** — in `subscriptions.ts`, if `userId` is not passed to the `/api/subscriptions` endpoint or the user record has no `posthogDistinctId`, the metadata will contain the literal string `"TODO_POSTHOG_DISTINCT_ID"`. Confirm that all callers of this endpoint provide a `userId` that resolves to a user with a stored `posthogDistinctId`.

3. **Backfill existing customers** — metadata is only set on newly created Stripe objects. Existing Stripe customers created before this change will not have `posthog_person_distinct_id` on their customer objects. PostHog will automatically resolve the distinct_id from newer child objects (subscriptions or invoices) once new billing events occur for those customers.

4. **Deploy the backend** — the changes are in the backend Node.js service. Deploy it for the metadata to start flowing into Stripe.
