<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router SaaS application. The integration covers both client-side and server-side event tracking, user identification, session correlation, error tracking, and a reverse proxy for improved reliability.

## Changes made

### New files
- **`instrumentation-client.ts`** — Initializes `posthog-js` on the client using Next.js 15's built-in instrumentation-client convention. Enables automatic error tracking (`capture_exceptions`) and routes events through the local reverse proxy.
- **`lib/posthog-server.ts`** — Helper that creates a `posthog-node` client for server-side event capture with immediate flush settings (`flushAt: 1, flushInterval: 0`) required for short-lived server functions.

### Modified files
- **`next.config.ts`** — Added `/ingest` rewrites to proxy PostHog requests through Next.js, reducing ad blocker interference.
- **`app/(dashboard)/layout.tsx`** — Added client-side `posthog.identify()` when the authenticated user loads (syncs PostHog with the user's ID, email, and name), and `posthog.reset()` on sign-out to unlink the session.

### Server-side events added

| Event | Description | File |
|-------|-------------|------|
| `user_signed_in` | User successfully signed in with email and password | `app/(login)/actions.ts` |
| `user_signed_up` | New user created an account (with or without invitation) | `app/(login)/actions.ts` |
| `user_signed_out` | User signed out of their account | `app/(login)/actions.ts` |
| `password_updated` | User successfully updated their account password | `app/(login)/actions.ts` |
| `account_deleted` | User deleted (soft-deleted) their account | `app/(login)/actions.ts` |
| `account_updated` | User updated their account name or email | `app/(login)/actions.ts` |
| `team_member_invited` | Team owner sent an invitation to a new team member | `app/(login)/actions.ts` |
| `team_member_removed` | Team member was removed from the team | `app/(login)/actions.ts` |
| `checkout_started` | User initiated a Stripe checkout session | `lib/payments/actions.ts` |
| `customer_portal_opened` | User opened the Stripe customer portal | `lib/payments/actions.ts` |
| `checkout_completed` | Stripe checkout completed and subscription saved | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Stripe webhook processed a subscription change | `app/api/stripe/webhook/route.ts` |

## Next steps

Create a **"Analytics basics"** dashboard in PostHog with the following recommended insights:

1. **Signup → Checkout → Paid Conversion Funnel** — Funnel with steps: `user_signed_up` → `checkout_started` → `checkout_completed`
2. **Daily Sign-Ins** — Trend of `user_signed_in` over time
3. **New Signups Over Time** — Trend of `user_signed_up` over time
4. **Churn Signals** — Trend of `account_deleted` over time
5. **Team Growth** — Trend of `team_member_invited` events

Visit your PostHog project to create these:
- **Dashboards**: https://us.posthog.com/project/238460/dashboard
- **Insights**: https://us.posthog.com/project/238460/insights

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
