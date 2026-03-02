<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your Next.js 15 Pages Router SaaS application. Here's a summary of what was set up:

**Client-side:** PostHog is initialized via `instrumentation-client.ts` (Next.js 15.3+ pattern) with automatic exception capture, a reverse proxy through `/ingest/*`, and session replay. Users are identified by email on sign-in and sign-up, and the anonymous session is correlated with their identified profile using the `X-POSTHOG-DISTINCT-ID` header.

**Server-side:** A singleton `posthog-node` client (`lib/posthog-server.ts`) captures events at critical API boundaries — auth, payments, and team management — with `flushAt: 1` to ensure immediate delivery in serverless-friendly fashion.

**Reverse proxy:** Added Next.js rewrites in `next.config.ts` to route PostHog traffic through `/ingest/*`, reducing ad-blocker interference.

**Environment:** PostHog keys are stored in `.env.local` and referenced via `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST`.

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | Fired when a user successfully completes registration | `pages/api/auth/sign-up.ts` + `components/login.tsx` |
| `user_signed_in` | Fired when a user successfully signs in to their account | `pages/api/auth/sign-in.ts` + `components/login.tsx` |
| `user_signed_out` | Fired when a user signs out of their account | `components/header.tsx` |
| `checkout_started` | Fired when a user clicks Get Started on a pricing plan | `pages/pricing.tsx` |
| `subscription_updated` | Fired when a Stripe subscription becomes active or trialing | `pages/api/stripe/webhook.ts` |
| `subscription_canceled` | Fired when a Stripe subscription is canceled or unpaid | `pages/api/stripe/webhook.ts` |
| `team_member_invited` | Fired when a team owner invites a new member | `pages/api/team/invite.ts` |
| `team_member_removed` | Fired when a team member is removed from the team | `pages/api/team/remove-member.ts` |
| `account_updated` | Fired when a user updates their account information | `pages/dashboard/general.tsx` |
| `customer_portal_opened` | Fired when a user opens the Stripe billing portal | `pages/api/stripe/customer-portal.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- 📊 [Analytics basics dashboard](https://us.posthog.com/project/2/dashboard/1313958)
- 📈 [New User Signups](https://us.posthog.com/project/2/insights/vnxb5vz9) — Daily signup trend
- 🔀 [Signup to Subscription Funnel](https://us.posthog.com/project/2/insights/70v1bn25) — Conversion funnel: signup → checkout → subscription
- 📉 [Subscription Churn](https://us.posthog.com/project/2/insights/v59zi86w) — Daily cancellation trend
- 💳 [Checkout Conversion Rate](https://us.posthog.com/project/2/insights/oaes36rz) — Checkout attempts vs successful subscriptions
- 👥 [Team Growth Activity](https://us.posthog.com/project/2/insights/3kr7uhts) — Member invites and removals over time

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
