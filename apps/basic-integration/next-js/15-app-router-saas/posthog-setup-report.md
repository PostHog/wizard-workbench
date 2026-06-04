# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router SaaS starter. PostHog is now initialized client-side via `instrumentation-client.ts`, with a reverse proxy configured in `next.config.ts` to route PostHog requests through `/ingest`. A server-side client (`lib/posthog-server.ts`) is used for all server actions and API routes. User identity is linked across client and server: the login/signup form calls `posthog.identify()` on submit, all server actions call `posthog.identify()` with the user's email, and `posthog.reset()` is called on sign-out. Error tracking is enabled via `capture_exceptions: true` in the PostHog init.

| Event name | Description | File |
|---|---|---|
| `user_signed_up` | Fires when a new user successfully creates an account | `app/(login)/actions.ts` |
| `user_signed_in` | Fires when an existing user successfully signs in | `app/(login)/actions.ts` |
| `user_signed_out` | Fires when a user signs out | `app/(login)/actions.ts` |
| `checkout_started` | Fires when a user initiates a Stripe checkout session | `lib/payments/actions.ts` |
| `checkout_completed` | Fires when a Stripe checkout is successfully completed | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Fires when a subscription status changes via Stripe webhook | `app/api/stripe/webhook/route.ts` |
| `subscription_canceled` | Fires when a subscription is canceled via Stripe webhook | `app/api/stripe/webhook/route.ts` |
| `team_member_invited` | Fires when a team owner sends an invitation | `app/(login)/actions.ts` |
| `team_member_removed` | Fires when a team member is removed from the team | `app/(login)/actions.ts` |
| `account_updated` | Fires when a user updates their account name or email | `app/(login)/actions.ts` |
| `password_updated` | Fires when a user successfully changes their password | `app/(login)/actions.ts` |
| `account_deleted` | Fires when a user permanently deletes their account | `app/(login)/actions.ts` |
| `customer_portal_opened` | Fires when a user opens the Stripe customer portal | `lib/payments/actions.ts` |

## Next steps

We recommend creating an **"Analytics basics (wizard)"** dashboard in PostHog with the following insights:

1. **Checkout funnel** — Funnel from `checkout_started` → `checkout_completed` to measure payment conversion
2. **Sign-ups over time** — Trend of `user_signed_up` events to track growth
3. **Active users (sign-ins)** — Trend of `user_signed_in` to monitor engagement
4. **Subscription cancellations** — Trend of `subscription_canceled` events to track churn signals
5. **Team growth** — Trend of `team_member_invited` to track collaboration adoption

You can create this dashboard at: [https://us.posthog.com/project/2/dashboards](https://us.posthog.com/project/2/dashboards)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
