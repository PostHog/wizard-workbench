<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router SaaS starter. The integration covers client-side tracking, server-side tracking, user identification, session reset on logout, error tracking via `capture_exceptions`, and a reverse proxy to route PostHog requests through the app domain.

**Key changes made:**

- **`instrumentation-client.ts`** (new) — Initializes PostHog on the client using the Next.js 15.3+ instrumentation pattern. Enables error tracking (`capture_exceptions: true`) and routes events through the `/ingest` reverse proxy.
- **`lib/posthog-server.ts`** (new) — Singleton server-side PostHog client (`posthog-node`) for use in API routes.
- **`next.config.ts`** — Added reverse proxy rewrites for `/ingest/static/*`, `/ingest/array/*`, and `/ingest/*` to route PostHog traffic through the app domain, avoiding ad blockers.
- **`.env.local`** — Created with `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`.
- **`components/login.tsx`** — Calls `posthog.identify()` and captures `sign_in` or `sign_up` on successful authentication.
- **`components/header.tsx`** — Captures `sign_out` and calls `posthog.reset()` on logout to unlink future events from the user.
- **`pages/pricing.tsx`** — Captures `pricing_page_viewed` on mount (top of conversion funnel) and `checkout_started` when a plan's "Get Started" button is clicked.
- **`pages/dashboard/general.tsx`** — Captures `account_updated` after a successful name/email change.
- **`pages/dashboard/index.tsx`** — Captures `team_member_invited` after a successful invite and `manage_subscription_clicked` when the Stripe portal button is clicked.
- **`pages/api/auth/sign-in.ts`** — Server-side: identifies user and captures `server_sign_in`.
- **`pages/api/auth/sign-up.ts`** — Server-side: identifies new user and captures `server_sign_up`.
- **`pages/api/stripe/create-checkout.ts`** — Server-side: captures `checkout_session_created` after a Stripe session is created.
- **`pages/api/stripe/webhook.ts`** — Server-side: captures `subscription_changed` when Stripe sends subscription updated/deleted webhook events.

## Events

| Event | Description | File |
|---|---|---|
| `pricing_page_viewed` | User views the pricing page — top of the subscription conversion funnel | `pages/pricing.tsx` |
| `checkout_started` | User clicks "Get Started" on a pricing plan card to begin checkout | `pages/pricing.tsx` |
| `sign_in` | User successfully signs in to their account | `components/login.tsx` |
| `sign_up` | User successfully creates a new account | `components/login.tsx` |
| `sign_out` | User signs out of their account | `components/header.tsx` |
| `account_updated` | User successfully updates their account name or email in general settings | `pages/dashboard/general.tsx` |
| `team_member_invited` | Team owner successfully sends an invitation to a new team member | `pages/dashboard/index.tsx` |
| `manage_subscription_clicked` | User clicks "Manage Subscription" to open the Stripe customer portal | `pages/dashboard/index.tsx` |
| `server_sign_in` | Server-side: user authentication verified and session created | `pages/api/auth/sign-in.ts` |
| `server_sign_up` | Server-side: new user account and team created | `pages/api/auth/sign-up.ts` |
| `checkout_session_created` | Server-side: Stripe checkout session successfully created for a subscription plan | `pages/api/stripe/create-checkout.ts` |
| `subscription_changed` | Server-side: Stripe webhook triggered a subscription status change | `pages/api/stripe/webhook.ts` |

## Next steps

We've instrumented your key conversion and retention events. Visit PostHog to build dashboards and insights:

- [PostHog Dashboards](https://us.posthog.com/project/2/dashboard) — create a new "Analytics basics (wizard)" dashboard
- [New Insight](https://us.posthog.com/project/2/insights/new) — suggested insights to create:
  1. **Signup → Checkout funnel** — Funnel: `sign_up` → `pricing_page_viewed` → `checkout_started` → `checkout_session_created`
  2. **Sign-ins over time** — Trends: `sign_in` and `sign_up` counts over time
  3. **Active subscription changes** — Trends: `subscription_changed` broken down by `status` property
  4. **Team collaboration** — Trends: `team_member_invited` over time
  5. **Checkout drop-off** — Trends: `checkout_started` vs `checkout_session_created` to identify drop-off

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
