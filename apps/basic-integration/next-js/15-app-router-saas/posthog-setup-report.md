<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router SaaS project. Here is a summary of all changes made:

- **`instrumentation-client.ts`** — New file. Initializes `posthog-js` for client-side analytics using the Next.js 15.3+ instrumentation hook. Includes automatic exception capture, session replay, and reverse proxy routing via `/ingest`.
- **`next.config.ts`** — Added PostHog reverse proxy rewrites (`/ingest/*` → `us.i.posthog.com`) and `skipTrailingSlashRedirect: true` for correct API request handling.
- **`lib/posthog-server.ts`** — New file. Singleton `posthog-node` client for server-side event capture across Server Actions and API routes.
- **`app/posthog-identify.tsx`** — New client component. Identifies the logged-in user with PostHog on every page load using `useSWR('/api/user')`, keeping client-side sessions correlated with server-side events.
- **`app/layout.tsx`** — Added `<PostHogIdentify />` to the root layout so user identification fires globally.
- **`app/(dashboard)/pricing/pricing-tracker.tsx`** — New client component. Captures `pricing_viewed` when the pricing page mounts — the top of the subscription conversion funnel.
- **`app/(dashboard)/pricing/page.tsx`** — Added `<PricingTracker />` to fire the `pricing_viewed` event.
- **`app/(login)/actions.ts`** — Added server-side `posthog.identify()` and `posthog.capture()` calls in all auth and team Server Actions: `user_signed_in`, `user_signed_up` (with identify), `user_signed_out`, `account_updated`, `password_updated`, `account_deleted`, `team_member_invited`, `team_member_removed`.
- **`lib/payments/stripe.ts`** — Added `checkout_initiated` capture in `createCheckoutSession`, and `subscription_updated` / `subscription_canceled` captures in `handleSubscriptionChange`.
- **`app/api/stripe/checkout/route.ts`** — Added `checkout_completed` capture after the team subscription is saved in the database.
- **`.env.local`** — Set `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`.

| Event | Description | File |
|---|---|---|
| `pricing_viewed` | User views the pricing page — top of subscription funnel | `app/(dashboard)/pricing/page.tsx` |
| `checkout_initiated` | Stripe checkout session created | `lib/payments/stripe.ts` |
| `checkout_completed` | User returns from Stripe after successful checkout | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Stripe webhook: subscription became active or trialing | `lib/payments/stripe.ts` |
| `subscription_canceled` | Stripe webhook: subscription canceled or unpaid | `lib/payments/stripe.ts` |
| `user_signed_up` | New user account created | `app/(login)/actions.ts` |
| `user_signed_in` | Existing user signed in | `app/(login)/actions.ts` |
| `user_signed_out` | User signed out | `app/(login)/actions.ts` |
| `account_updated` | User updated name or email in General Settings | `app/(login)/actions.ts` |
| `password_updated` | User changed password in Security Settings | `app/(login)/actions.ts` |
| `account_deleted` | User soft-deleted their account — churn event | `app/(login)/actions.ts` |
| `team_member_invited` | Owner invited a new team member | `app/(login)/actions.ts` |
| `team_member_removed` | Owner removed a team member | `app/(login)/actions.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](https://us.posthog.com/project/2/dashboard/1346453)
- [Subscription Conversion Funnel](https://us.posthog.com/project/2/insights/876Kj61f) — pricing_viewed → checkout_initiated → checkout_completed
- [Daily Sign Ups & Sign Ins](https://us.posthog.com/project/2/insights/S7ZgfEVJ) — user acquisition trend
- [Subscription Revenue Events](https://us.posthog.com/project/2/insights/bxo4bUnw) — checkout completions and subscription changes
- [Churn Signals](https://us.posthog.com/project/2/insights/1GcEqNEk) — account deletions and sign-outs
- [Team Growth Activity](https://us.posthog.com/project/2/insights/BVccAOVs) — invitations sent and members removed

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
