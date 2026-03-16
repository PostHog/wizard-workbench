<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 SaaS starter. Here's what was set up:

- **Client-side initialization** via `instrumentation-client.ts` (Next.js 15.3+ pattern), with a reverse proxy through `/ingest` rewrites in `next.config.ts` to reduce ad-blocker interference and enable exception capture.
- **Server-side PostHog client** in `lib/posthog-server.ts` using `posthog-node`, reused across all server actions and API routes.
- **User identification** on the client side in `app/(dashboard)/layout.tsx` — `posthog.identify()` is called when authenticated user data loads. `posthog.reset()` is called on sign-out.
- **Server-side identify** on sign-in and sign-up so server events are linked to the same user profile.
- **Environment variables** written to `.env.local`: `NEXT_PUBLIC_POSTHOG_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`.
- **Packages installed**: `posthog-js` and `posthog-node`.

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully authenticated with email and password | `app/(login)/actions.ts` |
| `user_signed_up` | New user registered and account created | `app/(login)/actions.ts` |
| `user_signed_out` | User logged out of their account | `app/(login)/actions.ts` |
| `checkout_started` | User clicked the Get Started button on the pricing page | `app/(dashboard)/pricing/submit-button.tsx` |
| `checkout_completed` | Stripe checkout session completed and subscription activated | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Stripe subscription was updated (plan change, renewal, etc.) | `app/api/stripe/webhook/route.ts` |
| `subscription_cancelled` | Stripe subscription was cancelled or deleted | `app/api/stripe/webhook/route.ts` |
| `password_updated` | User successfully changed their account password | `app/(login)/actions.ts` |
| `account_deleted` | User deleted their account (churn event) | `app/(login)/actions.ts` |
| `team_member_invited` | Team owner sent an invitation to a new team member | `app/(login)/actions.ts` |
| `team_member_removed` | Team member was removed from the team | `app/(login)/actions.ts` |

## Next steps

To monitor user behavior based on these events, create an **"Analytics basics"** dashboard in PostHog with the following suggested insights:

1. **New User Signups** — Trends chart of `user_signed_up` over time
2. **Daily Active Users** — Trends chart of `user_signed_in` (unique users) over time
3. **Checkout Conversion Funnel** — Funnel: `checkout_started` → `checkout_completed`
4. **Subscription Health** — Trends chart comparing `checkout_completed` vs `subscription_cancelled`
5. **Account Churn** — Trends chart of `account_deleted` over time

You can create this dashboard at: [https://us.posthog.com/project/2/dashboard](https://us.posthog.com/project/2/dashboard)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
