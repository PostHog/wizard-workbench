<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router SaaS project. Here's a summary of all changes made:

- **`instrumentation-client.ts`** (new) — Initializes PostHog client-side using the Next.js 15.3+ instrumentation pattern. Configures the reverse proxy (`/ingest`), error tracking (`capture_exceptions`), and debug mode in development.
- **`next.config.ts`** — Added PostHog reverse proxy rewrites for `/ingest`, `/ingest/static`, and `/ingest/array` paths, plus `skipTrailingSlashRedirect: true`.
- **`lib/posthog-server.ts`** (new) — Singleton PostHog Node.js client for server-side event capture, shared across API routes and Server Actions.
- **`app/(login)/actions.ts`** — Added server-side PostHog capture for all authentication and account management actions. User identification (`posthog.identify`) is called on sign-in and sign-up to link server-side events to person profiles.
- **`lib/payments/actions.ts`** — Added `checkout_initiated` capture when a user starts the Stripe checkout flow.
- **`app/api/stripe/checkout/route.ts`** — Added `subscription_checkout_completed` capture after a successful Stripe checkout, plus `captureException` in the error handler.
- **`app/api/stripe/webhook/route.ts`** — Added `subscription_updated` and `subscription_canceled` captures for Stripe webhook events.
- **`app/(dashboard)/layout.tsx`** — Added client-side `posthog.identify` via `useEffect` when user data loads from SWR, and `posthog.reset()` on sign-out to unlink the session.
- **`.env.local`** — Set `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables.

| Event | Description | File |
|---|---|---|
| `user_signed_up` | A new user successfully created an account | `app/(login)/actions.ts` |
| `user_signed_in` | A user successfully signed in to their account | `app/(login)/actions.ts` |
| `user_signed_out` | A user signed out of their account | `app/(login)/actions.ts` |
| `password_updated` | A user successfully updated their account password | `app/(login)/actions.ts` |
| `account_updated` | A user updated their account name or email | `app/(login)/actions.ts` |
| `account_deleted` | A user permanently deleted their account | `app/(login)/actions.ts` |
| `team_member_invited` | A team owner invited a new member to join the team | `app/(login)/actions.ts` |
| `team_member_removed` | A team member was removed from the team | `app/(login)/actions.ts` |
| `checkout_initiated` | A user initiated a Stripe checkout session | `lib/payments/actions.ts` |
| `subscription_checkout_completed` | A Stripe checkout completed and subscription was activated | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | A team subscription was updated via Stripe webhook | `app/api/stripe/webhook/route.ts` |
| `subscription_canceled` | A team subscription was canceled via Stripe webhook | `app/api/stripe/webhook/route.ts` |

## Next steps

Use these links to explore your new events and build dashboards in PostHog:

- [PostHog Dashboards](https://us.posthog.com/project/2/dashboard) — Create a new dashboard and add insights for the events above
- [New Insight](https://us.posthog.com/project/2/insights/new) — Build trend charts, funnels, and retention analyses

**Suggested insights to create:**

1. **Signup → Checkout funnel** — `user_signed_up` → `checkout_initiated` → `subscription_checkout_completed`
2. **Daily active sign-ins** — Trend of `user_signed_in` over time
3. **Churn signals** — Trend of `account_deleted` and `subscription_canceled` over time
4. **Team growth** — Trend of `team_member_invited` over time
5. **Conversion rate** — `checkout_initiated` → `subscription_checkout_completed` funnel

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
