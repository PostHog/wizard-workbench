<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router SaaS application. The integration covers client-side and server-side event tracking, user identification with identity correlation, error capture, and a reverse proxy for reliable event ingestion.

**Files created:**
- `instrumentation-client.ts` — Initializes posthog-js for all client pages via Next.js instrumentation. Enables exception capture, debug mode in development, and routes events through the `/ingest` reverse proxy.
- `lib/posthog-server.ts` — Singleton server-side PostHog client (posthog-node) used in API routes.
- `.env.local` — PostHog public token and host environment variables.

**Files modified:**
- `next.config.ts` — Added `/ingest/*` rewrites to proxy PostHog traffic through Next.js, avoiding ad-blockers.
- `components/login.tsx` — Identifies users and captures `user_signed_in` / `user_signed_up` on successful auth. Passes `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` headers to the API so server events share the same identity. Error capture on unexpected failures.
- `components/header.tsx` — Captures `user_signed_out` and calls `posthog.reset()` to clear the anonymous session on sign-out.
- `pages/pricing.tsx` — Captures `checkout_started` with plan name, price, and interval when the user clicks "Get Started".
- `pages/dashboard/index.tsx` — Captures `subscription_management_opened` (with plan/status), `team_member_invited` (with email and role), and `team_member_removed` (with member ID).
- `pages/dashboard/general.tsx` — Captures `account_updated` after successful save.
- `pages/api/auth/sign-in.ts` — Server-side `posthog.identify()` + `alias()` to link anonymous client distinct ID to user's email on sign-in.
- `pages/api/auth/sign-up.ts` — Server-side `posthog.identify()` + `alias()` to link anonymous client distinct ID to user's email on sign-up.
- `pages/api/stripe/create-checkout.ts` — Captures `checkout_session_created` server-side using the user's email as distinct ID.
- `pages/api/stripe/webhook.ts` — Captures `subscription_updated` and `subscription_cancelled` server-side on Stripe webhook events.

## Event tracking summary

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signed in | `components/login.tsx` |
| `user_signed_up` | User successfully created a new account | `components/login.tsx` |
| `user_signed_out` | User signed out of their account | `components/header.tsx` |
| `checkout_started` | User clicked "Get Started" on a pricing plan | `pages/pricing.tsx` |
| `subscription_management_opened` | User opened Stripe customer portal | `pages/dashboard/index.tsx` |
| `team_member_invited` | User sent an invitation to a new team member | `pages/dashboard/index.tsx` |
| `team_member_removed` | User removed a member from the team | `pages/dashboard/index.tsx` |
| `account_updated` | User saved updated account information | `pages/dashboard/general.tsx` |
| `subscription_updated` | Stripe webhook: subscription was updated | `pages/api/stripe/webhook.ts` |
| `subscription_cancelled` | Stripe webhook: subscription was cancelled | `pages/api/stripe/webhook.ts` |
| `checkout_session_created` | Server-side: Stripe checkout session created | `pages/api/stripe/create-checkout.ts` |

## Next steps

We attempted to create an "Analytics basics" dashboard automatically, but the PostHog API key used by this integration is missing the `dashboard:write`, `insight:write`, and `query:read` scopes required to create it programmatically. To create the dashboard manually, visit your [PostHog project dashboards](/dashboard) and add the following insights:

1. **Signup → Checkout → Subscription Funnel** — Funnel insight: `user_signed_up` → `checkout_started` → `checkout_session_created`. Shows where users drop off in the conversion path.
2. **Daily signups trend** — Trends insight: `user_signed_up` over time. Track new user acquisition.
3. **Checkout started by plan** — Trends insight: `checkout_started` broken down by `plan_name`. See which pricing tier drives the most intent.
4. **Subscription lifecycle** — Trends insight: `subscription_updated` and `subscription_cancelled` over time. Monitor churn signals.
5. **Team collaboration activity** — Trends insight: `team_member_invited` over time. Gauge product-led growth through team expansion.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
