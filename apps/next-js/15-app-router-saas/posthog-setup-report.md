<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 App Router SaaS application. The integration includes client-side SDK initialization using the Next.js 15.3+ `instrumentation-client.ts` approach, a server-side PostHog Node.js client singleton, reverse proxy rewrites for reliable ingestion, user identification on sign-in and sign-up, and comprehensive event tracking across all critical business flows — authentication, account management, subscription checkout, Stripe webhooks, and team management.

## Changes summary

| File | Change |
|------|--------|
| `instrumentation-client.ts` | **Created** — Client-side PostHog initialization (Next.js 15.3+ approach) with error tracking enabled |
| `next.config.ts` | **Updated** — Added PostHog reverse proxy rewrites and `skipTrailingSlashRedirect` |
| `lib/posthog-server.ts` | **Created** — Server-side PostHog Node.js client singleton |
| `app/(login)/actions.ts` | **Updated** — Added server-side events and user `identify()` calls |
| `app/api/stripe/checkout/route.ts` | **Updated** — Added `checkout_completed` server-side event |
| `app/api/stripe/webhook/route.ts` | **Updated** — Added `subscription_updated` and `subscription_cancelled` events |
| `app/(dashboard)/pricing/submit-button.tsx` | **Updated** — Added `checkout_initiated` client-side event |
| `app/(dashboard)/pricing/page.tsx` | **Updated** — Passes `planName` prop to `SubmitButton` |
| `.env` | **Updated** — Added `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` |

## Events tracked

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | Fired when a new user successfully creates an account | `app/(login)/actions.ts` |
| `user_signed_in` | Fired when a user successfully signs in to their account | `app/(login)/actions.ts` |
| `user_signed_out` | Fired when a user signs out of their account | `app/(login)/actions.ts` |
| `checkout_initiated` | Fired when a user clicks "Get Started" on a pricing plan | `app/(dashboard)/pricing/submit-button.tsx` |
| `checkout_completed` | Fired server-side when a Stripe checkout session completes | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Fired when a Stripe subscription is updated via webhook | `app/api/stripe/webhook/route.ts` |
| `subscription_cancelled` | Fired when a Stripe subscription is cancelled via webhook | `app/api/stripe/webhook/route.ts` |
| `account_updated` | Fired when a user updates their name or email in General Settings | `app/(login)/actions.ts` |
| `password_updated` | Fired when a user successfully updates their password | `app/(login)/actions.ts` |
| `account_deleted` | Fired when a user deletes their account | `app/(login)/actions.ts` |
| `team_member_invited` | Fired when a team owner sends an invitation | `app/(login)/actions.ts` |
| `team_member_removed` | Fired when a team member is removed from the team | `app/(login)/actions.ts` |

## Next steps

To monitor these events, create an "Analytics basics" dashboard in PostHog with the following recommended insights:

1. **Signup conversion funnel** — Funnel: `user_signed_up` → `checkout_initiated` → `checkout_completed`
2. **Daily active signups** — Trend: `user_signed_up` over time
3. **Subscription changes** — Trend: `subscription_updated` + `subscription_cancelled` over time
4. **Churn signals** — Trend: `account_deleted` + `subscription_cancelled` over time
5. **Team growth** — Trend: `team_member_invited` over time

Visit [PostHog Dashboards](https://us.posthog.com/project/2/dashboards) to create these insights.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
