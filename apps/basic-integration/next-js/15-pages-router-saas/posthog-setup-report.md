<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router SaaS app. The following changes were made:

- **`instrumentation-client.ts`** (new) — Initialises `posthog-js` once for the browser via Next.js 15's instrumentation hook, with a reverse-proxy `api_host`, exception capture enabled, and debug mode in development.
- **`next.config.ts`** — Added `/ingest/*` rewrites so all PostHog traffic flows through the same origin (no ad-blocker exposure), including the required `/ingest/static/*` and `/ingest/array/*` asset routes.
- **`lib/posthog-server.ts`** (new) — Lazy-initialised singleton `posthog-node` client shared by all API routes, with `flushAt: 1` and `flushInterval: 0` so events are sent immediately in a serverless context.
- **`components/login.tsx`** — On successful sign-in/sign-up: passes the anonymous `distinct_id` and session ID to the API via headers (for server-side correlation), calls `posthog.identify()` to link the session to the user's email, and captures `user_signed_in`. Error path calls `posthog.captureException()`.
- **`components/header.tsx`** — Captures `user_signed_out` and calls `posthog.reset()` before clearing the session.
- **`pages/pricing.tsx`** — Captures `checkout_started` (with `price_id` and `plan_name`) when the user submits a pricing plan form. Error path calls `posthog.captureException()`.
- **`pages/dashboard/general.tsx`** — Captures `account_updated` on successful account save. Error path calls `posthog.captureException()`.
- **`pages/api/auth/sign-up.ts`** — Server-side: calls `posthog.identify()` and captures `user_signed_up` (with `role`, `via_invitation`, `teamId`), correlating with the browser session via `X-PostHog-Distinct-ID` header.
- **`pages/api/stripe/webhook.ts`** — Captures `subscription_updated` or `subscription_canceled` on Stripe webhook events, with subscription and plan metadata.
- **`pages/api/stripe/customer-portal.ts`** — Captures `customer_portal_opened` with team and plan details.
- **`pages/api/team/invite.ts`** — Captures `team_member_invited` with team, invited email role, and correlation header.
- **`pages/api/team/remove-member.ts`** — Captures `team_member_removed` with team and member details.

| Event | Description | File |
|---|---|---|
| `user_signed_up` | Fired on the server when a new user account is successfully created. | `pages/api/auth/sign-up.ts` |
| `user_signed_in` | Fired on the client when a user successfully signs in. | `components/login.tsx` |
| `user_signed_out` | Fired on the client when a user signs out. | `components/header.tsx` |
| `checkout_started` | Fired on the client when a user clicks to start a Stripe checkout session. | `pages/pricing.tsx` |
| `subscription_updated` | Fired on the server when a Stripe subscription status changes via webhook. | `pages/api/stripe/webhook.ts` |
| `subscription_canceled` | Fired on the server when a Stripe subscription is canceled via webhook. | `pages/api/stripe/webhook.ts` |
| `customer_portal_opened` | Fired on the server when a user opens the Stripe customer billing portal. | `pages/api/stripe/customer-portal.ts` |
| `team_member_invited` | Fired on the server when a team member invitation is sent. | `pages/api/team/invite.ts` |
| `team_member_removed` | Fired on the server when a team member is removed from the team. | `pages/api/team/remove-member.ts` |
| `account_updated` | Fired on the client when a user saves changes to their account information. | `pages/dashboard/general.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1761182)
- [Sign-ups over time](https://us.posthog.com/project/483112/insights/jRkEBfjK)
- [Sign-in vs Sign-up funnel](https://us.posthog.com/project/483112/insights/oyF1IctZ)
- [Checkout started over time](https://us.posthog.com/project/483112/insights/fAkMCyTB)
- [Subscription changes](https://us.posthog.com/project/483112/insights/YIOQvuAd)
- [Team collaboration activity](https://us.posthog.com/project/483112/insights/pnUt41Ej)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
