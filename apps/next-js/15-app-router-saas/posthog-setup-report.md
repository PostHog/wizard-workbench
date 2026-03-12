<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Next.js 15 App Router SaaS starter. The integration covers both client-side and server-side event tracking for all critical business operations, including user authentication, account management, team collaboration, and Stripe payment events.

**Files created:**
- `instrumentation-client.ts` — Client-side PostHog initialization using the Next.js 15.3+ instrumentation pattern, with reverse proxy support, exception capture, and session replay.
- `lib/posthog-server.ts` — Server-side PostHog client factory for use in Server Actions and API routes.
- `next.config.ts` — Updated with reverse proxy rewrites to route PostHog ingestion through `/ingest`, improving reliability and reducing tracking blocker interception.

**Files modified:**
- `app/(login)/actions.ts` — Added server-side PostHog identify + event capture for all auth and account Server Actions.
- `app/api/stripe/checkout/route.ts` — Added `checkout_completed` event capture after successful Stripe subscription creation.
- `app/api/stripe/webhook/route.ts` — Added `subscription_updated` event capture on Stripe webhook subscription events.

**Environment variables set in `.env.local`:**
- `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`
- `NEXT_PUBLIC_POSTHOG_HOST`

| Event | Description | File |
|---|---|---|
| `user_signed_up` | User successfully created a new account | `app/(login)/actions.ts` |
| `user_signed_in` | User successfully signed in to their account | `app/(login)/actions.ts` |
| `user_signed_out` | User signed out of their account | `app/(login)/actions.ts` |
| `account_updated` | User updated their account name or email | `app/(login)/actions.ts` |
| `password_updated` | User successfully changed their password | `app/(login)/actions.ts` |
| `account_deleted` | User deleted their account (soft delete) | `app/(login)/actions.ts` |
| `team_member_invited` | Team owner sent an invitation to a new team member | `app/(login)/actions.ts` |
| `team_member_removed` | Team owner removed a member from the team | `app/(login)/actions.ts` |
| `checkout_completed` | User successfully completed a Stripe checkout and subscription was created | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Stripe webhook: subscription status changed (upgrade, downgrade, cancellation) | `app/api/stripe/webhook/route.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](https://us.posthog.com/project/2/dashboard/1346453)
  - [Daily Sign Ups & Sign Ins](https://us.posthog.com/project/2/insights/876Kj61f) — Daily unique users signing up and signing in over the last 30 days
  - [Subscription Conversion Funnel](https://us.posthog.com/project/2/insights/S7ZgfEVJ) — Tracks user flow from pricing page through checkout completion
  - [Subscription Revenue Events](https://us.posthog.com/project/2/insights/bxo4bUnw) — Weekly checkout completions and subscription status changes
  - [Churn Signals](https://us.posthog.com/project/2/insights/1GcEqNEk) — Weekly account deletions and sign-outs as churn indicators
  - [Team Growth Activity](https://us.posthog.com/project/2/insights/BVccAOVs) — Weekly team invitations sent and members removed

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
