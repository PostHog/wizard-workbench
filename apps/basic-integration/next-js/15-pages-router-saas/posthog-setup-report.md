<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 Pages Router SaaS application. Here is a summary of every change made:

- **`instrumentation-client.ts`** (new): Initializes `posthog-js` on the client side using Next.js 15.3+ instrumentation support. Configured with a reverse proxy (`/ingest`), exception capture, and debug mode in development.
- **`lib/posthog-server.ts`** (new): Singleton `posthog-node` client for server-side API routes with `flushAt: 1` / `flushInterval: 0` to ensure immediate event delivery.
- **`next.config.ts`**: Added `/ingest` rewrites to proxy PostHog requests through the app, reducing tracking-blocker interference.
- **`.env.local`**: Added `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`.
- **`components/login.tsx`**: Added `posthog.identify()` and `user_signed_in` / `user_signed_up` captures on successful auth. Passes `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` headers to correlate client sessions with server-side events. Added `posthog.captureException()` in the error handler.
- **`pages/pricing.tsx`**: Added `checkout_started` capture in `PricingCard.handleSubmit` with plan name, price, and interval properties. Passes PostHog session headers to the checkout API. Added exception capture on error.
- **`pages/api/auth/sign-in.ts`**: Added server-side `posthog.identify()` and `user_signed_in` capture, using `$anon_distinct_id` to merge the anonymous client session.
- **`pages/api/auth/sign-up.ts`**: Added server-side `posthog.identify()` and `user_signed_up` capture with `via_invitation` flag and `$anon_distinct_id` merge.
- **`pages/api/stripe/checkout.ts`**: Added `checkout_completed` capture with plan name, product ID, subscription ID, and status.
- **`pages/api/stripe/webhook.ts`**: Added `subscription_updated` and `subscription_cancelled` captures. Looks up the team owner's email from the database to use as the PostHog distinct ID for proper user correlation.
- **`pages/api/team/invite.ts`**: Added `team_member_invited` capture with invited email, role, and team ID.
- **`pages/api/team/remove-member.ts`**: Added `team_member_removed` capture with member ID and team ID.
- **`pages/api/account/update.ts`**: Added `account_updated` capture with updated name and email.
- **`pages/api/stripe/customer-portal.ts`**: Added `customer_portal_accessed` capture with plan name and subscription status.

## Events

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signs in to their account | `components/login.tsx`, `pages/api/auth/sign-in.ts` |
| `user_signed_up` | User successfully creates a new account | `components/login.tsx`, `pages/api/auth/sign-up.ts` |
| `checkout_started` | User initiates a Stripe checkout session from the pricing page | `pages/pricing.tsx` |
| `checkout_completed` | Stripe checkout succeeds and team subscription is activated | `pages/api/stripe/checkout.ts` |
| `subscription_updated` | Stripe webhook fires when a subscription is updated | `pages/api/stripe/webhook.ts` |
| `subscription_cancelled` | Stripe webhook fires when a subscription is deleted/cancelled | `pages/api/stripe/webhook.ts` |
| `team_member_invited` | Team owner sends an invitation to a new team member | `pages/api/team/invite.ts` |
| `team_member_removed` | Team owner removes a member from the team | `pages/api/team/remove-member.ts` |
| `account_updated` | User updates their account name or email in general settings | `pages/api/account/update.ts` |
| `customer_portal_accessed` | User opens the Stripe customer portal to manage their subscription | `pages/api/stripe/customer-portal.ts` |

## Next steps

We've set up all the instrumentation needed to build powerful analytics. Here are the recommended insights to create on your PostHog dashboard — head to **[PostHog → Insights](https://us.posthog.com/project/2/insights)** to build them:

1. **Signup → Subscription conversion funnel** — Funnel insight with steps: `user_signed_up` → `checkout_started` → `checkout_completed`. This shows your core conversion rate.
2. **New signups over time** — Trend insight tracking `user_signed_up` daily. Your top-of-funnel health metric.
3. **Subscription events** — Trend insight with `checkout_completed`, `subscription_updated`, and `subscription_cancelled` on the same chart. Monitor revenue churn signals.
4. **Daily active users** — Trend insight tracking `user_signed_in` over time. A proxy for engagement and retention.
5. **Team growth** — Trend insight with `team_member_invited` and `team_member_removed`. Indicates product-led growth and churn within teams.

Create a **[new dashboard](https://us.posthog.com/project/2/dashboard/new)** named "Analytics basics" and add these five insights to it.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
