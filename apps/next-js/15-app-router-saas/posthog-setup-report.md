<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router SaaS project. Here is a summary of all changes made:

- **`instrumentation-client.ts`** (new): Initialises `posthog-js` on the client using the `instrumentation-client` pattern for Next.js 15.3+. Includes session replay, exception capture, and a reverse-proxy host. No `PostHogProvider` component is needed.
- **`next.config.ts`** (updated): Added `/ingest` rewrites so PostHog requests are proxied through the Next.js server (avoids ad-blocker interference), and set `skipTrailingSlashRedirect: true`.
- **`lib/posthog-server.ts`** (new): Singleton `posthog-node` client used across all server-side code (Server Actions and API routes) for consistent server-side tracking.
- **`app/(login)/actions.ts`** (updated): Added server-side event capture for all authentication and team management actions, plus `identify()` calls on sign-in and sign-up.
- **`app/api/stripe/checkout/route.ts`** (updated): Captures `checkout_completed` when a Stripe checkout succeeds and the subscription is provisioned.
- **`app/api/stripe/webhook/route.ts`** (updated): Captures `subscription_updated` and `subscription_canceled` from Stripe webhook events.

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user_signed_up` | Fired when a new user successfully completes registration | `app/(login)/actions.ts` |
| `user_signed_in` | Fired when an existing user successfully signs in | `app/(login)/actions.ts` |
| `user_signed_out` | Fired when a user signs out | `app/(login)/actions.ts` |
| `checkout_completed` | Fired when a Stripe checkout session succeeds and subscription is provisioned | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Fired when a Stripe subscription status changes to active or trialing | `app/api/stripe/webhook/route.ts` |
| `subscription_canceled` | Fired when a Stripe subscription is canceled or becomes unpaid | `app/api/stripe/webhook/route.ts` |
| `team_member_invited` | Fired when a team owner invites a new member | `app/(login)/actions.ts` |
| `team_member_removed` | Fired when a team member is removed | `app/(login)/actions.ts` |
| `account_updated` | Fired when a user updates their account name or email | `app/(login)/actions.ts` |
| `password_updated` | Fired when a user successfully changes their password | `app/(login)/actions.ts` |
| `account_deleted` | Fired when a user deletes their account | `app/(login)/actions.ts` |

## Next steps

We recommend building an **"Analytics basics"** dashboard in PostHog with these five insights to monitor key business metrics:

1. **Sign-up to checkout conversion funnel** — Funnel: `user_signed_up` → `checkout_completed`. Shows how many new users convert to paid.
2. **New sign-ups over time** — Trends: `user_signed_up` count per day/week. Core growth metric.
3. **Subscription cancellations** — Trends: `subscription_canceled` count per week. Churn signal.
4. **Team invites sent** — Trends: `team_member_invited` count per week. Indicates product engagement and virality.
5. **Account deletions** — Trends: `account_deleted` count per week. Another churn signal to watch closely.

You can create these directly in PostHog at **https://us.posthog.com/project/2/insights/new**.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
