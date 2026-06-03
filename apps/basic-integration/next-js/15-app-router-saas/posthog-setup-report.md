<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 SaaS starter. The integration includes client-side initialization via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+), a reverse proxy through Next.js rewrites to avoid ad blockers, a singleton server-side PostHog client for Node.js API routes and server actions, user identification on sign-in and sign-up, and 12 event captures covering the full user lifecycle from authentication through subscription management and churn.

| Event | Description | File |
|-------|-------------|------|
| `user_signed_in` | User successfully authenticated with email and password | `app/(login)/actions.ts` |
| `user_signed_up` | New user created an account; includes whether they joined via invitation | `app/(login)/actions.ts` |
| `user_signed_out` | User ended their session | `app/(login)/actions.ts` |
| `checkout_initiated` | User clicked Get Started on a pricing plan to begin checkout | `app/(dashboard)/pricing/submit-button.tsx` |
| `checkout_completed` | Stripe checkout session completed successfully; subscription activated | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Stripe webhook: subscription status changed (e.g. trial to active, plan upgrade/downgrade) | `app/api/stripe/webhook/route.ts` |
| `subscription_canceled` | Stripe webhook: subscription was canceled or became unpaid | `app/api/stripe/webhook/route.ts` |
| `team_member_invited` | Team owner sent an invitation to a new member | `app/(login)/actions.ts` |
| `team_member_removed` | Team owner removed a member from the team | `app/(login)/actions.ts` |
| `account_updated` | User updated their name or email in general settings | `app/(login)/actions.ts` |
| `password_updated` | User successfully changed their password | `app/(login)/actions.ts` |
| `account_deleted` | User deleted their account (soft delete) | `app/(login)/actions.ts` |

## Next steps

We've designed the following insights for an **"Analytics basics"** dashboard. Visit PostHog to create them:

- **[Signup → Checkout conversion funnel](https://us.posthog.com/project/2/insights/new)** — Funnel: `user_signed_up` → `checkout_initiated` → `checkout_completed`. Tracks the conversion rate from new account to paid subscriber.
- **[Daily signups trend](https://us.posthog.com/project/2/insights/new)** — Trends: `user_signed_up` over time. Shows user acquisition rate.
- **[Subscription churn events](https://us.posthog.com/project/2/insights/new)** — Trends: `subscription_canceled` over time. Monitors churn signals.
- **[Team growth](https://us.posthog.com/project/2/insights/new)** — Trends: `team_member_invited` over time. Indicates product-led growth via team expansion.
- **[Account deletions](https://us.posthog.com/project/2/insights/new)** — Trends: `account_deleted` over time. Hard churn signal to watch alongside subscription cancellations.

Once insights are saved, [create the dashboard](https://us.posthog.com/project/2/dashboard) and add them there.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
