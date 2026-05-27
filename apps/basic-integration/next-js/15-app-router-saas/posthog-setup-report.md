<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 SaaS starter. The integration covers both client-side and server-side event tracking, user identification, error tracking, and a reverse proxy for improved data reliability.

**Changes made:**

- Created `instrumentation-client.ts` — initializes posthog-js for client-side tracking using Next.js 15.3+ native instrumentation. Includes error tracking via `capture_exceptions: true` and a reverse proxy via `/ingest`.
- Created `lib/posthog-server.ts` — singleton `posthog-node` client used by all server-side code (Server Actions, API routes).
- Updated `next.config.ts` — added `/ingest` reverse proxy rewrites for `us-assets.i.posthog.com` and `us.i.posthog.com`, with `skipTrailingSlashRedirect: true`.
- Updated `app/(dashboard)/layout.tsx` — identifies users via `posthog.identify()` when user data loads, captures `user_signed_out` and calls `posthog.reset()` on sign-out.
- Updated `app/(login)/actions.ts` — server-side events for authentication and team management actions.
- Updated `lib/payments/actions.ts` — server-side `checkout_started` event.
- Updated `app/api/stripe/checkout/route.ts` — server-side `checkout_completed` event with subscription details.
- Updated `app/api/stripe/webhook/route.ts` — server-side `subscription_updated` and `subscription_cancelled` events from Stripe webhooks.

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully authenticated with email and password | `app/(login)/actions.ts` |
| `user_signed_up` | New user created an account (with or without team invitation) | `app/(login)/actions.ts` |
| `user_signed_out` | User signed out; resets PostHog identity client-side | `app/(dashboard)/layout.tsx` |
| `checkout_started` | User initiated a Stripe checkout session for a subscription plan | `lib/payments/actions.ts` |
| `checkout_completed` | User successfully completed Stripe checkout and subscription was activated | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Team subscription status changed via Stripe webhook | `app/api/stripe/webhook/route.ts` |
| `subscription_cancelled` | Team subscription was cancelled or became unpaid via Stripe webhook | `app/api/stripe/webhook/route.ts` |
| `password_updated` | User successfully changed their account password | `app/(login)/actions.ts` |
| `account_deleted` | User deleted their account (soft delete) | `app/(login)/actions.ts` |
| `team_member_invited` | Team owner sent an invitation to a new member | `app/(login)/actions.ts` |
| `team_member_removed` | Team member was removed from the team | `app/(login)/actions.ts` |

## Next steps

To get the most out of this integration, create an "Analytics basics" dashboard in PostHog with these suggested insights:

- **Sign-up to checkout funnel** — `user_signed_up` → `checkout_started` → `checkout_completed`
- **Sign-in trends** — daily/weekly `user_signed_in` event count
- **Sign-up trends** — daily/weekly `user_signed_up` event count over time
- **Subscription health** — `subscription_updated` vs `subscription_cancelled` side by side
- **Team growth** — `team_member_invited` trend over time

You can create these by visiting your [PostHog project](https://us.posthog.com/project/2/insights/new).

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
