<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router SaaS starter. Here is a summary of all changes made:

## What was set up

- **`instrumentation-client.ts`** (new) — Initializes `posthog-js` client-side using the Next.js 15.3+ `instrumentation-client` pattern. Includes a reverse proxy (`/ingest`), automatic exception/error capture, and debug mode in development.
- **`next.config.ts`** (edited) — Added reverse proxy rewrites so PostHog requests route through `/ingest` to avoid ad-blockers, plus `skipTrailingSlashRedirect: true`.
- **`lib/posthog-server.ts`** (new) — Server-side PostHog client factory (`getPostHogClient()`) using `posthog-node`, configured for short-lived Next.js server functions with `flushAt: 1` and `flushInterval: 0`.
- **`app/(login)/actions.ts`** (edited) — Server-side PostHog events and `identify()` calls for all authentication and account management actions.
- **`app/(login)/login.tsx`** (edited) — Client-side `posthog.identify()` call on form submit, linking the browser session to the user's email before the server action runs.
- **`lib/payments/actions.ts`** (edited) — Server-side event when a user initiates checkout.
- **`app/api/stripe/checkout/route.ts`** (edited) — Server-side event when a Stripe checkout session is successfully completed and a subscription is created.
- **`app/api/stripe/webhook/route.ts`** (edited) — Server-side events for Stripe subscription updates and cancellations received via webhook.
- **`app/(dashboard)/pricing/page.tsx`** (edited) — Server-side event when the pricing page is rendered (top of the conversion funnel), with the authenticated user's identity when available.
- **`.env.local`** (created) — `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables set (and added to `.gitignore`).

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `user_signed_in` | User successfully signed in with email and password | `app/(login)/actions.ts` |
| `user_signed_up` | New user successfully created an account | `app/(login)/actions.ts` |
| `user_signed_out` | User signed out of their account | `app/(login)/actions.ts` |
| `password_updated` | User successfully updated their password | `app/(login)/actions.ts` |
| `account_deleted` | User deleted their account | `app/(login)/actions.ts` |
| `account_updated` | User updated their account name or email | `app/(login)/actions.ts` |
| `team_member_invited` | Team owner invited a new member to the team | `app/(login)/actions.ts` |
| `team_member_removed` | Team owner removed a member from the team | `app/(login)/actions.ts` |
| `checkout_initiated` | User clicked to start a checkout/subscription flow | `lib/payments/actions.ts` |
| `subscription_checkout_completed` | User completed a Stripe checkout and subscription was created | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Stripe webhook: customer subscription was updated | `app/api/stripe/webhook/route.ts` |
| `subscription_deleted` | Stripe webhook: customer subscription was cancelled/deleted | `app/api/stripe/webhook/route.ts` |
| `pricing_page_viewed` | User viewed the pricing page (top of conversion funnel) | `app/(dashboard)/pricing/page.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- 📊 **[Analytics basics dashboard](https://us.posthog.com/project/2/dashboard/1296055)** — Overview of all key business metrics

- 📈 **[Sign-ups & Sign-ins (Daily)](https://us.posthog.com/project/2/insights/eFh5TiwJ)** — Daily trend of new user sign-ups and sign-ins
- 🔽 **[Sign-up to Subscription Conversion Funnel](https://us.posthog.com/project/2/insights/k7GA0RQW)** — Funnel from sign-up → checkout → subscription
- ❌ **[Subscription Cancellations (Weekly)](https://us.posthog.com/project/2/insights/tGqOWdE7)** — Weekly subscription churn signal
- 🗑️ **[Account Deletions (Weekly)](https://us.posthog.com/project/2/insights/ArSQQBSu)** — Weekly hard-churn signal
- 👥 **[Team Collaboration Activity](https://us.posthog.com/project/2/insights/bg7wPBOc)** — Team invitations vs. removals trend

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
