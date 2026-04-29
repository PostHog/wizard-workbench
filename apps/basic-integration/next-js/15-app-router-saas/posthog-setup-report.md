<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 SaaS App Router project.

## Summary of changes

- **`instrumentation-client.ts`** *(new)* — Client-side PostHog initialization using the `instrumentation-client` pattern (recommended for Next.js 15.3+). Configured with the `/ingest` reverse proxy, exception capture, and debug mode in development.
- **`lib/posthog-server.ts`** *(new)* — Server-side PostHog client factory using `posthog-node` for use in Server Actions and API routes. Configured with `flushAt: 1` and `flushInterval: 0` to ensure immediate event delivery.
- **`next.config.ts`** — Added reverse proxy rewrites for `/ingest/static/*`, `/ingest/array/*`, and `/ingest/*` to route PostHog traffic through the Next.js server, reducing tracking blocker impact.
- **`app/(login)/login.tsx`** — Added client-side `posthog.identify()` on form submit to associate the user's email with their PostHog distinct ID at sign-in/sign-up time.
- **`app/(login)/actions.ts`** — Added server-side PostHog events for all authentication and account management actions (see table below).
- **`app/api/stripe/checkout/route.ts`** — Added `checkout_completed` event with plan name, subscription ID, and status when a Stripe checkout session succeeds.
- **`app/api/stripe/webhook/route.ts`** — Added `subscription_updated` and `subscription_cancelled` events from Stripe webhook payloads.
- **`lib/payments/actions.ts`** — Added `customer_portal_opened` event when a user accesses the Stripe billing portal.

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `user_signed_in` | User successfully signed in with email and password | `app/(login)/actions.ts` |
| `user_signed_up` | New user successfully created an account | `app/(login)/actions.ts` |
| `user_signed_out` | User signed out of their account | `app/(login)/actions.ts` |
| `checkout_completed` | User completed a Stripe checkout session and subscription was created | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Team subscription was updated via Stripe webhook | `app/api/stripe/webhook/route.ts` |
| `subscription_cancelled` | Team subscription was cancelled/deleted via Stripe webhook | `app/api/stripe/webhook/route.ts` |
| `customer_portal_opened` | User opened the Stripe customer billing portal | `lib/payments/actions.ts` |
| `team_member_invited` | Team owner invited a new member to the team | `app/(login)/actions.ts` |
| `team_member_removed` | Team member was removed from the team | `app/(login)/actions.ts` |
| `account_updated` | User updated their account name or email | `app/(login)/actions.ts` |
| `password_updated` | User changed their password | `app/(login)/actions.ts` |
| `account_deleted` | User deleted their account | `app/(login)/actions.ts` |

## Next steps

To monitor user behavior, create an **"Analytics basics"** dashboard in PostHog with these five insights:

1. **Signup → Checkout Funnel** — Funnel insight: `user_signed_up` → `checkout_completed`. Measures free-to-paid conversion.
2. **New Signups Over Time** — Trend of `user_signed_up` events. Tracks growth.
3. **Subscription Cancellations** — Trend of `subscription_cancelled` events. Tracks churn.
4. **Team Collaboration Activity** — Trend showing `team_member_invited` and `team_member_removed` events. Tracks team engagement.
5. **Daily Active Users (Sign-ins)** — Trend of `user_signed_in` events with unique user count. Tracks retention.

Create insights at: https://us.posthog.com/project/2/insights/new

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
