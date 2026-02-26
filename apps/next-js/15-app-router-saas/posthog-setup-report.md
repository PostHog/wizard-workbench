<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your Next.js 15 App Router SaaS project. Here's a summary of all changes made:

- **`instrumentation-client.ts`** (new) — Initializes `posthog-js` on the client side via Next.js's built-in instrumentation hook. Uses a reverse proxy (`/ingest`) to improve event delivery reliability, enables exception capture, and sets debug mode in development.
- **`lib/posthog-server.ts`** (new) — A singleton `posthog-node` client used across all server-side actions and API routes. Configured with `flushAt: 1` and `flushInterval: 0` to flush events immediately (important for short-lived serverless functions).
- **`next.config.ts`** (edited) — Added `/ingest` reverse proxy rewrites that forward PostHog requests through your Next.js server, reducing ad-blocker interference. Also set `skipTrailingSlashRedirect: true` to support PostHog's API endpoint patterns.
- **`app/(login)/actions.ts`** (edited) — Added `posthog-node` capture calls for all user lifecycle and team management actions.
- **`app/(login)/login.tsx`** (edited) — Added client-side `posthog.identify()` on form submission to link the client-side anonymous ID with the server-side user ID for cross-session continuity.
- **`lib/payments/actions.ts`** (edited) — Added server-side capture for checkout initiation and customer portal access.
- **`app/api/stripe/checkout/route.ts`** (edited) — Added server-side capture for successful checkout completion (after Stripe confirms payment).
- **`app/api/stripe/webhook/route.ts`** (edited) — Added server-side capture for subscription updates/cancellations via Stripe webhooks.

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `user_signed_in` | User successfully signed in with email and password | `app/(login)/actions.ts` |
| `user_signed_up` | New user successfully created an account | `app/(login)/actions.ts` |
| `user_signed_out` | User signed out of their account | `app/(login)/actions.ts` |
| `user_deleted_account` | User permanently deleted their account | `app/(login)/actions.ts` |
| `user_updated_account` | User updated their account information (name or email) | `app/(login)/actions.ts` |
| `user_updated_password` | User successfully changed their password | `app/(login)/actions.ts` |
| `team_member_invited` | Team owner sent an invitation to a new team member | `app/(login)/actions.ts` |
| `team_member_removed` | Team owner removed a member from the team | `app/(login)/actions.ts` |
| `checkout_initiated` | User started checkout for a subscription plan | `lib/payments/actions.ts` |
| `checkout_completed` | User successfully completed Stripe checkout and subscription was activated | `app/api/stripe/checkout/route.ts` |
| `subscription_changed` | Subscription was updated or cancelled via Stripe webhook | `app/api/stripe/webhook/route.ts` |
| `customer_portal_opened` | User opened the Stripe customer portal to manage their subscription | `lib/payments/actions.ts` |

## Next steps

To make the most of these events, we recommend creating the following insights and dashboard in PostHog:

### Suggested "Analytics basics" dashboard insights

1. **Signup to Checkout Conversion Funnel** — Funnel: `user_signed_up` → `checkout_initiated` → `checkout_completed`
2. **New Signups Over Time** — Trends: `user_signed_up` count over the last 30 days
3. **Churn Events: Account Deletions** — Trends: `user_deleted_account` over time
4. **Subscription Changes Over Time** — Trends: `subscription_changed` + `checkout_completed` together
5. **Team Activity** — Trends: `team_member_invited` + `team_member_removed` over time

You can create these by visiting [PostHog Insights](https://us.posthog.com/project/2/insights) and clicking **+ New insight**.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
