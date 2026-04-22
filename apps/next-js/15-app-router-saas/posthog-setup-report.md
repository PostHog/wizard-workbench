<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 App Router SaaS project. The integration covers client-side initialization via `instrumentation-client.ts` (Next.js 15.3+ pattern), a reverse proxy via `next.config.ts` rewrites, a singleton server-side PostHog client in `lib/posthog-server.ts`, and 12 event captures across 4 files spanning authentication, payments, and team management. User identification is performed on both sign-in and sign-up server actions. Error tracking is enabled via `capture_exceptions: true` in the client initialization.

| Event | Description | File |
|-------|-------------|------|
| `user_signed_in` | User successfully signed in with email and password | `app/(login)/actions.ts` |
| `user_signed_up` | New user account created and team provisioned | `app/(login)/actions.ts` |
| `user_signed_out` | User signed out of their account | `app/(login)/actions.ts` |
| `checkout_initiated` | User started a Stripe checkout session for a plan | `lib/payments/actions.ts` |
| `checkout_completed` | User successfully completed Stripe checkout and subscription activated | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Stripe subscription was updated (plan change, renewal, etc.) | `app/api/stripe/webhook/route.ts` |
| `subscription_cancelled` | Stripe subscription was cancelled or deleted | `app/api/stripe/webhook/route.ts` |
| `team_member_invited` | Team owner sent an invitation to a new team member | `app/(login)/actions.ts` |
| `team_member_removed` | Team member was removed from a team | `app/(login)/actions.ts` |
| `account_updated` | User updated their account name or email | `app/(login)/actions.ts` |
| `password_updated` | User successfully changed their password | `app/(login)/actions.ts` |
| `account_deleted` | User deleted their account (churn event) | `app/(login)/actions.ts` |

## Next steps

We recommend building the following insights in your PostHog project to monitor user behavior based on the events just instrumented:

1. **Signup-to-checkout conversion funnel** — Funnel from `user_signed_up` → `checkout_initiated` → `checkout_completed`
2. **Sign-in trend** — Trend chart of `user_signed_in` over time to track daily/weekly active users
3. **Churn events** — Trend of `subscription_cancelled` and `account_deleted` events over time
4. **Team growth** — Trend of `team_member_invited` events, broken down by role
5. **Account engagement** — Trend of `account_updated` and `password_updated` events

You can create these at: https://us.posthog.com/project/2/insights/new

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
