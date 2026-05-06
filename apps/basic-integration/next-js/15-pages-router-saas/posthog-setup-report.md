<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router SaaS application. Here is a summary of all changes made:

- **`instrumentation-client.ts`** (new): Initializes `posthog-js` client-side via Next.js instrumentation. Uses a reverse proxy (`/ingest`) for improved ad-blocker resilience, enables exception capture, and sets the `defaults: '2026-01-30'` baseline.
- **`next.config.ts`**: Added `/ingest/*` reverse proxy rewrites routing PostHog traffic through the Next.js server (`us-assets.i.posthog.com` for static/array assets, `us.i.posthog.com` for events). Also added `skipTrailingSlashRedirect: true`.
- **`lib/posthog-server.ts`** (new): Singleton `posthog-node` client for server-side event capture, configured with `flushAt: 1` and `flushInterval: 0` for immediate flushing in short-lived API routes.
- **`components/login.tsx`**: Captures `signed_in` / `signed_up` events and calls `posthog.identify()` on successful auth. Sends `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` headers to the API for server-client correlation. Adds `captureException` in the error handler.
- **`components/header.tsx`**: Captures `signed_out` event and calls `posthog.reset()` on sign-out to unlink future events from the current user.
- **`pages/pricing.tsx`**: Captures `checkout_started` with plan name, price, and interval before redirecting to Stripe checkout. Adds `captureException` in the error handler.
- **`pages/dashboard/general.tsx`**: Captures `account_updated` with name and email on successful account info update. Adds `captureException` in the error handler.
- **`pages/api/auth/sign-in.ts`**: Server-side `posthog.identify()` and `signed_in` event capture using the user's email as `distinctId`. Aliases the anonymous client distinct ID (from `X-POSTHOG-DISTINCT-ID` header) to the user's email for pre-login event correlation.
- **`pages/api/auth/sign-up.ts`**: Server-side `posthog.identify()` and `signed_up` event capture on new user creation. Aliases anonymous client ID to the user's email. Includes `invited` property for invite-flow signups.
- **`pages/api/stripe/checkout.ts`**: Captures `checkout_completed` server-side with plan name, price ID, subscription ID, and customer ID after successful Stripe checkout session retrieval.
- **`pages/api/stripe/webhook.ts`**: Captures `subscription_updated` and `subscription_cancelled` events in the Stripe webhook handler with subscription and customer details.
- **`pages/api/stripe/customer-portal.ts`**: Captures `customer_portal_accessed` server-side after creating a Stripe customer portal session.
- **`pages/api/team/invite.ts`**: Captures `team_member_invited` server-side with team ID, invited email, and role.
- **`pages/api/team/remove-member.ts`**: Captures `team_member_removed` server-side with team ID and removed member ID.

## Events

| Event | Description | File |
|-------|-------------|------|
| `signed_in` | User successfully signed in to their account | `components/login.tsx`, `pages/api/auth/sign-in.ts` |
| `signed_up` | User successfully created a new account | `components/login.tsx`, `pages/api/auth/sign-up.ts` |
| `signed_out` | User signed out of their account | `components/header.tsx` |
| `checkout_started` | User initiated the checkout process from the pricing page | `pages/pricing.tsx` |
| `checkout_completed` | User successfully completed a Stripe checkout session | `pages/api/stripe/checkout.ts` |
| `subscription_updated` | A subscription was updated via Stripe webhook | `pages/api/stripe/webhook.ts` |
| `subscription_cancelled` | A subscription was cancelled via Stripe webhook | `pages/api/stripe/webhook.ts` |
| `customer_portal_accessed` | User accessed the Stripe customer portal to manage their subscription | `pages/api/stripe/customer-portal.ts` |
| `team_member_invited` | A team member was invited to join the team | `pages/api/team/invite.ts` |
| `team_member_removed` | A team member was removed from the team | `pages/api/team/remove-member.ts` |
| `account_updated` | User updated their account information (name or email) | `pages/dashboard/general.tsx` |

## Next steps

We've outlined five key insights to build in PostHog for monitoring your SaaS metrics. Visit your PostHog project to create these insights in a new "Analytics basics" dashboard:

- **[View all dashboards](https://us.posthog.com/project/2/dashboards)** — Create a new dashboard called "Analytics basics" and add the following insights:

1. **Sign-up to checkout conversion funnel** — A Funnel insight with steps: `signed_up` → `checkout_started` → `checkout_completed`. Shows where users drop off in your conversion funnel.

2. **New signups over time** — A Trends insight tracking `signed_up` unique users over time. Your primary growth metric.

3. **Active subscriptions & churn** — A Trends insight showing `subscription_updated` vs `subscription_cancelled` events over time. Monitor churn and plan changes.

4. **Sign-in vs sign-up ratio** — A Trends insight comparing `signed_in` and `signed_up` event counts. Understand your returning-to-new user ratio.

5. **Team growth: invites sent** — A Trends insight tracking `team_member_invited` over time. Indicates product-led growth through team expansion.

All insights can be added directly from **[New insight](https://us.posthog.com/project/2/insights/new)**.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
