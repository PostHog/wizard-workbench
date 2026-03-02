<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router SaaS starter. The integration covers client-side initialization, server-side event capture, user identification, and a reverse proxy for improved reliability.

## Changes made

- **`instrumentation-client.ts`** (created): Initializes `posthog-js` for client-side analytics using the Next.js 15.3+ `instrumentation-client` pattern. Includes automatic exception capture and a reverse proxy setup.
- **`lib/posthog-server.ts`** (created): Singleton PostHog Node.js client for server-side event capture from Server Actions and API routes.
- **`next.config.ts`** (updated): Added `/ingest` reverse proxy rewrites to route PostHog requests through the Next.js server, reducing tracker-blocker interference.
- **`app/(login)/actions.ts`** (updated): Server-side captures for all auth and account lifecycle events. Also calls `posthog.identify()` on sign-in and sign-up to associate server events with user profiles.
- **`lib/payments/stripe.ts`** (updated): Captures `checkout_started` when a Stripe checkout session is created.
- **`lib/payments/actions.ts`** (updated): Captures `customer_portal_opened` when a user opens the Stripe billing portal.
- **`app/api/stripe/checkout/route.ts`** (updated): Captures `checkout_completed` after a successful Stripe checkout callback.
- **`app/api/stripe/webhook/route.ts`** (updated): Captures `subscription_updated` on Stripe subscription webhook events.
- **`app/(dashboard)/layout.tsx`** (updated): Calls `posthog.identify()` client-side when user data is loaded, and `posthog.reset()` on sign-out to unlink anonymous sessions.

## Events tracked

| Event | Description | File |
|-------|-------------|------|
| `signed_in` | User successfully signed in with email and password | `app/(login)/actions.ts` |
| `signed_up` | New user successfully created an account | `app/(login)/actions.ts` |
| `signed_out` | User signed out of their account | `app/(login)/actions.ts` |
| `checkout_started` | User initiated a Stripe checkout session for a subscription plan | `lib/payments/stripe.ts` |
| `checkout_completed` | User successfully completed Stripe checkout and subscription was created | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Subscription status changed via Stripe webhook (e.g. active, trialing, canceled) | `app/api/stripe/webhook/route.ts` |
| `team_member_invited` | Team owner sent an invitation to a new team member | `app/(login)/actions.ts` |
| `team_member_removed` | Team owner removed a member from their team | `app/(login)/actions.ts` |
| `password_updated` | User successfully changed their account password | `app/(login)/actions.ts` |
| `account_updated` | User updated their account name or email address | `app/(login)/actions.ts` |
| `account_deleted` | User permanently deleted their account (soft delete) | `app/(login)/actions.ts` |
| `customer_portal_opened` | User clicked to open the Stripe customer billing portal | `lib/payments/actions.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](https://us.posthog.com/project/2/dashboard/1296055) — Key business metrics including sign-up/sign-in trends, churn indicators, team collaboration activity, and the sign-up to subscription conversion funnel.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
