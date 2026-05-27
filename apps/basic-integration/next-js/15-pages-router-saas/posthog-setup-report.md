<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 Pages Router SaaS application. The integration adds client-side and server-side analytics, user identification, session correlation, error tracking, and a reverse proxy for improved ad-blocker resilience.

**Key changes made:**

- **`instrumentation-client.ts`** (new) — initializes `posthog-js` using the Next.js instrumentation hook, with the reverse proxy, `capture_exceptions: true`, and debug mode in development.
- **`next.config.ts`** — added PostHog reverse proxy rewrites (`/ingest/*` → `us.i.posthog.com`) and `skipTrailingSlashRedirect: true`.
- **`lib/posthog-server.ts`** (new) — singleton `posthog-node` client (`flushAt: 1`, `flushInterval: 0`) for server-side event capture in API routes.
- **`components/login.tsx`** — captures `sign_in_submitted` / `sign_up_submitted` on form submit; calls `posthog.identify()` on success; passes `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` headers for client–server correlation; calls `posthog.captureException()` on errors.
- **`components/header.tsx`** — calls `posthog.reset()` on sign-out to unlink the anonymous session.
- **`pages/pricing.tsx`** — captures `pricing_plan_selected` with plan name, price ID, amount, and interval when a user clicks Get Started.
- **`pages/dashboard/index.tsx`** — captures `manage_subscription_clicked`, `team_member_invite_submitted`, and `team_member_removed`.
- **`pages/dashboard/general.tsx`** — captures `account_updated` on successful account save.
- **`pages/api/auth/sign-up.ts`** — captures `user_signed_up`; calls server-side `identify` and `alias` to link the anonymous client ID to the new user ID.
- **`pages/api/auth/sign-in.ts`** — captures `user_signed_in`; calls server-side `identify` and `alias`.
- **`pages/api/stripe/checkout.ts`** — captures `checkout_completed` with plan name, price ID, subscription ID, and status.
- **`lib/payments/stripe.ts`** — captures `subscription_updated` (active/trialing) and `subscription_cancelled` (canceled/unpaid) in the Stripe webhook handler.
- **`pages/api/team/invite.ts`** — captures `team_member_invitation_sent` with team ID and invitee role.

| Event | Description | File |
|-------|-------------|------|
| `sign_in_submitted` | User submitted the sign-in form | `components/login.tsx` |
| `sign_up_submitted` | User submitted the sign-up form (top of acquisition funnel) | `components/login.tsx` |
| `pricing_plan_selected` | User clicked Get Started on a pricing plan, initiating checkout | `pages/pricing.tsx` |
| `manage_subscription_clicked` | User clicked Manage Subscription to open the customer portal | `pages/dashboard/index.tsx` |
| `team_member_invite_submitted` | User submitted the invite team member form | `pages/dashboard/index.tsx` |
| `team_member_removed` | User removed a team member from the dashboard | `pages/dashboard/index.tsx` |
| `account_updated` | User successfully updated their account name or email | `pages/dashboard/general.tsx` |
| `user_signed_up` | Server: new user account created successfully (conversion event) | `pages/api/auth/sign-up.ts` |
| `user_signed_in` | Server: user authenticated successfully | `pages/api/auth/sign-in.ts` |
| `checkout_completed` | Server: Stripe checkout session processed and subscription activated | `pages/api/stripe/checkout.ts` |
| `subscription_updated` | Server: subscription status changed to active or trialing via webhook | `lib/payments/stripe.ts` |
| `subscription_cancelled` | Server: subscription was cancelled or went unpaid via webhook (churn event) | `lib/payments/stripe.ts` |
| `team_member_invitation_sent` | Server: team member invitation created successfully | `pages/api/team/invite.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](https://us.posthog.com/project/2/dashboard/1633097) — overview of signups, sign-ins, conversions, and team growth
- [New signups over time](https://us.posthog.com/project/2/insights/Ptla6hp7) — daily count of new user sign-ups
- [Sign-ins trend](https://us.posthog.com/project/2/insights/yKw0voEj) — daily unique users signing in
- [Subscription conversion funnel](https://us.posthog.com/project/2/insights/YoHaZZ2L) — pricing → checkout → subscription conversion steps
- [Account deletions (churn signal)](https://us.posthog.com/project/2/insights/pH7XxfZ1) — daily churn indicator
- [Team growth — invitations sent](https://us.posthog.com/project/2/insights/Cei7locy) — daily team member invitations

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
