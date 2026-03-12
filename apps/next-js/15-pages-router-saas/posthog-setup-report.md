<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 Pages Router SaaS application. The integration covers client-side initialization via `instrumentation-client.ts`, server-side event tracking via `posthog-node`, a reverse proxy via Next.js rewrites, user identification at login and signup, and event capture across all critical business flows including authentication, checkout, and team management.

## Integration Summary

- **Client-side SDK**: Initialized in `instrumentation-client.ts` with exception capture enabled
- **Server-side SDK**: `lib/posthog-server.ts` singleton client for API route tracking
- **Reverse proxy**: Added `/ingest/*` rewrites in `next.config.ts` to route PostHog traffic through your domain
- **Environment variables**: `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` set in `.env.local`
- **User identification**: `posthog.identify()` called client-side on successful sign-in/sign-up; `posthog.identify()` called server-side in auth API routes
- **Error tracking**: `posthog.captureException()` added to catch blocks in key client-side flows

## Events Instrumented

| Event Name | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signed in to their account | `components/login.tsx` |
| `user_signed_up` | User successfully created a new account | `components/login.tsx` |
| `user_signed_out` | User signed out (with `posthog.reset()`) | `components/header.tsx` |
| `checkout_initiated` | User clicked Get Started on pricing page | `pages/pricing.tsx` |
| `account_updated` | User updated their account name or email | `pages/dashboard/general.tsx` |
| `server_user_signed_in` | Server-side sign-in with user identification | `pages/api/auth/sign-in.ts` |
| `server_user_signed_up` | Server-side sign-up with user identification | `pages/api/auth/sign-up.ts` |
| `team_member_invited` | Team owner invited a new member | `pages/api/team/invite.ts` |
| `team_member_removed` | Team owner removed a member | `pages/api/team/remove-member.ts` |
| `subscription_checkout_completed` | User completed Stripe checkout | `pages/api/stripe/checkout.ts` |
| `subscription_changed` | Subscription updated/deleted via webhook | `pages/api/stripe/webhook.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](https://us.posthog.com/project/2/dashboard/1346453)
  - [Subscription Conversion Funnel](https://us.posthog.com/project/2/insights/876Kj61f) – Tracks user flow from pricing click through checkout completion
  - [Daily Sign Ups & Sign Ins](https://us.posthog.com/project/2/insights/S7ZgfEVJ) – Daily unique users signing up and signing in over the last 30 days
  - [Subscription Revenue Events](https://us.posthog.com/project/2/insights/bxo4bUnw) – Weekly checkout completions and subscription status changes
  - [Churn Signals](https://us.posthog.com/project/2/insights/1GcEqNEk) – Weekly sign-outs as churn indicators
  - [Team Growth Activity](https://us.posthog.com/project/2/insights/BVccAOVs) – Weekly team invitations sent and members removed

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
