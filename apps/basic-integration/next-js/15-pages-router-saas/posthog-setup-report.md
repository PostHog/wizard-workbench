<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 Pages Router SaaS application. Here's a summary of what was done:

- **`instrumentation-client.ts`** (new): Initializes PostHog client-side using the `instrumentation-client` pattern recommended for Next.js 15.3+, with a reverse proxy, error tracking, and debug mode in development.
- **`next.config.ts`**: Added reverse proxy rewrites so PostHog requests route through `/ingest` on your own domain, reducing ad-blocker interference.
- **`lib/posthog-server.ts`** (new): A shared server-side PostHog Node.js client singleton used across API routes.
- **`components/login.tsx`**: Added `posthog.identify()` and `posthog.capture()` calls after successful sign-in and sign-up. Also passes the anonymous distinct ID as an `X-POSTHOG-DISTINCT-ID` header to the API route for server-side correlation.
- **`components/header.tsx`**: Added `posthog.capture('user_signed_out')` and `posthog.reset()` on sign-out.
- **`pages/pricing.tsx`**: Added `posthog.capture('checkout_started')` when the user clicks "Get Started" on a pricing plan.
- **`pages/dashboard/general.tsx`**: Added `posthog.capture('account_updated')` on successful account info save.
- **`pages/dashboard/index.tsx`**: Added `posthog.capture('manage_subscription_clicked')` when the user opens the Stripe customer portal.
- **`pages/api/auth/sign-in.ts`**: Added server-side `posthog.identify()` to link the anonymous client ID with the user's email on sign-in.
- **`pages/api/auth/sign-up.ts`**: Added server-side `posthog.identify()` to link the anonymous client ID with the new user's email on sign-up.
- **`pages/api/stripe/checkout.ts`**: Added server-side `posthog.capture('subscription_activated')` after successful Stripe checkout.
- **`lib/payments/stripe.ts`**: Added server-side `posthog.capture('subscription_updated')` and `posthog.capture('subscription_cancelled')` in the subscription webhook handler.
- **`pages/api/team/invite.ts`**: Added server-side `posthog.capture('team_member_invited')` after sending an invitation.
- **`pages/api/team/remove-member.ts`**: Added server-side `posthog.capture('team_member_removed')` after removing a team member.

| Event | Description | File |
|-------|-------------|------|
| `user_signed_in` | User successfully signed in with email and password | `components/login.tsx` |
| `user_signed_up` | New user successfully created an account | `components/login.tsx` |
| `user_signed_out` | User signed out of their account | `components/header.tsx` |
| `checkout_started` | User clicked Get Started on a pricing plan to begin checkout | `pages/pricing.tsx` |
| `account_updated` | User updated their account name or email in general settings | `pages/dashboard/general.tsx` |
| `manage_subscription_clicked` | User clicked Manage Subscription to open the customer portal | `pages/dashboard/index.tsx` |
| `subscription_activated` | Stripe checkout completed and subscription was created for a team | `pages/api/stripe/checkout.ts` |
| `subscription_updated` | Stripe subscription status changed to active or trialing | `lib/payments/stripe.ts` |
| `subscription_cancelled` | Stripe subscription was cancelled or became unpaid | `lib/payments/stripe.ts` |
| `team_member_invited` | Team owner sent an invitation to a new team member | `pages/api/team/invite.ts` |
| `team_member_removed` | Team owner removed a member from the team | `pages/api/team/remove-member.ts` |

## Next steps

The PostHog API key used during setup didn't have the required scopes (`dashboard:write`, `insight:write`, `query:read`) to auto-create a dashboard. To set up the "Analytics basics" dashboard manually, go to your [PostHog project](https://us.posthog.com/project/2) and create a dashboard with these recommended insights:

1. **Signup conversion funnel** — Funnel insight: `checkout_started` → `user_signed_up` → `subscription_activated`. Tracks how many users who start checkout actually complete it.
2. **Sign-ins & sign-ups over time** — Trends insight: `user_signed_in` and `user_signed_up` as two series. Monitors daily/weekly user activity.
3. **Subscription health** — Trends insight: `subscription_activated`, `subscription_updated`, and `subscription_cancelled`. Tracks subscription lifecycle events.
4. **Team growth** — Trends insight: `team_member_invited` and `team_member_removed`. Shows team expansion over time.
5. **Churn signal** — Trends insight: `subscription_cancelled` with a breakdown by `status` property. Identifies cancellation patterns.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
