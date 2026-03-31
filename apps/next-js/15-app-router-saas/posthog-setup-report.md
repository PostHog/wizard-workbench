<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router SaaS project. Here is a summary of all changes made:

- **`instrumentation-client.ts`** (new): Initialises `posthog-js` on the client side using Next.js 15.3+ instrumentation support, including exception capture and reverse proxy via `/ingest`.
- **`next.config.ts`**: Added `rewrites` to proxy PostHog ingestion through `/ingest` (avoiding ad-blockers) and set `skipTrailingSlashRedirect: true`.
- **`lib/posthog-server.ts`** (new): Singleton `posthog-node` client for server-side event capture (used by Server Actions and API routes).
- **`app/(login)/actions.ts`**: Added server-side `posthog.identify()` + `posthog.capture()` calls for sign-in, sign-up, sign-out, password update, account update, account deletion, team member invite, and team member removal.
- **`app/(login)/login.tsx`**: Added `posthog.identify(email)` on form submit to correlate client-side session with the authenticated user.
- **`app/(dashboard)/layout.tsx`**: Added `posthog.reset()` in the sign-out handler to clear the client-side identity on logout.
- **`lib/payments/actions.ts`**: Added `checkout_initiated` event when a user starts a Stripe checkout session.
- **`app/api/stripe/checkout/route.ts`**: Added `checkout_completed` event after Stripe checkout succeeds and subscription is activated.
- **`app/api/stripe/webhook/route.ts`**: Added `subscription_updated` and `subscription_cancelled` events from Stripe webhook payloads.

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user_signed_up` | User successfully created a new account | `app/(login)/actions.ts` |
| `user_signed_in` | User successfully signed in to their account | `app/(login)/actions.ts` |
| `user_signed_out` | User signed out of their account | `app/(login)/actions.ts` |
| `checkout_initiated` | User clicked to start a Stripe checkout session | `lib/payments/actions.ts` |
| `checkout_completed` | User completed checkout and subscription was created | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Stripe webhook: subscription updated (plan change, renewal) | `app/api/stripe/webhook/route.ts` |
| `subscription_cancelled` | Stripe webhook: subscription deleted/cancelled | `app/api/stripe/webhook/route.ts` |
| `password_updated` | User successfully changed their account password | `app/(login)/actions.ts` |
| `account_deleted` | User deleted their account | `app/(login)/actions.ts` |
| `team_member_invited` | User sent an invitation to a new team member | `app/(login)/actions.ts` |
| `team_member_removed` | User removed a team member from their team | `app/(login)/actions.ts` |
| `account_updated` | User updated their account name or email | `app/(login)/actions.ts` |

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog with the following insights:

1. **Signup-to-paid conversion funnel** — Funnel: `user_signed_up` → `checkout_initiated` → `checkout_completed`
2. **Daily active signups** — Trend: `user_signed_up` over time
3. **Churn events** — Trend: `subscription_cancelled` + `account_deleted` over time
4. **Team growth** — Trend: `team_member_invited` over time
5. **Checkout drop-off** — Funnel: `checkout_initiated` → `checkout_completed` (conversion rate)

You can create this dashboard at: https://us.posthog.com/project/238460/dashboard

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
