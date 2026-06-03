<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router SaaS project. The integration includes client-side analytics initialization via `instrumentation-client.ts`, a server-side PostHog client singleton in `lib/posthog-server.ts`, a reverse proxy configuration in `next.config.ts`, 13 tracked business events across 5 files, user identification on every authenticated page load, and PostHog reset on sign-out.

## Events instrumented

| Event Name | Description | File |
|---|---|---|
| `user_signed_in` | User successfully authenticated | `app/(login)/actions.ts` |
| `user_signed_up` | New user created an account | `app/(login)/actions.ts` |
| `invitation_accepted` | User signed up via team invitation link | `app/(login)/actions.ts` |
| `user_signed_out` | User signed out of their session | `app/(login)/actions.ts` |
| `password_updated` | User changed their password | `app/(login)/actions.ts` |
| `account_deleted` | User deleted their account (soft delete) | `app/(login)/actions.ts` |
| `account_updated` | User updated their account name or email | `app/(login)/actions.ts` |
| `team_member_invited` | Team owner sent an invitation to a new member | `app/(login)/actions.ts` |
| `team_member_removed` | Team owner removed a member from the team | `app/(login)/actions.ts` |
| `checkout_started` | User initiated a Stripe checkout session | `lib/payments/actions.ts` |
| `subscription_activated` | Stripe checkout completed; subscription activated | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Subscription status changed via Stripe webhook | `app/api/stripe/webhook/route.ts` |
| `subscription_canceled` | Subscription canceled or unpaid via Stripe webhook | `app/api/stripe/webhook/route.ts` |

## Next steps

To build out your analytics for these events, create an **"Analytics basics"** dashboard in PostHog with the following suggested insights:

- **[Sign-ups over time →](/project/2/insights/new?insight=TRENDS)** — Trends chart for `user_signed_up` to track growth.
- **[Sign-up to subscription funnel →](/project/2/insights/new?insight=FUNNELS)** — Funnel from `user_signed_up` → `checkout_started` → `subscription_activated` to measure conversion.
- **[Subscription cancellations →](/project/2/insights/new?insight=TRENDS)** — Trends for `subscription_canceled` to monitor churn signals.
- **[Account deletions →](/project/2/insights/new?insight=TRENDS)** — Trends for `account_deleted` — a critical churn signal.
- **[Team collaboration activity →](/project/2/insights/new?insight=TRENDS)** — Trends for `team_member_invited` and `team_member_removed` side-by-side to track team engagement.

You can view all your [dashboards here →](/project/2/dashboard).

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
