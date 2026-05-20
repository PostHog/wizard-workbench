<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router SaaS project. Here is a summary of all changes made:

## What was set up

**Client-side initialization** (`instrumentation-client.ts`) — PostHog is initialized using Next.js 15's `instrumentation-client.ts` convention. This enables automatic session replay, error tracking (`capture_exceptions: true`), and pageview tracking via a reverse proxy (`/ingest`).

**Reverse proxy** (`next.config.ts`) — All PostHog requests are routed through `/ingest` to reduce ad-blocker interference, with separate rewrites for `/ingest/static/*`, `/ingest/array/*`, and `/ingest/*`.

**Server-side client** (`lib/posthog-server.ts`) — A lightweight `getPostHogClient()` helper creates a `posthog-node` client configured for short-lived server functions (`flushAt: 1`, `flushInterval: 0`).

**User identification** (`app/(login)/login.tsx`) — `posthog.identify(email, { email })` is called client-side on every sign-in and sign-up form submission, linking anonymous sessions to known users before the server action runs.

**Event tracking** — 13 events were instrumented across 5 files (detailed below).

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User signs in successfully | `app/(login)/actions.ts` |
| `user_signed_up` | New user completes sign-up (includes `via_invitation` flag) | `app/(login)/actions.ts` |
| `user_signed_out` | User signs out | `app/(login)/actions.ts` |
| `account_updated` | User updates their name or email | `app/(login)/actions.ts` |
| `password_updated` | User successfully changes their password | `app/(login)/actions.ts` |
| `account_deleted` | User deletes their account (soft delete) | `app/(login)/actions.ts` |
| `team_member_invited` | Team owner sends an invitation | `app/(login)/actions.ts` |
| `team_member_removed` | Team member is removed from the team | `app/(login)/actions.ts` |
| `checkout_started` | User initiates a Stripe checkout session | `lib/payments/actions.ts` |
| `customer_portal_opened` | User opens the Stripe billing portal | `lib/payments/actions.ts` |
| `checkout_completed` | Stripe checkout succeeds and subscription is activated | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Stripe subscription is updated (renewal, plan change, etc.) | `app/api/stripe/webhook/route.ts` |
| `subscription_cancelled` | Stripe subscription is deleted/cancelled via webhook | `app/api/stripe/webhook/route.ts` |

## Next steps

We've designed five insights for an **"Analytics basics"** dashboard to keep an eye on the most important user behavior. Create the dashboard and add these insights:

**1. Sign-up to paid conversion funnel**
Tracks the key conversion path from account creation through to payment.
- [Open in PostHog →](https://us.posthog.com/project/2/insights/new?insight=FUNNELS&events=%5B%7B%22id%22%3A%22user_signed_up%22%2C%22type%22%3A%22events%22%7D%2C%7B%22id%22%3A%22checkout_started%22%2C%22type%22%3A%22events%22%7D%2C%7B%22id%22%3A%22checkout_completed%22%2C%22type%22%3A%22events%22%7D%5D)

**2. New sign-ups over time**
Daily count of `user_signed_up` events — your primary growth metric.
- [Open in PostHog →](https://us.posthog.com/project/2/insights/new?insight=TRENDS&events=%5B%7B%22id%22%3A%22user_signed_up%22%2C%22type%22%3A%22events%22%7D%5D)

**3. Churn events over time**
Tracks `account_deleted` and `subscription_cancelled` together to monitor churn signals.
- [Open in PostHog →](https://us.posthog.com/project/2/insights/new?insight=TRENDS&events=%5B%7B%22id%22%3A%22account_deleted%22%2C%22type%22%3A%22events%22%7D%2C%7B%22id%22%3A%22subscription_cancelled%22%2C%22type%22%3A%22events%22%7D%5D)

**4. Checkout funnel drop-off**
Compares `checkout_started` vs `checkout_completed` to identify payment friction.
- [Open in PostHog →](https://us.posthog.com/project/2/insights/new?insight=TRENDS&events=%5B%7B%22id%22%3A%22checkout_started%22%2C%22type%22%3A%22events%22%7D%2C%7B%22id%22%3A%22checkout_completed%22%2C%22type%22%3A%22events%22%7D%5D)

**5. Team growth — invitations sent**
Tracks `team_member_invited` over time to understand viral/team-led growth.
- [Open in PostHog →](https://us.posthog.com/project/2/insights/new?insight=TRENDS&events=%5B%7B%22id%22%3A%22team_member_invited%22%2C%22type%22%3A%22events%22%7D%5D)

Create a new dashboard at: https://us.posthog.com/project/2/dashboards

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
