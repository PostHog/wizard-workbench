<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router SaaS application. Here's a summary of what was set up:

**Client-side initialization** (`instrumentation-client.ts`) — PostHog is initialized using the Next.js 15.3+ `instrumentation-client.ts` pattern, with a reverse proxy via `/ingest` rewrites in `next.config.ts` for improved ad-blocker resistance and data accuracy. Error tracking (`capture_exceptions: true`) is enabled automatically.

**Server-side client** (`lib/posthog-server.ts`) — A singleton `posthog-node` client is used across all API routes, with `flushAt: 1` and `flushInterval: 0` to ensure events are sent immediately in serverless contexts.

**User identification** — On successful sign-in and sign-up, `posthog.identify()` is called client-side (in `components/login.tsx`) and server-side (in `pages/api/auth/sign-in.ts` and `pages/api/auth/sign-up.ts`), linking client and server events to the same user by email as the distinct ID.

**Event tracking** — 10 events were instrumented across 8 files covering the full user lifecycle: authentication, checkout, team management, account settings, and subscription changes.

**Error tracking** — `posthog.captureException()` is used in catch blocks in `components/login.tsx`, `components/header.tsx`, and `pages/pricing.tsx`.

| Event | Description | File |
|-------|-------------|------|
| `user_signed_in` | User successfully signs in to their account | `components/login.tsx` |
| `user_signed_up` | User successfully creates a new account | `components/login.tsx` |
| `user_signed_out` | User signs out of their account | `components/header.tsx` |
| `checkout_initiated` | User initiates a checkout/subscription purchase from the pricing page | `pages/pricing.tsx` |
| `account_updated` | User updates their account information (name/email) | `pages/dashboard/general.tsx` |
| `team_member_invited` | A team member is invited to join the team | `pages/api/team/invite.ts` |
| `team_member_removed` | A team member is removed from the team | `pages/api/team/remove-member.ts` |
| `subscription_changed` | User's subscription is updated or cancelled via Stripe webhook | `pages/api/stripe/webhook.ts` |
| `server_user_signed_in` | Server-side sign-in event for client/server correlation | `pages/api/auth/sign-in.ts` |
| `server_user_signed_up` | Server-side sign-up event for client/server correlation | `pages/api/auth/sign-up.ts` |

## Next steps

We recommend building an **"Analytics basics"** dashboard in PostHog with these insights to monitor user behavior:

1. **Signup to Checkout Conversion Funnel** — `user_signed_up` → `checkout_initiated` (funnel insight, 14-day window)
2. **New User Signups Over Time** — `user_signed_up` trend, daily interval
3. **Subscription Changes (Churn Signal)** — `subscription_changed` broken down by `subscription_status`
4. **Team Growth** — `team_member_invited` and `team_member_removed` trends
5. **Daily Active Users** — `user_signed_in` trend as a DAU proxy

To create this dashboard, visit [https://us.posthog.com/project/2/dashboard](https://us.posthog.com/project/2/dashboard) and click **New dashboard**.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
