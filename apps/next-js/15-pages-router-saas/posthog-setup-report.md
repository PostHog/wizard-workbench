<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router SaaS application. The integration covers client-side event tracking with user identification, server-side event tracking from API routes, and a reverse proxy setup to improve ad-blocker resilience. PostHog is initialized via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+), and a shared server-side client is provided in `lib/posthog-server.ts`.

Key highlights:
- **User identification**: Users are identified by email on both the client side (in `components/login.tsx` via `posthog.identify()`) and server side (in `pages/api/auth/sign-in.ts` and `pages/api/auth/sign-up.ts` via `posthog.identify()`). The client's `distinct_id` and `session_id` are passed as request headers (`X-POSTHOG-DISTINCT-ID`, `X-POSTHOG-SESSION-ID`) to correlate anonymous pre-login behavior with identified users.
- **Error tracking**: `posthog.captureException()` is called in `components/login.tsx`, `pages/pricing.tsx`, and `pages/dashboard/general.tsx` for client-side error tracking. `capture_exceptions: true` is set in `instrumentation-client.ts` for automatic unhandled exception capture.
- **Reverse proxy**: `/ingest/*` rewrites route PostHog requests through the Next.js server, reducing ad-blocker impact.

| Event | Description | File |
|-------|-------------|------|
| `user_signed_in` | User successfully signed in | `components/login.tsx`, `pages/api/auth/sign-in.ts` |
| `user_signed_up` | New user successfully created an account | `components/login.tsx`, `pages/api/auth/sign-up.ts` |
| `user_signed_out` | User signed out of their account | `pages/api/auth/sign-out.ts` |
| `checkout_initiated` | User clicked Get Started on a pricing plan | `pages/pricing.tsx` |
| `checkout_completed` | User completed Stripe checkout and subscription created | `pages/api/stripe/checkout.ts` |
| `subscription_updated` | Stripe subscription updated via webhook | `pages/api/stripe/webhook.ts` |
| `subscription_cancelled` | Stripe subscription cancelled via webhook | `pages/api/stripe/webhook.ts` |
| `team_member_invited` | Owner invited a new member to join the team | `pages/api/team/invite.ts` |
| `team_member_removed` | A team member was removed from the team | `pages/api/team/remove-member.ts` |
| `account_updated` | User updated their account information | `pages/dashboard/general.tsx` |

## Next steps

To monitor key business metrics, create an **"Analytics basics"** dashboard in PostHog with these five insights:

1. **Signup-to-Checkout Conversion Funnel** — Steps: `user_signed_up` → `checkout_initiated` → `checkout_completed`. Identifies drop-off in the paid conversion flow.

2. **New Signups Over Time** — Trend chart of `user_signed_up` events. Essential for measuring growth.

3. **Sign-in vs Sign-up Activity** — Stacked trend of `user_signed_in` and `user_signed_up`. Reveals returning-user ratio vs new-user acquisition.

4. **Subscription Churn** — Trend of `subscription_cancelled` events. Critical early-warning metric for revenue health.

5. **Team Growth: Invites & Removals** — Trend of `team_member_invited` and `team_member_removed`. Tracks team collaboration health and potential churn signals.

Create these at: https://us.posthog.com/project/238460/insights/new

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
