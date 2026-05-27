# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router SaaS application. PostHog is now initialized client-side via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+), with a reverse proxy configured in `next.config.ts` to route all PostHog requests through `/ingest`. A shared server-side client (`lib/posthog-server.ts`) captures events from Server Actions and API routes using `posthog-node`. Users are identified client-side in the dashboard layout when session data loads, and `posthog.reset()` is called on sign-out. All 12 key business events are instrumented across auth flows, billing, and team management.

| Event Name | Description | File |
|---|---|---|
| `user_signed_up` | Fired when a new user successfully creates an account (with or without an invitation) | `app/(login)/actions.ts` |
| `user_signed_in` | Fired when an existing user successfully signs in | `app/(login)/actions.ts` |
| `user_signed_out` | Fired when a user signs out of their account | `app/(login)/actions.ts` |
| `checkout_started` | Fired when a user initiates a Stripe checkout session for a subscription plan | `lib/payments/actions.ts` |
| `checkout_completed` | Fired when Stripe redirects back after a successful subscription checkout | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Fired via Stripe webhook when a subscription status changes | `app/api/stripe/webhook/route.ts` |
| `subscription_cancelled` | Fired via Stripe webhook when a subscription is cancelled or goes unpaid | `app/api/stripe/webhook/route.ts` |
| `team_member_invited` | Fired when a team owner sends an invitation to a new team member | `app/(login)/actions.ts` |
| `team_member_removed` | Fired when a team owner removes a member from the team | `app/(login)/actions.ts` |
| `account_updated` | Fired when a user updates their account name or email | `app/(login)/actions.ts` |
| `password_updated` | Fired when a user successfully changes their password | `app/(login)/actions.ts` |
| `account_deleted` | Fired when a user soft-deletes their account | `app/(login)/actions.ts` |

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog with the following insights to monitor key business metrics:

1. **User Signups & Sign-Ins Over Time** — Trends for `user_signed_up` and `user_signed_in`, daily over the last 30 days.
2. **Checkout Conversion Funnel** — Funnel from `checkout_started` → `checkout_completed` to measure purchase conversion rate.
3. **Subscription Health** — Trends comparing `subscription_updated` (active) vs `subscription_cancelled` to track churn signals.
4. **Team Growth** — Trend of `team_member_invited` to understand viral/collaborative growth.
5. **Account Churn** — Trend of `account_deleted` events to track retention risk.

You can create this dashboard at [/dashboards](/dashboards) in your PostHog project.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
