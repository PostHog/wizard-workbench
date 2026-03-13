<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your Next.js 15 App Router SaaS project with PostHog. Here is a summary of all changes made:

**New files created:**
- `instrumentation-client.ts` — Client-side PostHog initialization using the Next.js 15.3+ instrumentation pattern. Enables session replay, autocapture, and error tracking automatically.
- `lib/posthog-server.ts` — Singleton PostHog Node.js client for server-side event capture.

**Modified files:**
- `next.config.ts` — Added reverse proxy rewrites for PostHog ingestion (`/ingest/*`) to improve ad-blocker resistance and data accuracy.
- `app/(login)/actions.ts` — Added server-side PostHog events for all auth and account actions: sign-in (with `identify`), sign-up (with `identify`), sign-out, password update, account deletion, account update, team member invite, and team member removal.
- `app/api/stripe/checkout/route.ts` — Added `checkout_completed` event on successful Stripe checkout.
- `app/api/stripe/webhook/route.ts` — Added `subscription_updated` and `subscription_cancelled` events on Stripe webhook delivery.
- `app/(dashboard)/dashboard/page.tsx` — Added `manage_subscription_clicked` client-side event on the Manage Subscription button.
- `app/(dashboard)/layout.tsx` — Added client-side `posthog.identify()` when user loads in the nav, and `posthog.reset()` on sign-out.

**Environment variables set in `.env.local`:**
- `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`
- `NEXT_PUBLIC_POSTHOG_HOST`

## Events tracked

| Event | Description | File |
|-------|-------------|------|
| `user_signed_in` | User successfully signed into their account | `app/(login)/actions.ts` |
| `user_signed_up` | New user completed registration | `app/(login)/actions.ts` |
| `user_signed_out` | User signed out of their account | `app/(login)/actions.ts` |
| `password_updated` | User successfully updated their password | `app/(login)/actions.ts` |
| `account_deleted` | User deleted their account (churn event) | `app/(login)/actions.ts` |
| `team_member_invited` | Team owner sent an invitation to a new team member | `app/(login)/actions.ts` |
| `team_member_removed` | Team owner removed a member from the team | `app/(login)/actions.ts` |
| `account_updated` | User updated their account information (name or email) | `app/(login)/actions.ts` |
| `checkout_completed` | User completed Stripe checkout and subscription was created | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | A team subscription was updated via Stripe webhook | `app/api/stripe/webhook/route.ts` |
| `subscription_cancelled` | A team subscription was cancelled via Stripe webhook (churn event) | `app/api/stripe/webhook/route.ts` |
| `manage_subscription_clicked` | User clicked to manage their subscription via customer portal | `app/(dashboard)/dashboard/page.tsx` |

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog with the following insights to monitor user behavior:

1. **Sign-ups over time** — Trend of `user_signed_up` to monitor growth
2. **Signup to Checkout Conversion** — Funnel: `user_signed_up` → `checkout_completed` to measure conversion rate
3. **Account Deletions (Churn)** — Trend of `account_deleted` to monitor churn signals
4. **Subscription Cancellations** — Trend of `subscription_cancelled` to monitor revenue churn
5. **Team Growth - Invitations Sent** — Trend of `team_member_invited` as a growth/engagement signal

Visit your PostHog project at [https://us.posthog.com/project/2](https://us.posthog.com/project/2) to create these insights.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
