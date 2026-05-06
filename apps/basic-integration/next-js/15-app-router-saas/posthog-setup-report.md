<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router SaaS project. Here's a summary of everything that was set up:

## What was done

- **Installed** `posthog-js` (client-side) and `posthog-node` (server-side) packages
- **Created** `instrumentation-client.ts` — initializes PostHog on the client with a reverse proxy, error tracking (`capture_exceptions: true`), and the `2026-01-30` defaults
- **Created** `lib/posthog-server.ts` — factory function for server-side PostHog clients (`flushAt: 1`, `flushInterval: 0` for immediate flushing in short-lived server functions)
- **Updated** `next.config.ts` — added reverse proxy rewrites for `/ingest/*` → PostHog, plus `skipTrailingSlashRedirect: true`
- **Created** `app/components/posthog-identify.tsx` — client component that identifies authenticated users in PostHog via `useSWR` as soon as they load the dashboard
- **Updated** `app/(dashboard)/layout.tsx` — mounts `<PostHogIdentify />` and calls `posthog.reset()` on sign-out to unlink future events from the logged-out user
- **Updated** `app/(dashboard)/pricing/submit-button.tsx` — captures `pricing_plan_selected` on click before form submission
- **Set** environment variables in `.env.local` (`NEXT_PUBLIC_POSTHOG_TOKEN`, `NEXT_PUBLIC_POSTHOG_HOST`)

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user_signed_up` | User successfully created a new account (with or without an invitation) | `app/(login)/actions.ts` |
| `user_signed_in` | User successfully signed in to their existing account | `app/(login)/actions.ts` |
| `user_signed_out` | User signed out of their account | `app/(login)/actions.ts` |
| `checkout_started` | User initiated a checkout session to subscribe to a plan | `lib/payments/actions.ts` |
| `checkout_completed` | User successfully completed checkout — critical conversion event | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Stripe webhook: an existing subscription was updated | `app/api/stripe/webhook/route.ts` |
| `subscription_canceled` | Stripe webhook: a subscription was canceled — critical churn event | `app/api/stripe/webhook/route.ts` |
| `password_updated` | User successfully changed their account password | `app/(login)/actions.ts` |
| `account_deleted` | User deleted their account — critical churn event | `app/(login)/actions.ts` |
| `team_member_invited` | Team owner sent an invitation to a new team member | `app/(login)/actions.ts` |
| `team_member_removed` | Team owner removed a member from the team | `app/(login)/actions.ts` |
| `account_updated` | User updated their account information (name or email) | `app/(login)/actions.ts` |
| `pricing_plan_selected` | User clicked 'Get Started' on a pricing plan — top of checkout funnel | `app/(dashboard)/pricing/submit-button.tsx` |

## Next steps

We recommend building these key insights and a dashboard in PostHog to keep an eye on user behavior:

**Create a new "Analytics basics" dashboard** in PostHog and add these insights:

1. **Signup-to-Checkout Conversion Funnel** — Funnel: `user_signed_up` → `pricing_plan_selected` → `checkout_started` → `checkout_completed`. This is your primary conversion funnel.

2. **New User Signups Over Time** — Trend: `user_signed_up` by day/week. Monitor growth rate.

3. **Churn Events** — Trend: `account_deleted` and `subscription_canceled` on the same chart. Watch for spikes.

4. **Checkout Success Rate** — Trend: `checkout_started` vs `checkout_completed` as a ratio. Identify drop-off in payment flow.

5. **Team Growth Activity** — Trend: `team_member_invited` and `team_member_removed`. Understand team expansion vs contraction.

Open your PostHog project to build these insights: **https://us.posthog.com/project/2/insights/new**

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
