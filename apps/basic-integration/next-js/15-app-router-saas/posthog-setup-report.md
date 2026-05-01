<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router SaaS application. Here's what was set up:

- **Client-side initialization** via `instrumentation-client.ts` (Next.js 15.3+ native hook), with error tracking (`capture_exceptions: true`) and a reverse proxy through `/ingest`.
- **Reverse proxy** added to `next.config.ts` to route PostHog requests through the app, reducing ad-blocker interference.
- **Server-side PostHog client** created at `lib/posthog-server.ts` using `posthog-node` with flush-on-every-call settings for Next.js serverless functions.
- **User identification** on sign-in and sign-up (server-side with `posthog-node`), and on every page render when the user session is present (client-side `posthog.identify` in `app/(dashboard)/layout.tsx`).
- **12 events** instrumented across 5 files covering the full user lifecycle: authentication, subscription, team management, and account changes.
- **Environment variables** written to `.env.local`: `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST`.

## Events

| Event | Description | File |
|---|---|---|
| `user_signed_up` | New user creates an account | `app/(login)/actions.ts` |
| `user_signed_in` | User signs in successfully | `app/(login)/actions.ts` |
| `user_signed_out` | User signs out from the dropdown | `app/(dashboard)/layout.tsx` |
| `checkout_started` | User initiates a Stripe checkout from pricing | `lib/payments/actions.ts` |
| `checkout_completed` | User returns from Stripe after successful payment | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Stripe webhook: subscription changed | `app/api/stripe/webhook/route.ts` |
| `subscription_cancelled` | Stripe webhook: subscription deleted | `app/api/stripe/webhook/route.ts` |
| `account_updated` | User saves name/email changes | `app/(login)/actions.ts` |
| `password_updated` | User successfully changes password | `app/(login)/actions.ts` |
| `account_deleted` | User permanently deletes account | `app/(login)/actions.ts` |
| `team_member_invited` | Team owner sends an invitation | `app/(login)/actions.ts` |
| `team_member_removed` | Team member is removed | `app/(login)/actions.ts` |

## Next steps

We recommend building an **"Analytics basics"** dashboard in PostHog with these five insights to monitor the most critical business metrics:

1. **Signup-to-Paid Conversion Funnel** — Funnel: `user_signed_up` → `checkout_started` → `checkout_completed`
2. **New Signups (Daily Trend)** — Trend: `user_signed_up` over the last 30 days
3. **Churn Events** — Trend: `account_deleted` and `subscription_cancelled` over the last 30 days
4. **Team Growth** — Trend: `team_member_invited` vs `team_member_removed`
5. **Sign-in Activity** — Trend: `user_signed_in` over time

- [PostHog Project Dashboard](https://us.posthog.com/project/2/dashboard)
- [Create a new Insight](https://us.posthog.com/project/2/insights/new)
- [PostHog Next.js Integration Docs](https://posthog.com/docs/libraries/next-js)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
