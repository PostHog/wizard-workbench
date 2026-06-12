<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 Pages Router SaaS application. The integration covers client-side initialization via `instrumentation-client.ts`, a shared server-side PostHog client (`lib/posthog-server.ts`), user identification at login and signup, eight tracked business events across both client and server, and a reverse proxy to route PostHog ingestion through `/ingest` to avoid ad blockers.

## Changes summary

- **`instrumentation-client.ts`** (new): Client-side PostHog initialization with session replay, error tracking, and reverse proxy host.
- **`lib/posthog-server.ts`** (new): Singleton server-side PostHog client using `posthog-node`.
- **`next.config.ts`**: Added reverse proxy rewrites for `/ingest/static/*`, `/ingest/array/*`, and `/ingest/*`, plus `skipTrailingSlashRedirect: true`.
- **`components/login.tsx`**: Added `posthog.identify()` on successful sign-in/sign-up and `posthog.captureException()` on errors.
- **`components/header.tsx`**: Added `posthog.capture('user_signed_out')` and `posthog.reset()` on sign-out.
- **`pages/pricing.tsx`**: Added `posthog.capture('checkout_started')` when a user clicks "Get Started".
- **`pages/dashboard/general.tsx`**: Added `posthog.capture('account_updated')` on successful account settings save.
- **`pages/api/auth/sign-in.ts`**: Added server-side `posthog.identify()` and `posthog.capture('user_signed_in')` after successful authentication.
- **`pages/api/auth/sign-up.ts`**: Added server-side `posthog.identify()` and `posthog.capture('user_signed_up')` after user creation.
- **`pages/api/stripe/webhook.ts`**: Added `posthog.capture('subscription_updated')` and `posthog.capture('subscription_cancelled')` on Stripe subscription lifecycle events.
- **`pages/api/team/invite.ts`**: Added `posthog.capture('team_member_invited')` after a team invitation is sent.

## Events

| Event | Description | File |
|---|---|---|
| `user_signed_up` | Fired server-side when a new user account is successfully created | `pages/api/auth/sign-up.ts` |
| `user_signed_in` | Fired server-side when a user successfully signs in | `pages/api/auth/sign-in.ts` |
| `user_signed_out` | Fired client-side when a user clicks sign out | `components/header.tsx` |
| `checkout_started` | Fired client-side when a user clicks "Get Started" on a pricing plan | `pages/pricing.tsx` |
| `subscription_updated` | Fired server-side when a Stripe subscription becomes active or trialing | `pages/api/stripe/webhook.ts` |
| `subscription_cancelled` | Fired server-side when a Stripe subscription is cancelled or unpaid | `pages/api/stripe/webhook.ts` |
| `team_member_invited` | Fired server-side when a team owner sends an invitation to a new member | `pages/api/team/invite.ts` |
| `account_updated` | Fired client-side when a user successfully saves changes to their account settings | `pages/dashboard/general.tsx` |

## Next steps

We've instrumented all the key business events. Visit your PostHog project to build insights and a dashboard named **"Analytics basics (wizard)"** with these suggested insights:

1. **Sign-up to checkout conversion funnel** — `user_signed_up` → `checkout_started` → `subscription_updated`
2. **Daily active sign-ups trend** — `user_signed_up` over time
3. **Subscription cancellations trend** — `subscription_cancelled` over time
4. **Team growth** — `team_member_invited` over time
5. **Account engagement** — `account_updated` over time

- [PostHog Insights](https://us.posthog.com/project/2/insights)
- [PostHog Dashboards](https://us.posthog.com/project/2/dashboard)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
