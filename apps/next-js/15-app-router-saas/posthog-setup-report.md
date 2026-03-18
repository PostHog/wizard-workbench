<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 SaaS starter app. Here's what was set up:

- **Client-side PostHog** initialized via `instrumentation-client.ts` with reverse proxy, session replay, and automatic exception capture (`capture_exceptions: true`).
- **Reverse proxy** configured in `next.config.ts` via `/ingest` rewrites to reduce ad-blocker interference.
- **Server-side PostHog** client created at `lib/posthog-server.ts` using `posthog-node`, with immediate flushing (`flushAt: 1`, `flushInterval: 0`).
- **User identification** performed on both client (form `onSubmit` in `login.tsx`) and server (in `signIn`/`signUp` actions) using email as the distinct ID so events from both domains are correlated.
- **12 events** instrumented across authentication, payments, and team management flows.

| Event | Description | File |
|-------|-------------|------|
| `user_signed_in` | User successfully signs in with email/password | `app/(login)/actions.ts` |
| `user_signed_up` | New user successfully creates an account | `app/(login)/actions.ts` |
| `user_signed_out` | User signs out of their account | `app/(login)/actions.ts` |
| `checkout_started` | User initiates a Stripe checkout session for a plan | `lib/payments/stripe.ts` |
| `checkout_completed` | User successfully completes Stripe checkout | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Subscription becomes active/trialing via webhook | `app/api/stripe/webhook/route.ts` |
| `subscription_canceled` | Subscription canceled or unpaid via webhook | `app/api/stripe/webhook/route.ts` |
| `password_updated` | User successfully changes their password | `app/(login)/actions.ts` |
| `account_deleted` | User deletes their account (churn event) | `app/(login)/actions.ts` |
| `account_updated` | User updates their name or email | `app/(login)/actions.ts` |
| `team_member_invited` | Team owner sends an invitation to a new member | `app/(login)/actions.ts` |
| `team_member_removed` | Team member is removed from the team | `app/(login)/actions.ts` |

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog with these insights to monitor user behavior:

1. **Sign-up conversion funnel** — `user_signed_up` → `checkout_started` → `checkout_completed`
   - [Create funnel insight](https://us.posthog.com/project/2/insights/new#funnel)

2. **New user signups over time** — Trend of `user_signed_up`
   - [Create trend insight](https://us.posthog.com/project/2/insights/new#trend)

3. **Checkout conversion rate** — `checkout_started` → `checkout_completed`
   - [Create funnel insight](https://us.posthog.com/project/2/insights/new#funnel)

4. **Churn events** — Trend of `account_deleted` and `subscription_canceled`
   - [Create trend insight](https://us.posthog.com/project/2/insights/new#trend)

5. **Team growth** — Trend of `team_member_invited` vs `team_member_removed`
   - [Create trend insight](https://us.posthog.com/project/2/insights/new#trend)

[Open PostHog dashboards](https://us.posthog.com/project/2/dashboards)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
