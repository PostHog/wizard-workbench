<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router SaaS application. The integration includes:

- **Client-side initialization** via `instrumentation-client.ts` with reverse proxy routing through `/ingest`, exception capture enabled, and debug mode in development.
- **Reverse proxy** configured in `next.config.ts` to route PostHog requests through `/ingest`, reducing tracking-blocker interference.
- **Server-side PostHog client** created at `lib/posthog-server.ts` using `posthog-node` for tracking critical server-side business events.
- **User identification** on both client (in `components/login.tsx`) and server (in sign-in/sign-up API routes), linking anonymous and authenticated sessions.
- **12 events** instrumented across authentication, payments, and team management flows, covering the full user lifecycle from sign-up through churn.
- **Error capture** added to key client-side handlers using `posthog.captureException()`.
- **`posthog.reset()`** called on sign-out to clear the client-side identity.
- **Environment variables** set in `.env.local` using `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST`.

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | User successfully created an account | `pages/api/auth/sign-up.ts`, `components/login.tsx` |
| `user_signed_in` | User successfully signed into their account | `pages/api/auth/sign-in.ts`, `components/login.tsx` |
| `user_signed_out` | User signed out of their account | `components/header.tsx` |
| `invitation_accepted` | User accepted a team invitation during sign up | `pages/api/auth/sign-up.ts` |
| `checkout_initiated` | User clicked Get Started on a pricing plan | `pages/pricing.tsx` |
| `checkout_completed` | User successfully completed Stripe checkout | `pages/api/stripe/checkout.ts` |
| `subscription_updated` | Stripe subscription was updated via webhook | `pages/api/stripe/webhook.ts` |
| `subscription_cancelled` | Stripe subscription was cancelled via webhook | `pages/api/stripe/webhook.ts` |
| `customer_portal_opened` | User opened the Stripe customer billing portal | `pages/api/stripe/customer-portal.ts` |
| `team_member_invited` | Team owner invited a new member | `pages/api/team/invite.ts` |
| `team_member_removed` | Team member was removed from the team | `pages/api/team/remove-member.ts` |
| `account_updated` | User updated their account name or email | `pages/dashboard/general.tsx` |

## Next steps

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

To explore your analytics, visit your PostHog project and create insights using the events above. Some recommended insights:

- **Signup → Checkout conversion funnel**: `user_signed_up` → `checkout_initiated` → `checkout_completed`
- **Churn monitoring**: trend of `subscription_cancelled` over time
- **Team growth**: trend of `team_member_invited` and `invitation_accepted`
- **Active users**: unique users firing `user_signed_in` per week

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
</wizard-report>
