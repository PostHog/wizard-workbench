<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router SaaS application. Here's a summary of all changes made:

## Changes Made

### New Files Created
- **`instrumentation-client.ts`** — Client-side PostHog initialization using the recommended `instrumentation-client` approach for Next.js 15.3+. Configures a reverse proxy, exception capture, and debug mode.
- **`lib/posthog-server.ts`** — Server-side PostHog singleton client using `posthog-node` for API route tracking.
- **`.env.local`** — Environment variables `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` added.

### Modified Files
- **`next.config.ts`** — Added reverse proxy rewrites (`/ingest/*`) and `skipTrailingSlashRedirect: true` for reliable PostHog ingestion.
- **`components/login.tsx`** — Added `posthog.identify()` + event capture on login/signup success. Passes `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` headers to API for client-server correlation. Added `posthog.captureException()` on error.
- **`components/header.tsx`** — Added `posthog.capture('user_signed_out')` and `posthog.reset()` on sign-out.
- **`pages/api/auth/sign-in.ts`** — Server-side `user_signed_in` capture + `identify()` with client's anonymous ID for session correlation.
- **`pages/api/auth/sign-up.ts`** — Server-side `user_signed_up` and `invitation_accepted` captures + `identify()` with client's anonymous ID.
- **`pages/pricing.tsx`** — Client-side `checkout_started` capture on checkout form submit.
- **`pages/api/stripe/create-checkout.ts`** — Server-side `checkout_session_created` capture after Stripe session creation.
- **`pages/api/stripe/webhook.ts`** — Server-side `subscription_updated` capture for subscription lifecycle events.
- **`pages/api/team/invite.ts`** — Server-side `team_member_invited` capture after invitation is sent.
- **`pages/api/team/remove-member.ts`** — Server-side `team_member_removed` capture after member removal.
- **`pages/dashboard/general.tsx`** — Client-side `account_updated` capture after account info update. Added `posthog.captureException()` on error.

## Events Instrumented

| Event Name | Description | File |
|---|---|---|
| `user_signed_up` | User successfully creates a new account | `pages/api/auth/sign-up.ts`, `components/login.tsx` |
| `user_signed_in` | User successfully signs into their account | `pages/api/auth/sign-in.ts`, `components/login.tsx` |
| `user_signed_out` | User signs out of their account | `components/header.tsx` |
| `checkout_started` | User initiates a checkout flow from the pricing page | `pages/pricing.tsx` |
| `checkout_session_created` | Server creates a Stripe checkout session for a user | `pages/api/stripe/create-checkout.ts` |
| `subscription_updated` | Stripe webhook fires for a subscription update or deletion | `pages/api/stripe/webhook.ts` |
| `team_member_invited` | Team owner invites a new member to the team | `pages/api/team/invite.ts` |
| `team_member_removed` | Team owner removes a member from the team | `pages/api/team/remove-member.ts` |
| `account_updated` | User updates their account name or email | `pages/dashboard/general.tsx` |
| `invitation_accepted` | User signs up via an invitation link, joining an existing team | `pages/api/auth/sign-up.ts` |

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog with the following insights to monitor your key business metrics:

1. **Sign-up funnel** — Funnel from `checkout_started` → `checkout_session_created` → `subscription_updated` (status: active) to track checkout conversion rate.
2. **New user signups over time** — Trend of `user_signed_up` events to monitor user growth.
3. **Daily active users** — Unique users triggering `user_signed_in` per day.
4. **Team growth** — Trend of `team_member_invited` vs `invitation_accepted` to measure invitation conversion.
5. **Account engagement** — Trend of `account_updated` events as a proxy for active, engaged users.

Create these at: https://us.posthog.com/project/238460/insights/new

Your PostHog project dashboard: https://us.posthog.com/project/238460/dashboard

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
