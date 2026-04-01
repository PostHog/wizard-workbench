<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router SaaS application. The integration covers client-side initialization via `instrumentation-client.ts`, server-side event capture on all critical API routes, user identification on both frontend and backend, and PostHog exception capture on key error boundaries.

**Summary of changes:**

- **`instrumentation-client.ts`** (new) — Initializes `posthog-js` on the client with the reverse proxy host, exception capture enabled, and debug mode in development.
- **`next.config.ts`** — Added `/ingest` rewrites to proxy PostHog requests through the Next.js server, reducing ad-blocker interference.
- **`lib/posthog-server.ts`** (new) — Singleton `posthog-node` client for server-side event capture, configured for immediate flushing (`flushAt: 1, flushInterval: 0`).
- **`.env.local`** — Added `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables.
- **`components/login.tsx`** — Sends `X-POSTHOG-DISTINCT-ID` / `X-POSTHOG-SESSION-ID` headers to correlate client and server events; calls `posthog.identify()` and captures `user_signed_in` / `user_signed_up` on success; captures exceptions on error.
- **`pages/pricing.tsx`** — Captures `checkout_initiated` (with plan name, price ID, interval) when a user clicks "Get Started"; captures exceptions on checkout error.
- **`pages/api/auth/sign-in.ts`** — Server-side `posthog.identify()` and `user_signed_in` capture with anonymous ID linking; returns `userId` in response for client-side identify.
- **`pages/api/auth/sign-up.ts`** — Server-side `posthog.identify()` and `user_signed_up` capture with anonymous ID linking and invited flag; returns `userId` in response.
- **`pages/api/stripe/webhook.ts`** — Captures `subscription_updated` and `subscription_cancelled` on Stripe webhook events, looking up the team owner as the distinct ID.
- **`pages/api/stripe/create-checkout.ts`** — Captures `checkout_session_created` with price ID and team ID after a successful Stripe session creation.
- **`pages/api/stripe/customer-portal.ts`** — Captures `customer_portal_accessed` when a user opens the Stripe billing portal.
- **`pages/api/team/invite.ts`** — Captures `team_member_invited` with invited email, role, and team ID.
- **`pages/api/team/remove-member.ts`** — Captures `team_member_removed` with removed member ID and team ID.
- **`pages/dashboard/general.tsx`** — Captures `account_updated` with new name and email after a successful account save; captures exceptions on error.

## Events

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signs in to their account | `components/login.tsx`, `pages/api/auth/sign-in.ts` |
| `user_signed_up` | User successfully creates a new account | `components/login.tsx`, `pages/api/auth/sign-up.ts` |
| `checkout_initiated` | User clicks 'Get Started' on a pricing plan | `pages/pricing.tsx` |
| `checkout_session_created` | Server creates a Stripe checkout session | `pages/api/stripe/create-checkout.ts` |
| `subscription_updated` | Stripe webhook: subscription updated | `pages/api/stripe/webhook.ts` |
| `subscription_cancelled` | Stripe webhook: subscription cancelled | `pages/api/stripe/webhook.ts` |
| `customer_portal_accessed` | User opens the Stripe billing portal | `pages/api/stripe/customer-portal.ts` |
| `team_member_invited` | Team owner invites a new member | `pages/api/team/invite.ts` |
| `team_member_removed` | Team owner removes a member from the team | `pages/api/team/remove-member.ts` |
| `account_updated` | User updates account info in general settings | `pages/dashboard/general.tsx` |

## Next steps

The API key provided does not have `dashboard:write` or `insight:write` scopes, so the dashboard could not be created automatically. To set up the recommended **"Analytics basics"** dashboard in PostHog, navigate to your project and create the following 5 insights:

1. **Signup-to-Checkout Funnel** (Funnel insight) — Steps: `user_signed_up` → `checkout_initiated` → `checkout_session_created`. Tracks how many new users proceed through the pricing conversion funnel.

2. **New Signups Over Time** (Trend insight) — Event: `user_signed_up`. Shows daily/weekly growth in new user registrations.

3. **Subscription Cancellations** (Trend insight) — Event: `subscription_cancelled`. Monitors churn — spikes indicate billing or product issues.

4. **Team Invitations Sent** (Trend insight) — Event: `team_member_invited`. Tracks team growth and collaboration adoption.

5. **Checkout Drop-off** (Funnel insight) — Steps: `checkout_initiated` → `checkout_session_created` → `subscription_updated` (status = active). Shows where users drop off in the payment flow.

Your PostHog project: https://us.posthog.com/project/238460

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
