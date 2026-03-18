<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router SaaS project. The integration covers client-side initialization, server-side event tracking, user identification, and error capture.

**Changes made:**

- `instrumentation-client.ts` *(new)* — Client-side PostHog initialization using the Next.js 15.3+ `instrumentation-client.ts` approach. Includes error tracking via `capture_exceptions: true` and routes requests through a reverse proxy (`/ingest`).
- `next.config.ts` — Added PostHog reverse proxy rewrites (`/ingest/static/*` and `/ingest/*`) and `skipTrailingSlashRedirect: true` to support PostHog API requests.
- `lib/posthog-server.ts` *(new)* — Server-side PostHog client singleton using `posthog-node`, configured with `flushAt: 1` and `flushInterval: 0` for reliable event delivery in serverless environments.
- `app/(login)/actions.ts` — Added server-side `posthog.identify()` calls on sign-in and sign-up to associate user IDs with events. Added `posthog.capture()` calls for all auth and account management actions.
- `app/api/stripe/checkout/route.ts` — Added `checkout_completed` server-side event with plan name, subscription ID, and customer ID properties.
- `app/api/stripe/webhook/route.ts` — Added `subscription_updated` and `subscription_cancelled` server-side events triggered by Stripe webhooks.

**Environment variables set** in `.env.local`:
- `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`
- `NEXT_PUBLIC_POSTHOG_HOST`

| Event | Description | File |
|-------|-------------|------|
| `user_signed_in` | User successfully signed in | `app/(login)/actions.ts` |
| `user_signed_up` | User created a new account | `app/(login)/actions.ts` |
| `user_signed_out` | User signed out | `app/(login)/actions.ts` |
| `checkout_completed` | Stripe checkout completed, subscription activated | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Stripe subscription was updated | `app/api/stripe/webhook/route.ts` |
| `subscription_cancelled` | Stripe subscription was cancelled | `app/api/stripe/webhook/route.ts` |
| `password_updated` | User updated their password | `app/(login)/actions.ts` |
| `account_deleted` | User deleted their account (churn) | `app/(login)/actions.ts` |
| `team_member_invited` | User invited a team member | `app/(login)/actions.ts` |
| `team_member_removed` | User removed a team member | `app/(login)/actions.ts` |

## Next steps

Here are recommended insights to create in PostHog to monitor user behavior. Click each link to open a pre-configured insight:

- [Sign-up to Checkout Conversion Funnel](https://us.posthog.com/project/2/insights/new#{"insight":"FUNNELS","events":[{"id":"user_signed_up","name":"user_signed_up","type":"events","order":0},{"id":"checkout_completed","name":"checkout_completed","type":"events","order":1}],"funnel_window_interval":14,"funnel_window_interval_unit":"day"}) — Track what % of sign-ups convert to paid subscribers
- [New Sign-ups Over Time](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"user_signed_up","name":"user_signed_up","type":"events"}],"interval":"day"}) — Daily trend of new user registrations
- [Checkout Completions Over Time](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"checkout_completed","name":"checkout_completed","type":"events"}],"interval":"day"}) — Daily trend of new paid subscriptions
- [Account Deletions (Churn)](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"account_deleted","name":"account_deleted","type":"events"},{"id":"subscription_cancelled","name":"subscription_cancelled","type":"events"}],"interval":"week"}) — Weekly churn signals: account deletions and subscription cancellations
- [Team Collaboration Activity](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"team_member_invited","name":"team_member_invited","type":"events"},{"id":"team_member_removed","name":"team_member_removed","type":"events"}],"interval":"week"}) — Track team growth and churn signals

To create a dashboard: go to [PostHog Dashboards](https://us.posthog.com/project/2/dashboards), click **New dashboard**, name it "Analytics basics", and add the insights above.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
