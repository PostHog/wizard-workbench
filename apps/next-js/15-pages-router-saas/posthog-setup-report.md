<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 Pages Router application. Here's a summary of all changes made:

## What was set up

- **`instrumentation-client.ts`** (new): Initializes PostHog client-side using the recommended Next.js 15.3+ approach. Enables session replay, error tracking (`capture_exceptions`), and routes traffic through a reverse proxy to reduce ad-blocker interference.
- **`next.config.ts`** (updated): Added `/ingest` reverse proxy rewrites pointing to `https://us.i.posthog.com` and `https://us-assets.i.posthog.com`, plus `skipTrailingSlashRedirect: true`.
- **`lib/posthog-server.ts`** (new): Singleton server-side PostHog client using `posthog-node`, configured with `flushAt: 1` and `flushInterval: 0` for reliable event delivery in serverless API routes.
- **`.env.local`** (updated): Added `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables.
- **`posthog-js`** and **`posthog-node`** packages installed via pnpm.

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user_signed_up` | Fired when a user successfully creates a new account | `components/login.tsx` |
| `user_signed_in` | Fired when a user successfully signs into their account | `components/login.tsx` |
| `user_signed_out` | Fired when a user signs out of their account | `components/header.tsx` |
| `checkout_initiated` | Fired when a user clicks Get Started on a pricing plan | `pages/pricing.tsx` |
| `checkout_completed` | Server-side: fired on Stripe webhook when a subscription is created/updated | `pages/api/stripe/webhook.ts` |
| `subscription_cancelled` | Server-side: fired on Stripe webhook when a subscription is deleted | `pages/api/stripe/webhook.ts` |
| `customer_portal_opened` | Fired when a user clicks Manage Subscription to open the Stripe customer portal | `pages/dashboard/index.tsx` |
| `team_member_invited` | Fired when a team owner sends an invitation to a new member | `pages/dashboard/index.tsx` |
| `team_member_removed` | Fired when a team member is removed from the team | `pages/dashboard/index.tsx` |
| `account_updated` | Fired when a user updates their account information (name/email) | `pages/dashboard/general.tsx` |
| `sign_in_failed` | Fired when a sign-in attempt fails, capturing the reason | `components/login.tsx` |
| `sign_up_failed` | Fired when a sign-up attempt fails, capturing the reason | `components/login.tsx` |

## Additional integrations

- **User identification**: `posthog.identify(email)` is called on successful sign-in and sign-up in `components/login.tsx`, linking all subsequent events to the user.
- **Session reset**: `posthog.reset()` is called on sign-out in `components/header.tsx` to cleanly end the session.
- **Error tracking**: `posthog.captureException()` is added to catch blocks in `components/login.tsx`, `components/header.tsx`, `pages/pricing.tsx`, `pages/dashboard/index.tsx`, and `pages/dashboard/general.tsx`.

## Next steps

We've built a dashboard and insights for you to keep an eye on user behavior, based on the events we just instrumented:

### Dashboard
- [Analytics basics](https://us.posthog.com/project/2/dashboard/1296055) — Key business metrics: sign-ups, conversions, churn, and team activity

### Insights
- [Sign-ups & Sign-ins (Daily)](https://us.posthog.com/project/2/insights/eFh5TiwJ) — Daily trend of new sign-ups and sign-ins over the last 30 days
- [Sign-up to Subscription Conversion Funnel](https://us.posthog.com/project/2/insights/k7GA0RQW) — Conversion funnel from sign-up → checkout initiated → subscription activated
- [Subscription Cancellations (Weekly)](https://us.posthog.com/project/2/insights/tGqOWdE7) — Weekly count of subscription cancellations — key churn signal
- [Team Collaboration Activity](https://us.posthog.com/project/2/insights/bg7wPBOc) — Trend of team invitations sent and members removed
- [Account Deletions (Weekly)](https://us.posthog.com/project/2/insights/ArSQQBSu) — Weekly count of account deletions — hard churn signal

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
