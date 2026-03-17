<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router SaaS project. The integration covers both client-side and server-side event tracking, user identification, and a reverse proxy setup for reliable data ingestion.

**Files created:**
- `instrumentation-client.ts` — Client-side PostHog initialization using Next.js 15.3+ instrumentation API with session replay and error tracking enabled
- `lib/posthog-server.ts` — Server-side PostHog singleton client using `posthog-node`
- `next.config.ts` — Updated with reverse proxy rewrites (`/ingest/*`) for PostHog ingestion

**Files edited:**
- `app/(login)/actions.ts` — Added `user_signed_up`, `user_signed_in`, `user_signed_out`, `password_updated`, `account_deleted`, `account_updated`, `team_member_invited`, `team_member_removed` events with user identification
- `app/api/stripe/checkout/route.ts` — Added `checkout_completed` server-side event
- `app/api/stripe/webhook/route.ts` — Added `subscription_updated` and `subscription_cancelled` server-side events
- `app/(dashboard)/pricing/submit-button.tsx` — Added `checkout_initiated` client-side event

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | User successfully created a new account | `app/(login)/actions.ts` |
| `user_signed_in` | User successfully signed in to their account | `app/(login)/actions.ts` |
| `user_signed_out` | User signed out of their account | `app/(login)/actions.ts` |
| `checkout_initiated` | User submitted the checkout form on the pricing page | `app/(dashboard)/pricing/submit-button.tsx` |
| `checkout_completed` | Stripe checkout session completed and subscription activated | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Stripe subscription was updated via webhook | `app/api/stripe/webhook/route.ts` |
| `subscription_cancelled` | Stripe subscription was cancelled via webhook | `app/api/stripe/webhook/route.ts` |
| `password_updated` | User successfully changed their password | `app/(login)/actions.ts` |
| `account_deleted` | User deleted their account (churn event) | `app/(login)/actions.ts` |
| `account_updated` | User updated their account name or email | `app/(login)/actions.ts` |
| `team_member_invited` | Team owner invited a new member to their team | `app/(login)/actions.ts` |
| `team_member_removed` | Team owner removed a member from their team | `app/(login)/actions.ts` |

## Next steps

We recommend creating an "Analytics basics" dashboard in PostHog with these insights to monitor user behavior:

1. **Signup conversion funnel** — Funnel from `checkout_initiated` → `checkout_completed` to measure pricing page conversion
2. **New user signups** — Trend of `user_signed_up` over time to track growth
3. **Churn signal** — Trend of `account_deleted` + `subscription_cancelled` over time to catch churn early
4. **Active authentication** — Trend of `user_signed_in` to monitor daily/weekly active usage
5. **Team growth** — Trend of `team_member_invited` to track viral / team expansion behavior

Visit [https://us.posthog.com/project/2](https://us.posthog.com/project/2) to create these insights in your PostHog project.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
