<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router SaaS application. The integration covers client-side initialization, server-side event capture, user identification, and a reverse proxy setup for improved ad-blocker resistance.

**Files created:**
- `instrumentation-client.ts` — Client-side PostHog initialization via Next.js 15.3+ instrumentation API (session replay, exception capture, autocapture)
- `lib/posthog-server.ts` — Server-side PostHog singleton client for capturing events from Server Actions and API routes
- `components/posthog-identifier.tsx` — Client component that calls `posthog.identify()` when user data is available from SWR

**Files modified:**
- `next.config.ts` — Added `/ingest` reverse proxy rewrites to PostHog and `skipTrailingSlashRedirect: true`
- `app/layout.tsx` — Imported and rendered `PostHogIdentifier`
- `app/(login)/actions.ts` — Server-side identify + capture for all auth/account/team events
- `app/api/stripe/checkout/route.ts` — Capture `checkout_completed` after successful Stripe checkout
- `app/api/stripe/webhook/route.ts` — Capture `subscription_updated` / `subscription_canceled` from Stripe webhooks
- `lib/payments/actions.ts` — Capture `checkout_started` and `customer_portal_opened`

**Environment variables set in `.env.local`:**
- `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`
- `NEXT_PUBLIC_POSTHOG_HOST`

## Events

| Event Name | Description | File |
|---|---|---|
| `user_signed_up` | Fired when a new user completes registration, either directly or via team invitation | `app/(login)/actions.ts` |
| `user_signed_in` | Fired when a user successfully authenticates with their credentials | `app/(login)/actions.ts` |
| `user_signed_out` | Fired when a user signs out | `app/(login)/actions.ts` |
| `checkout_started` | Fired when a user initiates a Stripe checkout session for a subscription plan | `lib/payments/actions.ts` |
| `checkout_completed` | Fired server-side when Stripe confirms a successful checkout and subscription is activated | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Fired server-side via Stripe webhook when a subscription status changes (e.g. active, trialing) | `app/api/stripe/webhook/route.ts` |
| `subscription_canceled` | Fired server-side via Stripe webhook when a subscription is canceled or becomes unpaid | `app/api/stripe/webhook/route.ts` |
| `team_member_invited` | Fired when a team owner sends an invitation to a new team member | `app/(login)/actions.ts` |
| `team_member_removed` | Fired when a team member is removed from the team | `app/(login)/actions.ts` |
| `account_updated` | Fired when a user saves changes to their account name or email | `app/(login)/actions.ts` |
| `password_updated` | Fired when a user successfully changes their password | `app/(login)/actions.ts` |
| `account_deleted` | Fired when a user confirms and completes account deletion | `app/(login)/actions.ts` |
| `customer_portal_opened` | Fired when a user is redirected to the Stripe billing portal to manage their subscription | `lib/payments/actions.ts` |

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog with the following insights:

1. **Signup → Checkout → Subscription funnel** — Funnel insight with steps: `user_signed_up` → `checkout_started` → `checkout_completed`. This reveals your core conversion rate.

2. **Daily new signups** — Trends insight showing `user_signed_up` over time. Track growth and the impact of marketing campaigns.

3. **Subscription churn over time** — Trends insight showing `subscription_canceled` over time. Monitor cancellations to catch churn spikes early.

4. **Checkout conversion rate** — Funnel insight: `checkout_started` → `checkout_completed`. Identifies drop-off in the payment flow.

5. **Active users by sign-ins** — Trends insight showing unique users of `user_signed_in` over time (DAU/WAU/MAU).

You can create these in PostHog at: https://us.posthog.com/project/2/insights/new

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
