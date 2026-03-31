<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 SaaS application (Pages Router). The integration covers both client-side and server-side analytics, user identification, and error tracking.

**Summary of changes:**

- Created `instrumentation-client.ts` — initializes `posthog-js` with a reverse proxy, exception capture, and debug mode in development
- Updated `next.config.ts` — added `/ingest` reverse proxy rewrites so analytics events are less likely to be blocked by ad blockers
- Created `lib/posthog-server.ts` — server-side PostHog singleton using `posthog-node` (`flushAt: 1`, `flushInterval: 0` for immediate flushing in serverless API routes)
- Updated `components/login.tsx` — identifies the user on successful sign-in/sign-up, captures the respective event, passes `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` headers to the server, and captures exceptions
- Updated `components/header.tsx` — captures `user_signed_out` and calls `posthog.reset()` to clear identity on sign-out
- Updated `pages/pricing.tsx` — captures `checkout_started` with plan and price details when a user initiates checkout, captures exceptions
- Updated `pages/dashboard/general.tsx` — captures `account_updated` on successful profile changes, captures exceptions
- Updated `pages/api/auth/sign-in.ts` — server-side: identifies the user, captures `user_signed_in` with anonymous ID alias for cross-device/session correlation
- Updated `pages/api/auth/sign-up.ts` — server-side: identifies the new user, captures `user_signed_up` with invite usage info and anonymous ID alias
- Updated `pages/api/stripe/create-checkout.ts` — captures `checkout_session_created` with price and team details
- Updated `pages/api/stripe/webhook.ts` — captures `subscription_updated` and `subscription_cancelled` from Stripe webhook events
- Updated `pages/api/team/invite.ts` — captures `team_member_invited` with invitee email, role, and team ID
- Updated `pages/api/team/remove-member.ts` — captures `team_member_removed` with member and team details

| Event | Description | File |
|-------|-------------|------|
| `user_signed_in` | User successfully signed in (client-side) | `components/login.tsx` |
| `user_signed_up` | User created a new account (client-side) | `components/login.tsx` |
| `user_signed_out` | User signed out | `components/header.tsx` |
| `checkout_started` | User initiated checkout from pricing page | `pages/pricing.tsx` |
| `account_updated` | User updated name/email in settings | `pages/dashboard/general.tsx` |
| `user_signed_in` | Server-side: authenticated user | `pages/api/auth/sign-in.ts` |
| `user_signed_up` | Server-side: new user created | `pages/api/auth/sign-up.ts` |
| `checkout_session_created` | Stripe checkout session created | `pages/api/stripe/create-checkout.ts` |
| `subscription_updated` | Stripe subscription updated via webhook | `pages/api/stripe/webhook.ts` |
| `subscription_cancelled` | Stripe subscription deleted via webhook | `pages/api/stripe/webhook.ts` |
| `team_member_invited` | Team member invitation sent | `pages/api/team/invite.ts` |
| `team_member_removed` | Team member removed from team | `pages/api/team/remove-member.ts` |

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog with the following insights to keep an eye on user behavior:

1. **Signup & signin trend** — Trend of `user_signed_up` and `user_signed_in` over time to track user acquisition and engagement
2. **Conversion funnel** — Funnel from `user_signed_up` → `checkout_started` → `checkout_session_created` to measure paid conversion
3. **Subscription churn** — Trend of `subscription_cancelled` over time to monitor churn
4. **Subscription growth** — Trend of `subscription_updated` (active status) to monitor subscription health
5. **Team engagement** — Count of `team_member_invited` and `team_member_removed` events to track collaborative usage

Create your dashboard here: https://us.posthog.com/project/238460/dashboard

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
