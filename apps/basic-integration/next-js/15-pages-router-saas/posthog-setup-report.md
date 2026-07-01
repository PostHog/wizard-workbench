<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router SaaS project. The following changes were made:

- **`instrumentation-client.ts`** — Created to initialize PostHog client-side using `posthog-js`. Uses a reverse proxy (`/ingest`) to improve reliability and enables error tracking via `capture_exceptions`.
- **`next.config.ts`** — Added rewrites for `/ingest/static/*`, `/ingest/array/*`, and `/ingest/*` to route PostHog traffic through the app as a reverse proxy.
- **`lib/posthog-server.ts`** — Created a singleton server-side PostHog client using `posthog-node` (with `flushAt: 1` and `flushInterval: 0` for immediate flushing in serverless handlers).
- **`.env.local`** — Added `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`.
- **`components/login.tsx`** — Added `posthog.identify()` after successful sign-in/sign-up, passes `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` headers to the auth API for client/server correlation, and adds `posthog.captureException()` on fetch errors.
- **`components/header.tsx`** — Added `posthog.reset()` on sign-out to unlink the session from the user profile.
- **`pages/pricing.tsx`** — Captures `pricing_plan_selected` before checkout redirect; passes correlation headers to `/api/stripe/create-checkout`.
- **`pages/dashboard/index.tsx`** — Captures `manage_subscription_clicked`, `team_member_invite_submitted`, and `team_member_removed` in the respective event handlers.
- **`pages/dashboard/general.tsx`** — Captures `account_updated` after a successful account save.
- **`pages/api/auth/sign-in.ts`** — Server-side `user_signed_in` event + `posthog.identify()` using the client's distinct ID from request headers.
- **`pages/api/auth/sign-up.ts`** — Server-side `user_signed_up` event + `posthog.identify()` using the client's distinct ID from request headers.
- **`pages/api/auth/sign-out.ts`** — Server-side `user_signed_out` event; reads user from session before clearing the cookie.
- **`pages/api/stripe/create-checkout.ts`** — Server-side `checkout_session_created` event with price and team context.
- **`pages/api/stripe/webhook.ts`** — Server-side `subscription_updated` and `subscription_cancelled` events fired from the Stripe webhook.
- **`pages/api/stripe/customer-portal.ts`** — Server-side `customer_portal_accessed` event.

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `pricing_plan_selected` | User clicks 'Get Started' on a pricing plan card to initiate checkout. | `pages/pricing.tsx` |
| `manage_subscription_clicked` | User clicks the 'Manage Subscription' button to open the Stripe customer portal. | `pages/dashboard/index.tsx` |
| `team_member_invite_submitted` | User submits the invite form to add a new team member. | `pages/dashboard/index.tsx` |
| `team_member_removed` | User removes a member from the team. | `pages/dashboard/index.tsx` |
| `account_updated` | User saves changes to their account name or email. | `pages/dashboard/general.tsx` |
| `user_signed_up` | New user successfully created an account. | `pages/api/auth/sign-up.ts` |
| `user_signed_in` | Existing user successfully authenticated. | `pages/api/auth/sign-in.ts` |
| `user_signed_out` | User signed out and their session was cleared. | `pages/api/auth/sign-out.ts` |
| `checkout_session_created` | A Stripe checkout session was created for a user selecting a plan. | `pages/api/stripe/create-checkout.ts` |
| `subscription_updated` | A team's subscription status changed via Stripe webhook. | `pages/api/stripe/webhook.ts` |
| `subscription_cancelled` | A team's subscription was cancelled via Stripe webhook. | `pages/api/stripe/webhook.ts` |
| `customer_portal_accessed` | A Stripe customer portal session was created for subscription management. | `pages/api/stripe/customer-portal.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1787406)
  - Signup to Checkout Funnel — `user_signed_up` → `pricing_plan_selected` → `checkout_session_created`
  - New Signups Over Time — daily trend of `user_signed_up`
  - Subscription Cancellations — daily trend of `subscription_cancelled`
  - Team Growth — daily trend of `team_member_invite_submitted`
  - Active Users (Sign-ins) — unique daily users via `user_signed_in`

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`, `NEXT_PUBLIC_POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
