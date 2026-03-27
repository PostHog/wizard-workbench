<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your Next.js 15 App Router SaaS application. PostHog is now initialized client-side via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+) with a reverse proxy configured in `next.config.ts` to improve tracking reliability. A server-side PostHog client (`lib/posthog-server.ts`) is used to capture critical business events from Server Actions and API routes. Users are identified client-side in the dashboard layout using their email as the distinct ID, and server-side identify calls are made on sign-in and sign-up.

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | Fired when a new user successfully creates an account | `app/(login)/actions.ts` |
| `user_signed_in` | Fired when an existing user successfully signs in | `app/(login)/actions.ts` |
| `user_signed_out` | Fired when a user signs out | `app/(login)/actions.ts` |
| `checkout_initiated` | Fired when a user starts a Stripe checkout session | `lib/payments/actions.ts` |
| `checkout_completed` | Fired when a Stripe checkout session completes successfully | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Fired when a Stripe subscription is updated via webhook | `app/api/stripe/webhook/route.ts` |
| `subscription_cancelled` | Fired when a Stripe subscription is cancelled via webhook | `app/api/stripe/webhook/route.ts` |
| `account_deleted` | Fired when a user deletes their account | `app/(login)/actions.ts` |
| `team_member_invited` | Fired when a team owner invites a new member | `app/(login)/actions.ts` |
| `team_member_removed` | Fired when a team member is removed from a team | `app/(login)/actions.ts` |
| `password_updated` | Fired when a user successfully updates their password | `app/(login)/actions.ts` |
| `account_updated` | Fired when a user updates their account name or email | `app/(login)/actions.ts` |

## Next steps

To visualize these events, create an **"Analytics basics"** dashboard in PostHog with the following insights:

1. **Signup → Checkout Conversion Funnel** — Funnel: `user_signed_up` → `checkout_initiated` → `checkout_completed`
2. **Daily New Signups** — Trend: `user_signed_up` over time
3. **Daily Active Users (Sign-ins)** — Trend: `user_signed_in` over time, unique users
4. **Subscription Churn** — Trend: `subscription_cancelled` over time
5. **Account Deletions** — Trend: `account_deleted` over time

Visit [PostHog Project 238460](https://us.posthog.com/project/238460) to create these insights.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
