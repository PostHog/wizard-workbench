<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your Next.js 15 App Router SaaS starter. Here is a summary of all changes made:

**Client-side initialization** — `instrumentation-client.ts` was created at the project root to initialize `posthog-js` using Next.js 15.3+'s instrumentation hook. PostHog is configured with a reverse proxy (`/ingest`), automatic exception capture, and the `2026-01-30` defaults.

**Reverse proxy** — `next.config.ts` was updated with three rewrites (`/ingest/static/*`, `/ingest/array/*`, `/ingest/*`) to route PostHog traffic through Next.js, reducing ad-blocker interference.

**Environment variables** — `.env.local` was created with `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`. The file is covered by `.gitignore`.

**Server-side client** — `lib/posthog-server.ts` was created as a singleton `posthog-node` client with `flushAt: 1` and `flushInterval: 0` to ensure immediate event flushing from server actions and API routes.

**User identification** — `app/(dashboard)/layout.tsx` calls `posthog.identify()` with the user's database ID and email whenever user data loads. `posthog.reset()` is called on sign-out. The sign-in and sign-up server actions use `posthog.alias()` to link the browser's anonymous session ID to the authenticated user's numeric ID, passed via a hidden form input.

**Server-side events** — `app/(login)/actions.ts` captures `user_signed_in`, `user_signed_up`, `user_signed_out`, `account_updated`, `password_updated`, `account_deleted`, `team_member_invited`, and `team_member_removed` events in the relevant server actions.

**Payment events** — `lib/payments/stripe.ts` captures `checkout_started` (when a Stripe session is created) and `subscription_updated`/`subscription_canceled` (in the webhook handler). `app/api/stripe/checkout/route.ts` captures `checkout_completed` after a successful subscription activation.

## Events

| Event Name | Description | File |
|---|---|---|
| `user_signed_up` | A new user successfully completed registration | `app/(login)/actions.ts` |
| `user_signed_in` | An existing user successfully authenticated | `app/(login)/actions.ts` |
| `user_signed_out` | A user explicitly signed out | `app/(login)/actions.ts` |
| `account_updated` | A user updated their account name or email | `app/(login)/actions.ts` |
| `password_updated` | A user successfully changed their password | `app/(login)/actions.ts` |
| `account_deleted` | A user deleted their account (soft delete) | `app/(login)/actions.ts` |
| `team_member_invited` | A team owner sent an invitation to a new member | `app/(login)/actions.ts` |
| `team_member_removed` | A team member was removed from the team | `app/(login)/actions.ts` |
| `checkout_started` | A user initiated a Stripe checkout session | `lib/payments/stripe.ts` |
| `checkout_completed` | A user successfully completed checkout | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | A subscription became active or trialing (webhook) | `lib/payments/stripe.ts` |
| `subscription_canceled` | A subscription was canceled or became unpaid (webhook) | `lib/payments/stripe.ts` |

## Next steps

We recommend building an **"Analytics basics"** dashboard in PostHog to monitor the key business metrics from these events. Here are five insights to create:

1. **[Sign-ups over time](https://us.posthog.com/project/2/insights/new?insight=TRENDS)** — Trends insight for `user_signed_up`, grouped by day. Shows growth rate of new registrations.

2. **[Payment conversion funnel](https://us.posthog.com/project/2/insights/new?insight=FUNNELS)** — Funnel insight with steps: `checkout_started` → `checkout_completed`. Reveals drop-off between intent and payment.

3. **[Subscription cancellations](https://us.posthog.com/project/2/insights/new?insight=TRENDS)** — Trends insight for `subscription_canceled`, grouped by week. Early warning signal for churn.

4. **[Team growth](https://us.posthog.com/project/2/insights/new?insight=TRENDS)** — Trends insight for `team_member_invited`, grouped by week. Indicates virality and workspace expansion.

5. **[Daily active users](https://us.posthog.com/project/2/insights/new?insight=TRENDS)** — Trends insight for `user_signed_in`, grouped by day, showing unique users. Core engagement metric.

Navigate to your [PostHog dashboards](https://us.posthog.com/project/2/dashboards) to create a new dashboard and add these insights.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
