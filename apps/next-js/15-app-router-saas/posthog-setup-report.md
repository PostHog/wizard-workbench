<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your Next.js 15 App Router SaaS application. Here is a summary of all changes made:

**New files created:**
- `instrumentation-client.ts` — Initializes PostHog client-side using Next.js 15.3+ instrumentation API, with a reverse proxy, exception capture, and debug mode in development.
- `lib/posthog-server.ts` — Server-side PostHog client factory using `posthog-node`, configured for immediate flushing (suitable for short-lived serverless functions).
- `components/posthog-identify.tsx` — Client component that identifies the authenticated user in PostHog using SWR user data, called from the root layout on every page load.

**Modified files:**
- `next.config.ts` — Added reverse proxy rewrites so PostHog requests route through `/ingest`, reducing ad-blocker interference.
- `app/layout.tsx` — Added `<PostHogIdentify />` to identify logged-in users on every page render.
- `app/(login)/actions.ts` — Added server-side `posthog.capture()` calls to all auth and account management Server Actions.
- `app/api/stripe/checkout/route.ts` — Added `checkout_completed` event after a successful Stripe checkout session.
- `app/api/stripe/webhook/route.ts` — Added `subscription_updated` and `subscription_canceled` events on Stripe webhook delivery.
- `lib/payments/actions.ts` — Added `checkout_initiated` event when a user starts the Stripe checkout flow.
- `.env.local` — Added `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables.

---

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signs in | `app/(login)/actions.ts` |
| `user_signed_up` | New user creates an account | `app/(login)/actions.ts` |
| `user_signed_out` | User signs out | `app/(login)/actions.ts` |
| `account_updated` | User updates their name or email | `app/(login)/actions.ts` |
| `password_updated` | User changes their password | `app/(login)/actions.ts` |
| `account_deleted` | User permanently deletes their account (churn) | `app/(login)/actions.ts` |
| `team_member_invited` | Team owner invites a new member | `app/(login)/actions.ts` |
| `team_member_removed` | Team member is removed from a team | `app/(login)/actions.ts` |
| `checkout_initiated` | User starts the Stripe checkout flow | `lib/payments/actions.ts` |
| `checkout_completed` | User successfully completes checkout and subscribes | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Subscription status change via Stripe webhook | `app/api/stripe/webhook/route.ts` |
| `subscription_canceled` | Subscription canceled or became unpaid via Stripe webhook | `app/api/stripe/webhook/route.ts` |

## Next steps

To explore your data, head to your PostHog project and build insights with these events. Suggested dashboards:

- **Signup funnel**: `user_signed_up` → `checkout_initiated` → `checkout_completed`
- **Churn tracking**: trend of `account_deleted` and `subscription_canceled` over time
- **Revenue conversion rate**: unique users who fired `checkout_initiated` vs `checkout_completed`
- **Team activity**: trends of `team_member_invited` and `team_member_removed`
- **Auth activity**: daily trends of `user_signed_in` and `user_signed_up`

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
