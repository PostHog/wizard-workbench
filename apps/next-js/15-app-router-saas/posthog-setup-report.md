<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router SaaS Starter project. Here's a summary of what was done:

## What was set up

- **`instrumentation-client.ts`** (new) — Initializes PostHog client-side using the Next.js 15.3+ recommended approach. Enables session replay, autocapture, and error tracking via `capture_exceptions: true`.
- **`lib/posthog-server.ts`** (new) — Server-side PostHog singleton using `posthog-node`. Used in Server Actions and API routes for reliable server-side event capture.
- **`next.config.ts`** (updated) — Added PostHog reverse-proxy rewrites (`/ingest/*`) to improve ad-blocker resilience and data accuracy.
- **`.env.local`** (updated) — `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables set.
- **`app/(login)/actions.ts`** (updated) — Added PostHog `identify()` on sign-in and sign-up, plus 10 server-side capture events.
- **`app/api/stripe/checkout/route.ts`** (updated) — Added `checkout_completed` event with subscription and plan details.
- **`app/api/stripe/webhook/route.ts`** (updated) — Added `subscription_updated` and `subscription_canceled` events from Stripe webhook.

## Events instrumented

| Event Name | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signs in to their account | `app/(login)/actions.ts` |
| `user_sign_in_failed` | User sign-in attempt failed (with reason property) | `app/(login)/actions.ts` |
| `user_signed_up` | New user successfully creates an account | `app/(login)/actions.ts` |
| `user_sign_up_failed` | User sign-up attempt failed | `app/(login)/actions.ts` |
| `user_signed_out` | User signs out of their account | `app/(login)/actions.ts` |
| `password_updated` | User successfully updates their password | `app/(login)/actions.ts` |
| `account_deleted` | User deletes their account (churn signal) | `app/(login)/actions.ts` |
| `account_updated` | User updates their name or email | `app/(login)/actions.ts` |
| `team_member_invited` | Team owner invites a new member | `app/(login)/actions.ts` |
| `team_member_removed` | Team member removed from a team | `app/(login)/actions.ts` |
| `checkout_completed` | Stripe checkout completed — subscription created | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Team subscription updated via Stripe webhook | `app/api/stripe/webhook/route.ts` |
| `subscription_canceled` | Team subscription canceled via Stripe webhook | `app/api/stripe/webhook/route.ts` |

## Next steps

We've designed five insights for an **"Analytics basics"** dashboard to keep an eye on user behavior. Create it in PostHog here:

👉 **[Create your Dashboard](https://us.posthog.com/project/238460/dashboard)**

### Recommended insights to add

1. **Sign-up → Checkout Conversion Funnel** — Funnel: `user_signed_up` → `user_signed_in` → `checkout_completed` (14-day window)
2. **Daily Signups & Sign-ins** — Trends: `user_signed_up` + `user_signed_in` over 30 days
3. **Subscription Conversions vs Cancellations** — Trends: `checkout_completed` vs `subscription_canceled` over 30 days
4. **Team Growth** — Trends: `team_member_invited` vs `team_member_removed` over 30 days
5. **Account Churn** — Trends: `account_deleted` + `subscription_canceled` over 30 days

### PostHog project link

[https://us.posthog.com/project/238460](https://us.posthog.com/project/238460)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
