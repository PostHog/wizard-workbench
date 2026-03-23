<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your Next.js 15 SaaS application. Here's a summary of all changes made:

**New files created:**
- `instrumentation-client.ts` — Client-side PostHog initialization using Next.js 15.3+ `instrumentation-client` convention. Enables automatic session replay, error tracking, and pageview capture.
- `lib/posthog-server.ts` — Server-side PostHog client factory (`getPostHogClient()`) using `posthog-node`, with `flushAt: 1` / `flushInterval: 0` for immediate event flushing in serverless environments.

**Modified files:**
- `next.config.ts` — Added reverse proxy rewrites (`/ingest/*` → PostHog) to improve reliability by routing events through your own domain and reducing ad-blocker interference.
- `app/(login)/actions.ts` — Added server-side event capture for all auth and team management actions (see table below). Also calls `posthog.identify()` on sign-in and sign-up to link server events to user profiles.
- `app/(dashboard)/layout.tsx` — Added client-side `posthog.identify()` in the `UserMenu` component to identify authenticated users on every page load. Added `user_signed_out` capture and `posthog.reset()` on sign-out to cleanly unlink the session.
- `app/(dashboard)/pricing/submit-button.tsx` — Added `checkout_initiated` capture when the user clicks "Get Started" on a pricing plan.
- `app/api/stripe/checkout/route.ts` — Added `checkout_completed` server-side event capture after a Stripe checkout session is successfully processed and the subscription is activated.
- `app/api/stripe/webhook/route.ts` — Added `subscription_updated` and `subscription_deleted` server-side event captures for Stripe webhook lifecycle events.

**Environment:**
- `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` added to `.env.local`.

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | User successfully created a new account | `app/(login)/actions.ts` |
| `user_signed_in` | User successfully signed in to their account | `app/(login)/actions.ts` |
| `user_signed_out` | User signed out of their account | `app/(dashboard)/layout.tsx` |
| `checkout_initiated` | User clicked to start checkout for a pricing plan | `app/(dashboard)/pricing/submit-button.tsx` |
| `checkout_completed` | User successfully completed Stripe checkout | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | A user subscription was updated via Stripe webhook | `app/api/stripe/webhook/route.ts` |
| `subscription_deleted` | A user subscription was cancelled/deleted via Stripe webhook | `app/api/stripe/webhook/route.ts` |
| `password_updated` | User successfully changed their account password | `app/(login)/actions.ts` |
| `account_deleted` | User deleted their account (churn event) | `app/(login)/actions.ts` |
| `account_updated` | User updated their account information | `app/(login)/actions.ts` |
| `team_member_invited` | User sent an invitation to a new team member | `app/(login)/actions.ts` |
| `team_member_removed` | User removed a member from their team | `app/(login)/actions.ts` |

## Next steps

We recommend building the following insights in your PostHog dashboard at https://us.posthog.com/project/238460/insights/new to monitor key business metrics:

- **Signup → Checkout funnel**: Funnel from `user_signed_up` → `checkout_initiated` → `checkout_completed` to measure your conversion rate from signup to paying customer.
- **Churn tracking**: Trend of `account_deleted` and `subscription_deleted` over time to monitor retention health.
- **Daily active sign-ins**: Trend of `user_signed_in` by day to track user engagement.
- **Team growth**: Trend of `team_member_invited` vs `team_member_removed` to track team expansion.
- **Subscription health**: Trend of `subscription_updated` by `subscription_status` property to monitor subscription state changes.

View your PostHog project: https://us.posthog.com/project/238460

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
