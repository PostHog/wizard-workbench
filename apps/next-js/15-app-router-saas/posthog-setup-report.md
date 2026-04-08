<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 SaaS app. The integration covers both client-side analytics (via `posthog-js` and `instrumentation-client.ts`) and server-side event capture (via `posthog-node`). A reverse proxy through Next.js rewrites is configured to improve ad-blocker resilience. Users are identified by email on the client side after login and on the server side during sign-up. Events are tracked across the full user lifecycle — from registration and authentication, through subscription management, to account deletion.

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signs in | `app/(login)/actions.ts` |
| `user_signed_up` | New user creates an account (includes `posthog.identify`) | `app/(login)/actions.ts` |
| `user_signed_out` | User signs out from dashboard (client-side, with `posthog.reset()`) | `app/(dashboard)/layout.tsx` |
| `checkout_started` | User initiates a Stripe checkout session | `lib/payments/actions.ts` |
| `checkout_completed` | User completes Stripe checkout and returns | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Stripe subscription updated via webhook | `app/api/stripe/webhook/route.ts` |
| `subscription_cancelled` | Stripe subscription deleted/cancelled via webhook | `app/api/stripe/webhook/route.ts` |
| `team_member_invited` | Team member invitation sent | `app/(login)/actions.ts` |
| `team_member_removed` | Team member removed from team | `app/(login)/actions.ts` |
| `account_updated` | User updates their name/email | `app/(login)/actions.ts` |
| `password_updated` | User successfully changes their password | `app/(login)/actions.ts` |
| `account_deleted` | User deletes their account | `app/(login)/actions.ts` |

## Next steps

We recommend building an **"Analytics basics"** dashboard in PostHog with the following five insights. You can create each one at https://us.posthog.com/project/2/insights/new:

1. **Signup to Checkout Funnel** — Funnel insight with steps: `user_signed_up` → `checkout_started` → `checkout_completed`. Tracks conversion from new user to paying customer.

2. **New Sign-ups Over Time** — Trends insight counting unique `user_signed_up` events over the last 30 days. Your core acquisition metric.

3. **Daily Active Users** — Trends insight counting unique persons triggering `user_signed_in` over the last 30 days.

4. **Subscription Cancellations** — Trends insight counting `subscription_cancelled` events over time. Churn signal.

5. **Account Deletions** — Trends insight counting `account_deleted` events. Hard churn metric.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
