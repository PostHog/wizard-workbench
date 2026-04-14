<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router SaaS application. The integration covers both client-side and server-side tracking, user identification, and a reverse proxy for improved reliability.

## What was set up

- **`instrumentation-client.ts`** — Client-side PostHog initialization via Next.js 15.3+ instrumentation, with `/ingest` reverse proxy, exception capture, and debug mode in development.
- **`next.config.ts`** — Added `/ingest` and `/ingest/static` rewrites to proxy PostHog requests and avoid ad blockers. `skipTrailingSlashRedirect: true` added as required.
- **`lib/posthog-server.ts`** — Server-side PostHog Node client helper (`getPostHogClient()`), used by all server actions and API routes.
- **`.env.local`** — `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables added.
- **`app/(dashboard)/layout.tsx`** — Client-side `posthog.identify()` called when user data loads (via SWR), linking browser sessions to known users. `posthog.reset()` called on sign-out to unlink sessions.
- **`app/(login)/actions.ts`** — Server-side events and `posthog.identify()` added to auth and team management Server Actions.
- **`app/api/stripe/checkout/route.ts`** — Server-side `checkout_completed` event after successful Stripe checkout.
- **`app/api/stripe/webhook/route.ts`** — Server-side `subscription_updated` and `subscription_cancelled` events from Stripe webhooks.

## Events tracked

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | Fired when a new user successfully creates an account | `app/(login)/actions.ts` |
| `user_signed_in` | Fired when a user successfully signs in | `app/(login)/actions.ts` |
| `user_signed_out` | Fired when a user signs out | `app/(login)/actions.ts` |
| `checkout_completed` | Fired when a user completes the Stripe checkout flow and subscription is activated | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Fired when a Stripe subscription is updated (plan change, renewal, etc.) | `app/api/stripe/webhook/route.ts` |
| `subscription_cancelled` | Fired when a Stripe subscription is deleted/cancelled | `app/api/stripe/webhook/route.ts` |
| `password_updated` | Fired when a user successfully updates their password | `app/(login)/actions.ts` |
| `account_deleted` | Fired when a user deletes their account (churn event) | `app/(login)/actions.ts` |
| `team_member_invited` | Fired when a team owner sends an invitation to a new team member | `app/(login)/actions.ts` |
| `team_member_removed` | Fired when a team member is removed from the team | `app/(login)/actions.ts` |

## Next steps

To set up dashboards and insights, visit your PostHog project and create an **"Analytics basics"** dashboard with the following recommended insights:

1. **Signup-to-Checkout Conversion Funnel** — Funnel insight: `user_signed_up` → `checkout_completed`
2. **New Signups Over Time** — Trend insight: `user_signed_up` (daily/weekly)
3. **Subscription Cancellations** — Trend insight: `subscription_cancelled` (churn monitoring)
4. **Account Deletions** — Trend insight: `account_deleted` (hard churn)
5. **Team Collaboration Activity** — Trend insight: `team_member_invited` and `team_member_removed`

Visit your PostHog project at: https://us.posthog.com/project/2/dashboard

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
