<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router SaaS project. The integration covers client-side initialization with session replay and error tracking, server-side event capture for all critical business operations, user identification on both client and server, and a reverse proxy setup to improve ad-blocker resistance.

**Files created:**
- `instrumentation-client.ts` — Client-side PostHog init (Next.js 15.3+ pattern, no provider needed)
- `lib/posthog-server.ts` — Singleton server-side PostHog client (`posthog-node`)
- `components/posthog-identify.tsx` — Client component that calls `posthog.identify` when user data loads via SWR

**Files modified:**
- `next.config.ts` — Added `/ingest` reverse proxy rewrites + `skipTrailingSlashRedirect`
- `app/layout.tsx` — Added `<PostHogIdentify />` for client-side user identification
- `app/(login)/actions.ts` — Added server-side identify + 8 capture calls across all auth/account Server Actions
- `lib/payments/actions.ts` — Added `checkout_started` capture in checkout Server Action
- `app/api/stripe/checkout/route.ts` — Added `checkout_completed` capture after successful checkout
- `app/api/stripe/webhook/route.ts` — Added `subscription_updated` and `subscription_cancelled` captures in webhook handler

| Event | Description | File |
|---|---|---|
| `user_signed_up` | New user creates an account | `app/(login)/actions.ts` |
| `user_signed_in` | User signs in | `app/(login)/actions.ts` |
| `user_signed_out` | User signs out | `app/(login)/actions.ts` |
| `checkout_started` | User initiates a subscription checkout | `lib/payments/actions.ts` |
| `checkout_completed` | Stripe checkout session completed successfully | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Stripe subscription updated (renewal, plan change) | `app/api/stripe/webhook/route.ts` |
| `subscription_cancelled` | Stripe subscription deleted/cancelled | `app/api/stripe/webhook/route.ts` |
| `account_settings_updated` | User updates their name or email | `app/(login)/actions.ts` |
| `password_changed` | User changes their password | `app/(login)/actions.ts` |
| `account_deleted` | User deletes their account (churn signal) | `app/(login)/actions.ts` |
| `team_member_invited` | Team owner invites a new member | `app/(login)/actions.ts` |
| `team_member_removed` | Team member is removed | `app/(login)/actions.ts` |

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog with these five insights to monitor your most critical business metrics:

1. **Signup-to-Paid Conversion Funnel** — Track `user_signed_up` → `checkout_started` → `checkout_completed` to measure your conversion rate.

2. **New Signups Over Time** — Trends chart of `user_signed_up` grouped by day/week to monitor growth.

3. **Active Subscriptions** — Trends of `checkout_completed` vs `subscription_cancelled` over time to track net subscription health.

4. **Account Churn** — Trend of `account_deleted` events. Spike detection for churn events.

5. **Team Collaboration** — Trend of `team_member_invited` to track team growth and product stickiness.

You can create these insights directly in your PostHog project:
- **Insights**: https://us.posthog.com/project/2/insights/new
- **Dashboards**: https://us.posthog.com/project/2/dashboards

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
