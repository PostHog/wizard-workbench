<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js 15 Pages Router SaaS application. Here's what was set up:

- **Client-side initialization** via `instrumentation-client.ts` using `posthog-js`, with a reverse proxy through `/ingest` to improve reliability and avoid ad blockers.
- **Server-side tracking** via a shared `lib/posthog-server.ts` singleton using `posthog-node`, tracking critical business operations in API routes.
- **User identification**: `posthog.identify()` is called on both client (after sign-in/sign-up) and server (in auth API routes) using the user's email as the distinct ID for cross-session and cross-platform correlation.
- **Session reset**: `posthog.reset()` is called on sign-out to prevent cross-user session contamination.
- **Exception capture**: Enabled via `capture_exceptions: true` in the PostHog init config for automatic error tracking.
- **Reverse proxy**: `next.config.ts` configured with `/ingest` rewrites pointing to PostHog's ingestion endpoint.
- **Environment variables**: `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` added to `.env.local`.

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `user_signed_in` | User successfully signed in (client + server) | `components/login.tsx`, `pages/api/auth/sign-in.ts` |
| `user_signed_up` | New user successfully registered (client + server) | `components/login.tsx`, `pages/api/auth/sign-up.ts` |
| `user_signed_out` | User signed out of their account (client) | `components/header.tsx` |
| `checkout_started` | User clicked "Get Started" on the pricing page | `pages/pricing.tsx` |
| `checkout_session_created` | A Stripe checkout session was created | `pages/api/stripe/create-checkout.ts` |
| `subscription_updated` | Stripe subscription status changed | `pages/api/stripe/webhook.ts` |
| `subscription_cancelled` | Stripe subscription was cancelled | `pages/api/stripe/webhook.ts` |
| `team_member_invited` | Team owner sent an invitation to a new member | `pages/api/team/invite.ts` |
| `team_member_removed` | Team member was removed from the team | `pages/api/team/remove-member.ts` |
| `account_updated` | User saved changes to their account settings | `pages/dashboard/general.tsx` |
| `manage_subscription_clicked` | User clicked Manage Subscription button | `pages/dashboard/index.tsx` |

## Next steps

To monitor key business metrics, create an **"Analytics basics"** dashboard in PostHog with these 5 insights:

### 1. Sign-up to Checkout Conversion Funnel
- Type: Funnel
- Steps: `user_signed_up` → `checkout_started` → `checkout_session_created`
- Shows: How many users who sign up proceed to start a paid checkout

### 2. Daily Active Sign-ups and Sign-ins
- Type: Trend
- Events: `user_signed_up`, `user_signed_in`
- Breakdown: by event name
- Shows: Growth in new registrations vs returning user logins over time

### 3. Subscription Lifecycle
- Type: Trend
- Events: `checkout_session_created`, `subscription_updated`, `subscription_cancelled`
- Shows: Subscription starts, changes, and cancellations over time — key for tracking churn

### 4. Team Collaboration Activity
- Type: Trend
- Events: `team_member_invited`, `team_member_removed`
- Shows: How teams are growing or shrinking — an indicator of product stickiness

### 5. Account Engagement
- Type: Trend
- Events: `account_updated`, `manage_subscription_clicked`
- Shows: How often users are actively managing their account and subscription

To create this dashboard, go to [PostHog Dashboards](https://us.posthog.com/project/2/dashboards) → New Dashboard → name it "Analytics basics", then add each insight above.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
