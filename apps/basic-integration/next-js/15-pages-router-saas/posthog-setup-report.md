<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router SaaS application. The integration covers client-side event tracking via `posthog-js`, server-side event tracking via `posthog-node`, user identification on login and signup, session reset on logout, exception capture for error tracking, and a reverse proxy to improve reliability of event delivery.

**Files created:**
- `instrumentation-client.ts` — Client-side PostHog initialization using Next.js 15.3+ instrumentation API
- `lib/posthog-server.ts` — Server-side PostHog singleton client for API routes
- `.env.local` — Environment variables `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`

**Files modified:**
- `next.config.ts` — Added `/ingest` reverse proxy rewrites and `skipTrailingSlashRedirect: true`
- `components/login.tsx` — User identification (`posthog.identify`), `user_signed_in`, `user_signed_up` events, exception capture
- `components/header.tsx` — `user_signed_out` event, `posthog.reset()` on logout, exception capture
- `pages/pricing.tsx` — `checkout_initiated` event with plan and price details, exception capture
- `pages/api/stripe/checkout.ts` — Server-side `subscription_activated` event after successful Stripe checkout
- `pages/api/stripe/webhook.ts` — Server-side `subscription_updated` and `subscription_cancelled` events from Stripe webhooks
- `pages/dashboard/index.tsx` — `subscription_manage_clicked`, `team_member_invited`, `team_member_removed` events, exception capture
- `pages/dashboard/general.tsx` — `account_updated` event, exception capture

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | User successfully created a new account | `components/login.tsx` |
| `user_signed_in` | User successfully signed in to an existing account | `components/login.tsx` |
| `user_signed_out` | User signed out of their account | `components/header.tsx` |
| `checkout_initiated` | User clicked Get Started on a pricing plan | `pages/pricing.tsx` |
| `subscription_activated` | User completed Stripe checkout and subscription was activated | `pages/api/stripe/checkout.ts` |
| `subscription_updated` | Subscription status changed to active or trialing (webhook) | `pages/api/stripe/webhook.ts` |
| `subscription_cancelled` | Subscription was cancelled or became unpaid (webhook) | `pages/api/stripe/webhook.ts` |
| `subscription_manage_clicked` | User opened the Stripe customer portal | `pages/dashboard/index.tsx` |
| `team_member_invited` | Team owner sent an invitation to a new team member | `pages/dashboard/index.tsx` |
| `team_member_removed` | Team member was removed from the team | `pages/dashboard/index.tsx` |
| `account_updated` | User updated their account name or email | `pages/dashboard/general.tsx` |

## Next steps

To visualize user behavior, create an **"Analytics basics"** dashboard in PostHog with these recommended insights:

1. **[Signup → Checkout Funnel](/insights/new?insight=FUNNELS)** — Funnel: `user_signed_up` → `checkout_initiated` → `subscription_activated`
2. **[Signups over time](/insights/new?insight=TRENDS)** — Trend: `user_signed_up` events over time
3. **[Subscription activations](/insights/new?insight=TRENDS)** — Trend: `subscription_activated` events over time
4. **[Subscription cancellations](/insights/new?insight=TRENDS)** — Trend: `subscription_cancelled` events over time to track churn
5. **[Team collaboration activity](/insights/new?insight=TRENDS)** — Trend: `team_member_invited` + `team_member_removed` events

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
