<wizard-report>
# PostHog post-wizard report

The wizard has completed a full PostHog integration for this Next.js 15 SaaS application (Pages Router). The following changes were made:

- **`instrumentation-client.ts`** (new): Initializes `posthog-js` with reverse proxy support, automatic exception capture, and debug mode in development.
- **`lib/posthog-server.ts`** (new): Singleton `posthog-node` client for server-side event tracking across API routes.
- **`next.config.ts`**: Added `/ingest` reverse proxy rewrites to reduce ad-blocker interference and `skipTrailingSlashRedirect: true`.
- **`.env.local`**: Added `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables.
- **`components/login.tsx`**: Tracks sign-in/sign-up form submissions, calls `posthog.identify()` on successful auth, passes `X-PostHog-Distinct-ID` and `X-PostHog-Session-ID` headers to correlate client and server events.
- **`pages/pricing.tsx`**: Tracks checkout initiation with plan name and price details.
- **`pages/api/auth/sign-in.ts`**: Server-side user identification and sign-in event.
- **`pages/api/auth/sign-up.ts`**: Server-side user identification and sign-up event (including invite flow tracking).
- **`pages/api/auth/sign-out.ts`**: Server-side sign-out event.
- **`pages/api/stripe/create-checkout.ts`**: Tracks checkout session creation.
- **`pages/api/stripe/webhook.ts`**: Tracks subscription updates and cancellations from Stripe webhooks.
- **`pages/api/stripe/customer-portal.ts`**: Tracks customer portal access.
- **`pages/api/team/invite.ts`**: Tracks team member invitations with role and email.
- **`pages/api/team/remove-member.ts`**: Tracks team member removals.
- **`pages/api/account/update.ts`**: Tracks account profile updates and keeps the PostHog person profile in sync.

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `sign_in_submitted` | User submitted the sign-in form (client-side) | `components/login.tsx` |
| `sign_up_submitted` | User submitted the sign-up form (client-side) | `components/login.tsx` |
| `user_signed_in` | User successfully signed in (server-side) | `pages/api/auth/sign-in.ts` |
| `user_signed_up` | New user successfully registered (server-side) | `pages/api/auth/sign-up.ts` |
| `user_signed_out` | User signed out (server-side) | `pages/api/auth/sign-out.ts` |
| `checkout_initiated` | User clicked "Get Started" on a pricing plan | `pages/pricing.tsx` |
| `checkout_session_created` | Stripe checkout session created (server-side) | `pages/api/stripe/create-checkout.ts` |
| `subscription_updated` | Stripe subscription updated via webhook | `pages/api/stripe/webhook.ts` |
| `subscription_cancelled` | Stripe subscription cancelled via webhook | `pages/api/stripe/webhook.ts` |
| `customer_portal_opened` | User opened the Stripe billing portal | `pages/api/stripe/customer-portal.ts` |
| `team_member_invited` | Team owner sent an invitation | `pages/api/team/invite.ts` |
| `team_member_removed` | Team member was removed | `pages/api/team/remove-member.ts` |
| `account_updated` | User updated their profile | `pages/api/account/update.ts` |

## Next steps

We've instrumented key events across your SaaS funnel. To explore the data, we recommend building these insights in PostHog:

1. **Signup-to-subscription conversion funnel** – Create a funnel insight: `sign_up_submitted` → `user_signed_up` → `checkout_initiated` → `checkout_session_created` → `subscription_updated`
2. **New signups over time** – Trend chart of `user_signed_up` to track growth
3. **Checkout initiation rate** – Trend chart of `checkout_initiated` vs `user_signed_up`
4. **Subscription churn** – Trend chart of `subscription_cancelled` to monitor churn
5. **Team activity** – Trend chart of `team_member_invited` to measure collaboration & virality

You can navigate to your PostHog project at [https://us.posthog.com/project/2](https://us.posthog.com/project/2) to build these insights and create an "Analytics basics" dashboard.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
