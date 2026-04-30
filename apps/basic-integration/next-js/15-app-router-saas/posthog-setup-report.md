<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router SaaS project. PostHog is now initialized client-side via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+), a shared server-side client is available in `lib/posthog-server.ts`, and a reverse proxy is configured in `next.config.ts` to reduce tracking-blocker interference. Users are identified on the client side when the dashboard loads and on the server side at sign-in and sign-up. Twelve events spanning the full user lifecycle — from registration to billing to churn — are now captured across both client and server contexts.

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signs in with email and password | `app/(login)/actions.ts` |
| `user_signed_up` | New user account created (with or without an invitation) | `app/(login)/actions.ts` |
| `user_signed_out` | User signs out via the header dropdown menu | `app/(dashboard)/layout.tsx` |
| `checkout_initiated` | User clicks Get Started on a pricing plan and is redirected to Stripe Checkout | `lib/payments/actions.ts` |
| `checkout_completed` | User returns from Stripe Checkout with a successful payment session | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Stripe webhook: subscription status or plan changed | `app/api/stripe/webhook/route.ts` |
| `subscription_cancelled` | Stripe webhook: subscription deleted/cancelled | `app/api/stripe/webhook/route.ts` |
| `team_member_invited` | Team owner sends an invitation to a new team member | `app/(login)/actions.ts` |
| `team_member_removed` | Team owner removes a member from the team | `app/(login)/actions.ts` |
| `password_updated` | User successfully changes their account password | `app/(login)/actions.ts` |
| `account_deleted` | User deletes their account (soft-delete) | `app/(login)/actions.ts` |
| `account_updated` | User updates their name or email in General Settings | `app/(login)/actions.ts` |

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog with the following five insights to monitor business health:

1. **Sign-up to subscription funnel** — A funnel insight with steps: `user_signed_up` → `checkout_initiated` → `checkout_completed`. Shows your top-of-funnel conversion rate.

2. **New sign-ups over time** — A trend insight for `user_signed_up`. Track user acquisition day-by-day or week-by-week.

3. **Subscription conversions** — A trend insight for `checkout_completed`. Monitor paid subscription growth.

4. **Churn events** — A trend insight stacking `account_deleted` and `subscription_cancelled`. Keep an eye on users leaving.

5. **Active users (sign-ins)** — A trend insight for `user_signed_in` with a DAU/WAU breakdown. Understand engagement patterns.

You can create these at: https://us.posthog.com/project/2/insights/new

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
