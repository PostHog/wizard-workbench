# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router SaaS starter. The integration covers client-side initialization via `instrumentation-client.ts`, a reverse proxy through Next.js rewrites, a shared server-side PostHog client, user identification on both client and server, and event capture across all critical business flows including authentication, Stripe checkout, subscription lifecycle, and team management.

| Event | Description | File |
|-------|-------------|------|
| `user_signed_in` | User successfully signed in with email and password | `app/(login)/actions.ts` |
| `user_signed_up` | New user successfully created an account | `app/(login)/actions.ts` |
| `user_signed_out` | User signed out from the application | `app/(dashboard)/layout.tsx` |
| `pricing_plan_selected` | User initiated checkout for a pricing plan | `lib/payments/actions.ts` |
| `checkout_completed` | Stripe checkout session completed and subscription activated | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Subscription status changed via Stripe webhook | `app/api/stripe/webhook/route.ts` |
| `password_updated` | User successfully updated their password | `app/(login)/actions.ts` |
| `account_deleted` | User deleted their account | `app/(login)/actions.ts` |
| `account_updated` | User updated their account name or email | `app/(login)/actions.ts` |
| `team_member_invited` | Team owner sent an invitation to a new team member | `app/(login)/actions.ts` |
| `team_member_removed` | Team member was removed from the team | `app/(login)/actions.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](/dashboard/1346453)

Recommended insights to build in PostHog:
1. **Signup trend** — Trends: `user_signed_up` over time, broken down by `via_invitation`
2. **Conversion funnel** — Funnel: `user_signed_up` → `pricing_plan_selected` → `checkout_completed`
3. **Checkout completions** — Trends: `checkout_completed` over time, broken down by `plan_name`
4. **Subscription changes** — Trends: `subscription_updated` over time, broken down by `subscription_status`
5. **Account churn** — Trends: `account_deleted` over time

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
