<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js 15 Pages Router SaaS application. Here's a summary of all changes made:

## What was set up

### Client-side initialization
- **`instrumentation-client.ts`** (new file) — Initializes PostHog via the recommended Next.js 15.3+ `instrumentation-client` pattern. Enables automatic pageview tracking, session replay, and error tracking via `capture_exceptions: true`.

### Reverse proxy
- **`next.config.ts`** — Added `/ingest` rewrites so PostHog requests route through your own domain, making them less likely to be blocked by ad-blockers.

### Server-side client
- **`lib/posthog-server.ts`** (new file) — Singleton PostHog Node.js client used by all API routes for server-side event capture.

### Environment variables
- **`.env.local`** — Added `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST`.

### Event tracking added across the codebase

| Event Name | Description | File |
|---|---|---|
| `user_signed_up` | Fired on the client when signup succeeds; also server-side with `identify()` | `components/login.tsx`, `pages/api/auth/sign-up.ts` |
| `user_signed_in` | Fired on the client when sign-in succeeds; also server-side with `identify()` | `components/login.tsx`, `pages/api/auth/sign-in.ts` |
| `user_signed_out` | Fired client-side before PostHog `reset()`; also server-side | `components/header.tsx`, `pages/api/auth/sign-out.ts` |
| `checkout_initiated` | Fired when user clicks "Get Started" on the pricing page | `pages/pricing.tsx` |
| `checkout_session_created` | Server-side event when a Stripe checkout session is successfully created | `pages/api/stripe/create-checkout.ts` |
| `subscription_updated` | Server-side event fired via Stripe webhook when a subscription changes | `pages/api/stripe/webhook.ts` |
| `subscription_cancelled` | Server-side event fired via Stripe webhook when a subscription is cancelled | `pages/api/stripe/webhook.ts` |
| `team_member_invited` | Server-side event when a team owner sends an invitation | `pages/api/team/invite.ts` |
| `account_updated` | Fired when a user successfully updates their name/email in General Settings | `pages/dashboard/general.tsx` |
| `customer_portal_opened` | Server-side event when a user opens the Stripe billing portal | `pages/api/stripe/customer-portal.ts` |

### User identification
- On sign-in and sign-up: `posthog.identify(email, { email })` is called client-side to link the PostHog anonymous ID to the user
- Server-side handlers read the `X-POSTHOG-DISTINCT-ID` header (sent from client) to correlate server events with the same user identity
- On sign-out: `posthog.reset()` clears the client-side identity

### Error tracking
- `posthog.captureException()` added in catch blocks across: `components/login.tsx`, `components/header.tsx`, `pages/pricing.tsx`, and `pages/dashboard/general.tsx`

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics:** https://us.posthog.com/project/2/dashboard/1274416
- **User Signups trend:** https://us.posthog.com/project/2/insights/4XjdN4fT
- **Daily Active Users (sign-ins):** https://us.posthog.com/project/2/insights/Z4MJ13Bd
- **Checkout Conversion Funnel:** https://us.posthog.com/project/2/insights/4gI2V1F8
- **Subscription Cancellations (Churn):** https://us.posthog.com/project/2/insights/t1ax7H7E
- **Account Deletions trend:** https://us.posthog.com/project/2/insights/Qtdf9d91

> **Tip:** Update the funnel insight (4gI2V1F8) to use the new event names: `user_signed_up` → `checkout_initiated` → `checkout_session_created` for a full signup-to-checkout conversion view.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
