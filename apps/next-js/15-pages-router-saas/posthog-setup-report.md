<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 SaaS starter (Pages Router). Here's a summary of all changes made:

## What was set up

- **`posthog-js`** and **`posthog-node`** packages installed via pnpm
- **`instrumentation-client.ts`** created at the project root for client-side PostHog initialization (using the Next.js 15.3+ recommended approach), with a reverse proxy, exception capture, and debug mode in development
- **`lib/posthog-server.ts`** created as a singleton server-side PostHog Node client for API route tracking
- **`next.config.ts`** updated with reverse proxy rewrites (`/ingest/*`) to improve event reliability and reduce tracking-blocker interference
- **`.env.local`** updated with `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST`

## Events instrumented

| Event Name | Description | File |
|---|---|---|
| `user_signed_up` | Fired client-side when a user successfully creates a new account | `components/login.tsx` |
| `user_signed_in` | Fired client-side when a user successfully signs in | `components/login.tsx` |
| `user_signed_out` | Fired client-side when a user signs out (also calls `posthog.reset()`) | `components/header.tsx` |
| `checkout_initiated` | Fired when a user clicks 'Get Started' on a pricing plan | `pages/pricing.tsx` |
| `subscription_managed` | Fired when a user opens the Stripe customer portal | `pages/dashboard/index.tsx` |
| `team_member_invited` | Fired when a team owner sends an invitation | `pages/dashboard/index.tsx` |
| `team_member_removed` | Fired when a team member is removed | `pages/dashboard/index.tsx` |
| `account_updated` | Fired when a user updates their account name/email | `pages/dashboard/general.tsx` |
| `server_user_signed_up` | Server-side: fired when a new user account is created | `pages/api/auth/sign-up.ts` |
| `server_user_signed_in` | Server-side: fired when a user authenticates successfully | `pages/api/auth/sign-in.ts` |
| `server_subscription_updated` | Server-side: fired when a Stripe subscription changes via webhook | `pages/api/stripe/webhook.ts` |
| `server_team_member_invited` | Server-side: fired when a team invitation is persisted | `pages/api/team/invite.ts` |

## User identification

- On sign-in and sign-up, `posthog.identify(email, { email })` is called client-side so user behavior is tied to their identity
- On sign-in and sign-up, `posthog.identify({ distinctId: email, ... })` is also called server-side for cross-domain correlation
- On sign-out, `posthog.reset()` is called to clear the current user identity

## Error tracking

`posthog.captureException()` has been added to all catch blocks in the modified client-side files, and `capture_exceptions: true` is enabled in `instrumentation-client.ts` for automatic unhandled exception capture.

## Next steps

Your PostHog project is ready to receive events. Build insights and a dashboard to monitor your key metrics:

- **[PostHog Project Dashboard](https://us.posthog.com/project/238460/dashboard)** — View your project's dashboards
- **[Create a new Insight](https://us.posthog.com/project/238460/insights/new)** — Build charts from your events

### Suggested insights to create

1. **Sign-up Trend** — Trends chart of `user_signed_up` over time
2. **Sign-in → Checkout Funnel** — Funnel: `user_signed_in` → `checkout_initiated`
3. **Checkout by Plan** — `checkout_initiated` broken down by `plan_name` property
4. **Team Growth** — Trend of `team_member_invited` over time
5. **Subscription Changes** — Trend of `server_subscription_updated` broken down by `status` property

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
