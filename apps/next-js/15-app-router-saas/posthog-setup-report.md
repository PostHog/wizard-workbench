<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router SaaS project. Here is a summary of all changes made:

- **`instrumentation-client.ts`** (new): Initializes `posthog-js` on the client side using Next.js 15.3+ instrumentation support. Configured with a reverse proxy path (`/ingest`), exception capture, and debug mode in development.
- **`lib/posthog-server.ts`** (new): Server-side PostHog client factory using `posthog-node`, configured with `flushAt: 1` and `flushInterval: 0` for immediate event delivery in short-lived server functions.
- **`next.config.ts`** (edited): Added reverse proxy rewrites for `/ingest/*` → PostHog ingestion endpoints and `skipTrailingSlashRedirect: true`, so PostHog requests are less likely to be blocked.
- **`.env.local`** (updated): Set `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables.
- **`app/(login)/actions.ts`** (edited): Added server-side PostHog event capture and user identification across all auth Server Actions.
- **`lib/payments/actions.ts`** (edited): Added `checkout_started` and `customer_portal_accessed` events.
- **`app/api/stripe/checkout/route.ts`** (edited): Added `checkout_completed` event after successful Stripe checkout.
- **`app/api/stripe/webhook/route.ts`** (edited): Added `subscription_updated` and `subscription_cancelled` events from Stripe webhooks.

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signed in with email and password | `app/(login)/actions.ts` |
| `user_signed_up` | New user registered and created an account (with or without team invitation) | `app/(login)/actions.ts` |
| `user_signed_out` | User signed out of their account | `app/(login)/actions.ts` |
| `checkout_started` | User initiated a checkout session for a subscription plan | `lib/payments/actions.ts` |
| `checkout_completed` | User successfully completed checkout and subscription was activated | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | User's subscription plan or status was updated via Stripe webhook | `app/api/stripe/webhook/route.ts` |
| `subscription_cancelled` | User's subscription was cancelled via Stripe webhook | `app/api/stripe/webhook/route.ts` |
| `customer_portal_accessed` | User opened the Stripe customer portal to manage their subscription | `lib/payments/actions.ts` |
| `password_updated` | User successfully changed their account password | `app/(login)/actions.ts` |
| `account_deleted` | User deleted their account (churn event) | `app/(login)/actions.ts` |
| `account_updated` | User updated their account name or email | `app/(login)/actions.ts` |
| `team_member_invited` | Team owner sent an invitation to a new team member | `app/(login)/actions.ts` |
| `team_member_removed` | Team owner removed a member from the team | `app/(login)/actions.ts` |

## Next steps

Build an "Analytics basics" dashboard in PostHog to monitor key business metrics using the events above. Recommended insights:

1. **Sign-up trend** — Trend of `user_signed_up` over time (new user acquisition)
2. **Checkout conversion funnel** — Funnel: `user_signed_up` → `checkout_started` → `checkout_completed`
3. **Churn rate** — Trend of `account_deleted` events over time
4. **Subscription events** — Breakdown of `subscription_updated` vs `subscription_cancelled`
5. **Team growth** — Trend of `team_member_invited` over time

Visit your PostHog project to create these insights:

- [PostHog Dashboards](https://us.posthog.com/project/2/dashboards)
- [New Insight](https://us.posthog.com/project/2/insights/new)
- [Product Analytics](https://us.posthog.com/project/2/insights)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
