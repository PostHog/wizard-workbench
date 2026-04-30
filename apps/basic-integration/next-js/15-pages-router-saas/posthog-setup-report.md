<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router SaaS application. Here is a summary of everything that was set up:

**Client-side initialization** was added via `instrumentation-client.ts`, which initializes PostHog with session replay, error tracking (`capture_exceptions`), and a reverse proxy through `/ingest` to improve ad-blocker resilience.

**Reverse proxy rewrites** were added to `next.config.ts` so that all PostHog traffic routes through `/ingest/*` on your own domain.

**A server-side PostHog client** (`lib/posthog-server.ts`) was created using `posthog-node` for capturing events and identifying users from API routes.

**User identification** is performed in `components/login.tsx` using `posthog.identify()` with the user's email immediately after a successful sign-in or sign-up, ensuring client-side and server-side events are correlated to the same person.

**Sign-out** in `components/header.tsx` calls `posthog.reset()` to cleanly detach the PostHog identity from the browser session.

**9 events** were instrumented across 7 files covering the full user lifecycle and critical business operations.

| Event | Description | File |
|-------|-------------|------|
| `user_signed_in` | User successfully signs in with email and password | `components/login.tsx` |
| `user_signed_up` | User successfully creates a new account | `components/login.tsx` |
| `user_signed_out` | User signs out of their account | `components/header.tsx` |
| `checkout_initiated` | User clicks Get Started on a pricing plan | `pages/pricing.tsx` |
| `checkout_completed` | User completes Stripe checkout and subscription is activated | `pages/api/stripe/checkout.ts` |
| `subscription_updated` | Stripe webhook fires when a subscription is updated | `pages/api/stripe/webhook.ts` |
| `subscription_cancelled` | Stripe webhook fires when a subscription is deleted/cancelled | `pages/api/stripe/webhook.ts` |
| `team_member_invited` | User invites a new team member | `pages/api/team/invite.ts` |
| `account_updated` | User saves changes to their account information | `pages/dashboard/general.tsx` |

## Next steps

We've set up the events you need to build powerful insights. Here are five recommended insights to create in your PostHog dashboard named **"Analytics basics"**:

1. **Sign-up to checkout conversion funnel** — Funnel: `user_signed_up` → `checkout_initiated` → `checkout_completed`
   [Create in PostHog](https://us.posthog.com/project/2/insights/new#funnel)

2. **Daily sign-ups and sign-ins** — Trend: `user_signed_up` and `user_signed_in` over time
   [Create in PostHog](https://us.posthog.com/project/2/insights/new#trends)

3. **Subscription cancellation rate** — Trend: `subscription_cancelled` vs `checkout_completed` over time
   [Create in PostHog](https://us.posthog.com/project/2/insights/new#trends)

4. **Plan popularity** — Breakdown of `checkout_initiated` by `plan_name` property
   [Create in PostHog](https://us.posthog.com/project/2/insights/new#trends)

5. **Team growth** — Trend of `team_member_invited` over time
   [Create in PostHog](https://us.posthog.com/project/2/insights/new#trends)

[Open PostHog Project](https://us.posthog.com/project/2)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
