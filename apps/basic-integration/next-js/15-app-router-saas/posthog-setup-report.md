<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router SaaS application. Here is a summary of what was added:

**New files created:**
- `instrumentation-client.ts` — Initializes `posthog-js` client-side using Next.js 15.3+ instrumentation pattern, with reverse proxy, exception capture, and debug mode in development.
- `lib/posthog-server.ts` — Singleton server-side PostHog client using `posthog-node` for use in Server Actions and API routes.

**Files modified:**
- `next.config.ts` — Added reverse proxy rewrites (`/ingest/*`) so PostHog requests are routed through your domain, reducing ad-blocker interference.
- `.env.local` — Added `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`.
- `app/(login)/actions.ts` — Server-side events and `identify()` calls for all auth and account actions.
- `app/(dashboard)/layout.tsx` — Client-side `posthog.identify()` on user load, `posthog.reset()` on sign-out.
- `app/api/stripe/checkout/route.ts` — `checkout_completed` event after successful Stripe session.
- `lib/payments/stripe.ts` — `checkout_started` event when checkout session is created; `subscription_updated` and `subscription_canceled` events in the Stripe webhook handler.

**User identification:** Users are identified server-side (by database ID) on sign-in and sign-up, and client-side in the dashboard layout whenever user data loads. On sign-out, `posthog.reset()` is called to unlink the session. Account updates also re-identify the user with fresh name/email properties.

| Event | Description | File |
|---|---|---|
| `user_signed_up` | User successfully created an account (with or without an invitation) | `app/(login)/actions.ts` |
| `user_signed_in` | User successfully signed in to their account | `app/(login)/actions.ts` |
| `user_signed_out` | User signed out of their account | `app/(login)/actions.ts` |
| `checkout_started` | User initiated a Stripe checkout session for a subscription plan | `lib/payments/stripe.ts` |
| `checkout_completed` | Stripe checkout session completed successfully and subscription was activated | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Stripe webhook: subscription status changed to active or trialing | `lib/payments/stripe.ts` |
| `subscription_canceled` | Stripe webhook: subscription was canceled or became unpaid | `lib/payments/stripe.ts` |
| `team_member_invited` | Team owner sent an invitation to a new team member | `app/(login)/actions.ts` |
| `team_member_removed` | Team owner removed a member from the team | `app/(login)/actions.ts` |
| `account_updated` | User updated their account name or email | `app/(login)/actions.ts` |
| `password_updated` | User successfully changed their password | `app/(login)/actions.ts` |
| `account_deleted` | User deleted their account (soft delete) | `app/(login)/actions.ts` |

## Next steps

We recommend building an **"Analytics basics"** dashboard in PostHog with these five insights to monitor the key business metrics from your new events:

1. **Signup trend** — Trends insight on `user_signed_up` over time. Tracks new user acquisition.
   - [Create in PostHog](https://us.posthog.com/insights/new?insight=TRENDS&events=%5B%7B%22id%22%3A%22user_signed_up%22%7D%5D)

2. **Checkout conversion funnel** — Funnel insight: `user_signed_in` → `checkout_started` → `checkout_completed`. Identifies drop-off in the payment flow.
   - [Create in PostHog](https://us.posthog.com/insights/new?insight=FUNNELS)

3. **Active subscriptions** — Trends insight on `subscription_updated` filtered by `status = active`. Shows subscription growth over time.
   - [Create in PostHog](https://us.posthog.com/insights/new?insight=TRENDS&events=%5B%7B%22id%22%3A%22subscription_updated%22%7D%5D)

4. **Churn events** — Trends insight on `subscription_canceled` and `account_deleted` together. Tracks churn signals.
   - [Create in PostHog](https://us.posthog.com/insights/new?insight=TRENDS&events=%5B%7B%22id%22%3A%22subscription_canceled%22%7D%2C%7B%22id%22%3A%22account_deleted%22%7D%5D)

5. **Team growth** — Trends insight on `team_member_invited` over time. Measures product-led growth via team expansion.
   - [Create in PostHog](https://us.posthog.com/insights/new?insight=TRENDS&events=%5B%7B%22id%22%3A%22team_member_invited%22%7D%5D)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
