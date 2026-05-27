<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 App Router SaaS starter. Here is a summary of all changes made:

**New files created:**
- `instrumentation-client.ts` — Client-side PostHog initialization using the `posthog-js` SDK. Configured with a reverse proxy (`/ingest`), exception capture, and debug mode in development. This is the recommended approach for Next.js 15.3+ apps.
- `lib/posthog-server.ts` — Singleton server-side PostHog client using `posthog-node`. Used across all Server Actions and API routes.

**Modified files:**
- `next.config.ts` — Added reverse proxy rewrites for `/ingest/static/*`, `/ingest/array/*`, and `/ingest/*` to route PostHog traffic through the app, reducing ad-blocker interference. Added `skipTrailingSlashRedirect: true` for PostHog API compatibility.
- `app/(login)/actions.ts` — Added PostHog server-side event capture and user `identify()` calls for every auth and team management action. On sign-in and sign-up, PostHog also calls `identify()` to link events to the user's profile.
- `app/(dashboard)/layout.tsx` — Added client-side `posthog.identify()` in the `UserMenu` component (triggered when user data loads via SWR) and `posthog.reset()` on sign-out to clear the client-side session.
- `lib/payments/actions.ts` — Added `checkout_started` server-side event when a user initiates a Stripe checkout.
- `app/api/stripe/checkout/route.ts` — Added `checkout_completed` server-side event after a successful Stripe checkout session.
- `app/api/stripe/webhook/route.ts` — Added `subscription_updated` and `subscription_cancelled` server-side events when Stripe webhook fires for subscription changes.
- `app/(dashboard)/pricing/page.tsx` — Added `pricing_viewed` server-side event (top of conversion funnel) for authenticated users who visit the pricing page.
- `.env.local` — Created with `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables.

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user_signed_up` | New user created an account (directly or via team invitation) | `app/(login)/actions.ts` |
| `user_signed_in` | Existing user signed in | `app/(login)/actions.ts` |
| `user_signed_out` | User signed out | `app/(login)/actions.ts` |
| `pricing_viewed` | Authenticated user viewed the pricing page (top of funnel) | `app/(dashboard)/pricing/page.tsx` |
| `checkout_started` | User initiated a Stripe checkout session | `lib/payments/actions.ts` |
| `checkout_completed` | User successfully completed Stripe checkout and subscription was created | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Team subscription was updated via Stripe webhook | `app/api/stripe/webhook/route.ts` |
| `subscription_cancelled` | Team subscription was cancelled via Stripe webhook | `app/api/stripe/webhook/route.ts` |
| `team_member_invited` | Team owner invited a new member | `app/(login)/actions.ts` |
| `team_member_removed` | Team member was removed | `app/(login)/actions.ts` |
| `password_updated` | User changed their password | `app/(login)/actions.ts` |
| `account_updated` | User updated name or email | `app/(login)/actions.ts` |
| `account_deleted` | User deleted their account | `app/(login)/actions.ts` |

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog with the following insights. You can create them using the links below:

1. **Signup-to-Paid Conversion Funnel** — Track conversion from pricing page visit through checkout completion:
   [Create funnel insight](/insights/new?insight=FUNNELS)
   Steps: `pricing_viewed` → `checkout_started` → `checkout_completed`

2. **User Signups Over Time** — Monitor new user growth:
   [Create trends insight](/insights/new?insight=TRENDS)
   Event: `user_signed_up`

3. **Daily Active Users** — Track sign-in frequency:
   [Create trends insight](/insights/new?insight=TRENDS)
   Event: `user_signed_in`

4. **Subscription Health** — Compare new subscriptions vs cancellations:
   [Create trends insight](/insights/new?insight=TRENDS)
   Events: `checkout_completed`, `subscription_cancelled`

5. **Account Churn** — Track account deletions:
   [Create trends insight](/insights/new?insight=TRENDS)
   Event: `account_deleted`

[View all insights](/insights)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
