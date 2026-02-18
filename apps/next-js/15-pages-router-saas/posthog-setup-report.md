<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 Pages Router SaaS application. Here is a summary of all changes made:

## Files created

- **`instrumentation-client.ts`** — Initialises PostHog client-side via Next.js instrumentation hook. Uses a reverse proxy (`/ingest`) for improved reliability, enables automatic exception capture (`capture_exceptions: true`), and turns on debug mode in development.
- **`lib/posthog-server.ts`** — A singleton helper that creates and reuses a `posthog-node` client for server-side event capture in API routes. Configured with `flushAt: 1` and `flushInterval: 0` for immediate delivery from short-lived serverless functions.

## Files modified

- **`next.config.ts`** — Added `/ingest` rewrites to proxy PostHog requests through the Next.js server (avoids ad-blocker interception). Also set `skipTrailingSlashRedirect: true` as required by PostHog.
- **`components/login.tsx`** — On successful sign-in or sign-up, calls `posthog.identify()` with the user's email and captures `user_signed_in` / `user_signed_up`. Added `posthog.captureException()` in the catch block.
- **`components/header.tsx`** — Before signing out, captures `user_signed_out` and calls `posthog.reset()` to disassociate the PostHog identity.
- **`pages/pricing.tsx`** — Captures `checkout_initiated` (with plan name, price ID, amount, and billing interval) when the user clicks "Get Started" on a pricing card. Added `posthog.captureException()` in the catch block.
- **`pages/dashboard/index.tsx`** — Captures `customer_portal_opened` (with current plan name and subscription status) when the user clicks "Manage Subscription".
- **`pages/dashboard/general.tsx`** — Captures `account_updated` (with updated name and email) after a successful account information save. Added `posthog.captureException()` in the catch block.
- **`pages/api/stripe/checkout.ts`** — Server-side: captures `checkout_completed` after a Stripe checkout session is successfully processed, using the user's email as the distinct ID.
- **`pages/api/stripe/webhook.ts`** — Server-side: captures `subscription_changed` when Stripe fires `customer.subscription.updated` or `customer.subscription.deleted` webhook events.
- **`pages/api/team/invite.ts`** — Server-side: captures `team_member_invited` (with invited email, role, and team ID) after an invitation is successfully created.
- **`pages/api/team/remove-member.ts`** — Server-side: captures `team_member_removed` (with removed member ID and team ID) after a team member is deleted.

## Environment variables

Added to `.env.local`:
- `NEXT_PUBLIC_POSTHOG_KEY` — Your PostHog project API key
- `NEXT_PUBLIC_POSTHOG_HOST` — PostHog ingest host (`https://us.i.posthog.com`)

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signs in | `components/login.tsx` |
| `user_signed_up` | User creates a new account | `components/login.tsx` |
| `user_signed_out` | User signs out of their account | `components/header.tsx` |
| `checkout_initiated` | User clicks "Get Started" on a pricing plan | `pages/pricing.tsx` |
| `checkout_completed` | Stripe checkout session completed successfully | `pages/api/stripe/checkout.ts` |
| `subscription_changed` | Stripe subscription updated or deleted via webhook | `pages/api/stripe/webhook.ts` |
| `team_member_invited` | Team owner sends a team invitation | `pages/api/team/invite.ts` |
| `team_member_removed` | Team owner removes a team member | `pages/api/team/remove-member.ts` |
| `account_updated` | User updates their account information | `pages/dashboard/general.tsx` |
| `customer_portal_opened` | User opens the Stripe customer portal | `pages/dashboard/index.tsx` |

## Next steps

To explore your data, visit your PostHog project and create insights and dashboards based on the events above. Some recommended insights:

- **Sign-up → Checkout funnel**: `user_signed_up` → `checkout_initiated` → `checkout_completed`
- **Churn monitoring**: trend of `subscription_changed` where `event_type = customer.subscription.deleted`
- **Team growth**: trend of `team_member_invited` over time
- **User retention**: active users by day/week using `user_signed_in`
- **Pricing page conversion**: `checkout_initiated` broken down by `plan_name`

Log in to PostHog at [https://us.posthog.com](https://us.posthog.com) to build these insights.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
