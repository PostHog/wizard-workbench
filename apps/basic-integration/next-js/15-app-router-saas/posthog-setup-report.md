<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router SaaS application. The integration covers client-side initialization via `instrumentation-client.ts`, a shared server-side PostHog client, a reverse proxy to avoid ad-blockers, user identification on both client and server, and 14 business-critical events spanning the full user lifecycle — from sign-up through subscription and account management.

## Changes made

| File | Change |
|------|--------|
| `instrumentation-client.ts` | Created — initializes posthog-js for client-side tracking with reverse proxy, exception capture, and debug mode |
| `next.config.ts` | Added reverse proxy rewrites for `/ingest/*` → PostHog, plus `skipTrailingSlashRedirect: true` |
| `lib/posthog-server.ts` | Created — singleton PostHog Node client for server-side event capture |
| `.env.local` | Added `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` |
| `app/(dashboard)/layout.tsx` | Added client-side `posthog.identify()` in `UserMenu` when user loads, and `posthog.reset()` on sign-out |
| `app/(login)/actions.ts` | Added server-side identify + capture for sign-in, sign-up, sign-out, password update, account delete, account update, team member invite, team member remove |
| `lib/payments/actions.ts` | Added server-side capture for checkout initiated and customer portal accessed |
| `app/api/stripe/checkout/route.ts` | Added server-side capture for checkout completed with plan/subscription details |
| `app/api/stripe/webhook/route.ts` | Added server-side capture for subscription updated and subscription cancelled via Stripe webhook |
| `app/(dashboard)/pricing/page.tsx` | Added server-side capture for pricing page viewed (top of conversion funnel) |

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | User successfully created a new account (with or without an invitation) | `app/(login)/actions.ts` |
| `user_signed_in` | User successfully authenticated with email and password | `app/(login)/actions.ts` |
| `user_signed_out` | User explicitly signed out of their session | `app/(login)/actions.ts`, `app/(dashboard)/layout.tsx` |
| `checkout_initiated` | User started a Stripe checkout session for a subscription plan | `lib/payments/actions.ts` |
| `checkout_completed` | User successfully completed Stripe checkout and a subscription was created | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Stripe subscription changed (plan upgrade, downgrade, or status change) | `app/api/stripe/webhook/route.ts` |
| `subscription_cancelled` | Stripe subscription was deleted/cancelled | `app/api/stripe/webhook/route.ts` |
| `password_updated` | User successfully changed their account password | `app/(login)/actions.ts` |
| `account_deleted` | User deleted their account (soft delete) | `app/(login)/actions.ts` |
| `account_updated` | User updated their name or email in general settings | `app/(login)/actions.ts` |
| `team_member_invited` | Team owner sent an invitation to a new team member | `app/(login)/actions.ts` |
| `team_member_removed` | Team member was removed from the team | `app/(login)/actions.ts` |
| `customer_portal_accessed` | User clicked to manage their subscription in the Stripe customer portal | `lib/payments/actions.ts` |
| `pricing_page_viewed` | User viewed the pricing page (top of subscription conversion funnel) | `app/(dashboard)/pricing/page.tsx` |

## Next steps

We've prepared a set of insights for you to build in PostHog to monitor user behavior and conversion across this app:

1. **Subscription conversion funnel** — [Create in PostHog](https://us.posthog.com/project/2/insights/new)
   Steps: `pricing_page_viewed` → `checkout_initiated` → `checkout_completed`

2. **Sign-up to subscription funnel** — [Create in PostHog](https://us.posthog.com/project/2/insights/new)
   Steps: `user_signed_up` → `checkout_initiated` → `checkout_completed`

3. **Daily active users (sign-ins over time)** — [Create in PostHog](https://us.posthog.com/project/2/insights/new)
   Trend: `user_signed_in` count over time

4. **Churn: account deletions vs. subscription cancellations** — [Create in PostHog](https://us.posthog.com/project/2/insights/new)
   Trend: `account_deleted` and `subscription_cancelled` side-by-side

5. **Team growth: invitations sent** — [Create in PostHog](https://us.posthog.com/project/2/insights/new)
   Trend: `team_member_invited` over time

Visit your [PostHog dashboards](https://us.posthog.com/project/2/dashboard) to create the "Analytics basics (wizard)" dashboard and add these insights.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
