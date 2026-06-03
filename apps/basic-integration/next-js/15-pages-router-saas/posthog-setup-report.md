<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router SaaS application. The following changes were made:

- **`instrumentation-client.ts`** — Created to initialize PostHog client-side using the Next.js 15.3+ instrumentation hook, with a reverse proxy (`/ingest`) for improved data reliability.
- **`lib/posthog-server.ts`** — Created a singleton PostHog Node.js client for server-side event capture across API routes.
- **`next.config.ts`** — Added reverse proxy rewrites for `/ingest/*` to route PostHog traffic through the Next.js server, preventing ad-blocker interference.
- **`components/login.tsx`** — Added `posthog.identify()` on successful sign-in and sign-up, and passes `X-POSTHOG-DISTINCT-ID` / `X-POSTHOG-SESSION-ID` headers to the API for cross-domain correlation.
- **`components/header.tsx`** — Added `posthog.capture('user_signed_out')` and `posthog.reset()` in the sign-out handler.
- **`pages/pricing.tsx`** — Added `posthog.capture('pricing_plan_selected')` when a user clicks a pricing plan.
- **`pages/dashboard/general.tsx`** — Added `posthog.capture('account_updated')` on successful account save.
- **`pages/api/auth/sign-in.ts`** — Added server-side `posthog.identify()` and `posthog.capture('user_signed_in')`.
- **`pages/api/auth/sign-up.ts`** — Added server-side `posthog.identify()` and `posthog.capture('user_signed_up')`.
- **`pages/api/stripe/create-checkout.ts`** — Added `posthog.capture('checkout_started')`.
- **`pages/api/stripe/webhook.ts`** — Added `posthog.capture('subscription_updated')` and `posthog.capture('subscription_cancelled')` from Stripe webhook events.
- **`pages/api/stripe/customer-portal.ts`** — Added `posthog.capture('customer_portal_accessed')`.
- **`pages/api/team/invite.ts`** — Added `posthog.capture('team_member_invited')`.
- **`pages/api/team/remove-member.ts`** — Added `posthog.capture('team_member_removed')`.

| Event | Description | File |
|---|---|---|
| `user_signed_up` | Fires when a new user successfully registers an account | `pages/api/auth/sign-up.ts` |
| `user_signed_in` | Fires when a user successfully authenticates | `pages/api/auth/sign-in.ts` |
| `user_signed_out` | Fires when a user logs out of their account | `components/header.tsx` |
| `pricing_plan_selected` | Fires when a user clicks Get Started on a pricing plan card | `pages/pricing.tsx` |
| `checkout_started` | Fires when a Stripe checkout session is created for a user | `pages/api/stripe/create-checkout.ts` |
| `subscription_updated` | Fires when a Stripe subscription status or plan changes via webhook | `pages/api/stripe/webhook.ts` |
| `subscription_cancelled` | Fires when a Stripe subscription is deleted/cancelled via webhook | `pages/api/stripe/webhook.ts` |
| `customer_portal_accessed` | Fires when a user opens the Stripe billing customer portal | `pages/api/stripe/customer-portal.ts` |
| `team_member_invited` | Fires when a team member invitation is successfully sent | `pages/api/team/invite.ts` |
| `team_member_removed` | Fires when a team member is removed from a team | `pages/api/team/remove-member.ts` |
| `account_updated` | Fires when a user successfully updates their account name or email | `pages/dashboard/general.tsx` |

## Next steps

We recommend building an **"Analytics basics"** dashboard in PostHog with the following insights:

1. **Signup → Checkout funnel** — Funnel from `user_signed_up` → `pricing_plan_selected` → `checkout_started` to measure conversion rate through the signup-to-payment flow.
2. **Subscription churn** — Trend of `subscription_cancelled` events over time to track churn.
3. **Daily active users (sign-ins)** — Trend of `user_signed_in` unique users per day.
4. **Team growth** — Trend of `team_member_invited` events to measure team expansion.
5. **Account engagement** — Trend of `account_updated` events to track dashboard engagement.

You can create these at [/insights](/insights) and collect them into a dashboard at [/dashboard](/dashboard) in your PostHog project.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
