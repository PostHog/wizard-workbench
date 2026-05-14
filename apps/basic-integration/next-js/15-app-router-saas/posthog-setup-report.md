<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router SaaS application. Here's a summary of all changes made:

**New files created:**
- `instrumentation-client.ts` — Initializes `posthog-js` client-side using Next.js 15.3+ instrumentation. Includes session replay, error tracking (`capture_exceptions`), and a reverse proxy via `/ingest`.
- `next.config.ts` — Updated with reverse proxy rewrites routing `/ingest/*` and `/ingest/static/*` and `/ingest/array/*` to PostHog's US region servers.
- `lib/posthog-server.ts` — Server-side PostHog client factory using `posthog-node` with `flushAt: 1` and `flushInterval: 0` for reliable event delivery in short-lived server functions.
- `.env.local` — Populated with `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST`.

**Files edited:**
- `app/(login)/actions.ts` — Server-side capture for all auth and account management events. Includes `posthog.identify()` on sign-in and sign-up to link person profiles.
- `lib/payments/actions.ts` — Captures `checkout_initiated` when a user starts the Stripe checkout flow.
- `app/api/stripe/checkout/route.ts` — Captures `checkout_completed` after successful Stripe checkout callback.
- `app/api/stripe/webhook/route.ts` — Captures `subscription_updated` and `subscription_cancelled` from Stripe webhook events.
- `app/(login)/login.tsx` — Client-side `posthog.identify()` on form submit to link the browser session to the user's email before the server redirect.
- `app/(dashboard)/layout.tsx` — Calls `posthog.reset()` on sign-out to unlink the PostHog session from the user.

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | A new user successfully created an account (with or without invitation) | `app/(login)/actions.ts` |
| `user_signed_in` | A user successfully authenticated with email and password | `app/(login)/actions.ts` |
| `user_signed_out` | A user signed out of their account | `app/(login)/actions.ts` |
| `checkout_initiated` | A user started the Stripe checkout flow from the pricing page | `lib/payments/actions.ts` |
| `checkout_completed` | A user successfully completed Stripe checkout and subscription was created | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | A team's subscription was updated via Stripe webhook (plan change, renewal, etc.) | `app/api/stripe/webhook/route.ts` |
| `subscription_cancelled` | A team's subscription was cancelled/deleted via Stripe webhook | `app/api/stripe/webhook/route.ts` |
| `team_member_invited` | A team owner invited a new member to join their team | `app/(login)/actions.ts` |
| `team_member_removed` | A team member was removed from the team | `app/(login)/actions.ts` |
| `password_updated` | A user successfully changed their account password | `app/(login)/actions.ts` |
| `account_deleted` | A user permanently deleted their account (churn event) | `app/(login)/actions.ts` |
| `account_updated` | A user updated their account information (name or email) | `app/(login)/actions.ts` |

## Next steps

To complete your analytics setup, create an **"Analytics basics"** dashboard in PostHog at https://us.posthog.com/project/2/dashboards with these five recommended insights:

1. **Signup to checkout conversion funnel** — Funnel insight with steps: `user_signed_up` → `checkout_initiated` → `checkout_completed`. Reveals where users drop off in your paid conversion flow.

2. **New signups over time** — Trend insight for `user_signed_up` by day/week. Your primary growth metric.

3. **Churn: account deletions over time** — Trend insight for `account_deleted`. Monitor for spikes that indicate product dissatisfaction.

4. **Subscription activity** — Trend insight comparing `checkout_completed`, `subscription_updated`, and `subscription_cancelled` on the same chart. Revenue health at a glance.

5. **Team engagement** — Trend insight for `team_member_invited` and `team_member_removed`. Teams that invite members are your most engaged users.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
