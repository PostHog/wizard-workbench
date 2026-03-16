<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 App Router SaaS project. The integration includes:

- **Client-side initialization** via `instrumentation-client.ts` using the Next.js 15.3+ instrumentation API, with a reverse proxy configured in `next.config.ts` for reliable event delivery and ad-blocker resistance.
- **Server-side event tracking** using `posthog-node` through a shared `lib/posthog-server.ts` client, added to all critical server actions and API routes.
- **User identification** on both client (via `posthog.identify()` in the login form's `onSubmit`) and server (via `posthog.identify()` in sign-in and sign-up server actions), ensuring anonymous and identified events are correlated.
- **Error tracking** enabled via `capture_exceptions: true` in the client-side init.
- **Environment variables** stored in `.env.local` (never hardcoded).

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `user_signed_in` | User successfully signed in with email and password | `app/(login)/actions.ts` |
| `user_signed_up` | New user created an account and optionally accepted an invitation | `app/(login)/actions.ts` |
| `user_signed_out` | User signed out of their account | `app/(login)/actions.ts` |
| `account_updated` | User updated their account name or email | `app/(login)/actions.ts` |
| `password_updated` | User successfully changed their password | `app/(login)/actions.ts` |
| `account_deleted` | User deleted their account (soft delete) | `app/(login)/actions.ts` |
| `team_member_invited` | Team owner invited a new member by email | `app/(login)/actions.ts` |
| `team_member_removed` | Team owner removed a member from the team | `app/(login)/actions.ts` |
| `checkout_initiated` | User clicked the subscribe button on the pricing page | `lib/payments/actions.ts` |
| `checkout_completed` | User completed Stripe checkout and subscription was activated | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Stripe subscription was updated (plan change, renewal, cancellation) | `app/api/stripe/webhook/route.ts` |

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog with the following insights:

1. **Subscription conversion funnel** — Funnel: `checkout_initiated` → `checkout_completed`
2. **Daily sign-ups** — Trend: `user_signed_up` over time
3. **Sign-in activity** — Trend: `user_signed_in` over time
4. **Account churn** — Trend: `account_deleted` over time
5. **Team growth** — Trend: `team_member_invited` over time

You can create these at: [https://us.posthog.com/project/2/dashboard](https://us.posthog.com/project/2/dashboard)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
