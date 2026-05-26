<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your Next.js 15 SaaS starter. Here's what was set up:

- **`instrumentation-client.ts`** — Client-side PostHog initialization via the Next.js 15.3+ `instrumentation-client` file, using a reverse proxy at `/ingest` to improve ad-blocker resistance. Includes automatic session replay and error tracking (`capture_exceptions: true`).
- **`lib/posthog-server.ts`** — A singleton server-side PostHog client (posthog-node) used by Server Actions and API routes for reliable server-side event capture.
- **`next.config.ts`** — Reverse proxy rewrites added: `/ingest/static/*`, `/ingest/array/*`, and `/ingest/*` all route through to PostHog's ingestion endpoint.
- **`app/(login)/actions.ts`** — 7 events added across all auth and account management server actions, plus `posthog.identify()` at sign-in, sign-up, and account update.
- **`lib/payments/actions.ts`** — `checkout_started` event added when a user initiates Stripe checkout.
- **`app/api/stripe/checkout/route.ts`** — `subscription_checkout_completed` event added after a successful Stripe checkout session.
- **`app/api/stripe/webhook/route.ts`** — `subscription_updated` and `subscription_canceled` events added in the Stripe webhook handler.
- **`app/(dashboard)/layout.tsx`** — Client-side `posthog.identify()` added when user data loads, and `posthog.reset()` called on sign-out to properly unlink the session.

| Event | Description | File |
|-------|-------------|------|
| `user_signed_in` | User successfully authenticated with email and password | `app/(login)/actions.ts` |
| `user_signed_up` | New user account created, with or without an invitation | `app/(login)/actions.ts` |
| `user_signed_out` | User explicitly signed out of their session | `app/(login)/actions.ts` |
| `password_updated` | User successfully changed their account password | `app/(login)/actions.ts` |
| `account_deleted` | User permanently deleted their account (soft delete) | `app/(login)/actions.ts` |
| `account_updated` | User updated their account name or email address | `app/(login)/actions.ts` |
| `team_member_invited` | Team owner sent an invitation to a new team member | `app/(login)/actions.ts` |
| `team_member_removed` | Team owner removed a member from the team | `app/(login)/actions.ts` |
| `checkout_started` | User initiated a Stripe checkout session for a subscription plan | `lib/payments/actions.ts` |
| `subscription_checkout_completed` | Stripe checkout succeeded and subscription was activated | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Stripe webhook: subscription status changed | `app/api/stripe/webhook/route.ts` |
| `subscription_canceled` | Stripe webhook: subscription was canceled or became unpaid | `app/api/stripe/webhook/route.ts` |

## Next steps

To monitor user behavior with these events, create an **"Analytics basics"** dashboard in PostHog with these insights:

1. **[Signup & Signin Trends](https://us.posthog.com/project/2/insights)** — Trends chart with `user_signed_up` and `user_signed_in` over time. Shows growth and engagement.
2. **[Checkout Conversion Funnel](https://us.posthog.com/project/2/insights)** — Funnel: `checkout_started` → `subscription_checkout_completed`. Measures payment drop-off.
3. **[Subscription Events Trend](https://us.posthog.com/project/2/insights)** — Trends: `subscription_checkout_completed`, `subscription_updated`, `subscription_canceled`. Revenue health at a glance.
4. **[Churn Signal](https://us.posthog.com/project/2/insights)** — Trends: `account_deleted` and `subscription_canceled`. Early warning for churn.
5. **[Team Activity](https://us.posthog.com/project/2/insights)** — Trends: `team_member_invited` and `team_member_removed`. Tracks team growth and engagement.

Visit [/dashboards](https://us.posthog.com/project/2/dashboards) to create the "Analytics basics" dashboard and add these insights.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
