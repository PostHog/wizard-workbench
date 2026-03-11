<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 App Router SaaS application. The integration includes:

- **Client-side initialization** via `instrumentation-client.ts` using the Next.js 15.3+ recommended pattern, with a reverse proxy configured in `next.config.ts` to improve reliability and reduce ad-blocker interference.
- **Server-side tracking** via a `lib/posthog-server.ts` helper using `posthog-node`, with `flushAt: 1` and `flushInterval: 0` for immediate event delivery in serverless/short-lived environments.
- **User identification** on sign-in and sign-up server actions, linking PostHog distinct IDs to database user IDs with email properties.
- **13 business events** across authentication, account management, payments, and team management flows.
- **Error tracking** enabled via `capture_exceptions: true` in `instrumentation-client.ts`.

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `user_signed_up` | User successfully created a new account (with or without an invite) | `app/(login)/actions.ts` |
| `user_signed_in` | User successfully signed in to an existing account | `app/(login)/actions.ts` |
| `user_signed_out` | User signed out of their account | `app/(login)/actions.ts` |
| `account_updated` | User updated their account name or email | `app/(login)/actions.ts` |
| `password_updated` | User successfully changed their password | `app/(login)/actions.ts` |
| `account_deleted` | User deleted their account (churn event) | `app/(login)/actions.ts` |
| `team_member_invited` | Team owner invited a new member to the team | `app/(login)/actions.ts` |
| `team_member_removed` | Team owner removed a member from the team | `app/(login)/actions.ts` |
| `checkout_completed` | User successfully completed checkout and subscription was created | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | User's subscription status or plan was changed via Stripe webhook | `app/api/stripe/webhook/route.ts` |
| `subscription_cancelled` | User's subscription was deleted/cancelled via Stripe webhook | `app/api/stripe/webhook/route.ts` |
| `customer_portal_opened` | User opened the Stripe customer portal to manage their subscription | `lib/payments/actions.ts` |

## Files created or modified

| File | Change |
|---|---|
| `instrumentation-client.ts` | **Created** — client-side PostHog initialization with error tracking |
| `lib/posthog-server.ts` | **Created** — server-side PostHog client factory |
| `next.config.ts` | **Modified** — added reverse proxy rewrites for PostHog ingestion |
| `app/(login)/actions.ts` | **Modified** — added 8 events + user identify calls |
| `app/api/stripe/checkout/route.ts` | **Modified** — added `checkout_completed` event |
| `app/api/stripe/webhook/route.ts` | **Modified** — added `subscription_updated` and `subscription_cancelled` events |
| `lib/payments/actions.ts` | **Modified** — added `customer_portal_opened` event |
| `.env.local` | **Created** — `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` |

## Next steps

We recommend building the following insights and a dashboard in PostHog to monitor key business metrics:

1. **Signup trend** — `user_signed_up` over time (line chart)
2. **Conversion funnel** — `user_signed_up` → `checkout_completed` (funnel)
3. **Churn signals** — `account_deleted` + `subscription_cancelled` over time
4. **Team growth** — `team_member_invited` over time
5. **Subscription health** — `subscription_updated` breakdown by `subscription_status`

Visit [https://us.posthog.com/project/2/dashboards](https://us.posthog.com/project/2/dashboards) to create an "Analytics basics" dashboard with these insights.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
