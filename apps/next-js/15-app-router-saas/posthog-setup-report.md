<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router SaaS project. Here is a summary of all changes made:

- **`instrumentation-client.ts`** (new): Client-side PostHog initialization using the Next.js 15.3+ `instrumentation-client.ts` pattern. Initializes `posthog-js` with the reverse proxy host, error tracking (`capture_exceptions`), and debug mode in development.
- **`lib/posthog-server.ts`** (new): Singleton server-side PostHog client using `posthog-node`, used by all server actions and API routes.
- **`next.config.ts`** (edited): Added PostHog reverse proxy rewrites (`/ingest/*` → PostHog ingestion endpoints) and `skipTrailingSlashRedirect: true`.
- **`.env.local`** (edited): Set `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables.
- **`app/(login)/actions.ts`** (edited): Added server-side PostHog events for all authentication and team management server actions, plus `posthog.identify()` calls on sign-in, sign-up, and account update.
- **`lib/payments/actions.ts`** (edited): Added `checkout_initiated` event when a user begins the Stripe checkout flow.
- **`app/api/stripe/checkout/route.ts`** (edited): Added `checkout_completed` event after a successful Stripe Checkout session, with plan and subscription details.
- **`app/api/stripe/webhook/route.ts`** (edited): Added `subscription_updated` and `subscription_cancelled` events for Stripe webhook handlers.
- **`app/(dashboard)/layout.tsx`** (edited): Added client-side `posthog.identify()` via `useEffect` in the `UserMenu` component (runs whenever user data loads from SWR) and `posthog.reset()` on sign-out to unlink device from user.

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user_signed_up` | Fired when a new user successfully creates an account, with or without an invitation | `app/(login)/actions.ts` |
| `user_signed_in` | Fired when a user successfully signs in with email and password | `app/(login)/actions.ts` |
| `user_signed_out` | Fired when a user signs out | `app/(login)/actions.ts` |
| `password_updated` | Fired when a user successfully changes their account password | `app/(login)/actions.ts` |
| `account_updated` | Fired when a user updates their name or email in account settings | `app/(login)/actions.ts` |
| `account_deleted` | Fired when a user confirms and soft-deletes their account | `app/(login)/actions.ts` |
| `team_member_invited` | Fired when a team owner sends an invitation to a new team member | `app/(login)/actions.ts` |
| `team_member_removed` | Fired when a team member is removed from the team | `app/(login)/actions.ts` |
| `checkout_initiated` | Fired when a user clicks to subscribe to a plan and is redirected to Stripe Checkout | `lib/payments/actions.ts` |
| `checkout_completed` | Fired when a user returns from a successful Stripe Checkout session | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Fired via Stripe webhook when a subscription changes | `app/api/stripe/webhook/route.ts` |
| `subscription_cancelled` | Fired via Stripe webhook when a subscription is deleted/cancelled | `app/api/stripe/webhook/route.ts` |

## Next steps

To monitor user behavior, create an **"Analytics basics"** dashboard in PostHog with the following recommended insights:

1. **Signup-to-Paid Conversion Funnel** — Funnel from `user_signed_up` → `checkout_initiated` → `checkout_completed`
2. **New Signups Over Time** — Trend of `user_signed_up` events (daily/weekly)
3. **Daily Active Sign-ins** — Trend of `user_signed_in` events
4. **Churn Events** — Combined trend of `subscription_cancelled` and `account_deleted`
5. **Team Growth** — Trend of `team_member_invited` events

To create this dashboard, go to your [PostHog project](https://us.posthog.com/project/238460/dashboards) and click **New dashboard**, then add the insights above using the event names listed.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
