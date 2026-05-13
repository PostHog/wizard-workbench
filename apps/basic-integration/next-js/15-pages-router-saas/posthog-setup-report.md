<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 Pages Router SaaS application. Here is a summary of all changes made:

**New files created:**
- `instrumentation-client.ts` — Initializes `posthog-js` on the client side using the `instrumentation-client` hook (Next.js 15.3+), with reverse proxy routing, error tracking, and debug mode in development.
- `lib/posthog-server.ts` — Singleton helper that creates and reuses a `posthog-node` client for server-side event capture and user identification.
- `.env.local` — Populated with `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST`.

**Updated files:**
- `next.config.ts` — Added PostHog reverse proxy rewrites (`/ingest/*`) so analytics requests bypass ad-blockers. Also added `skipTrailingSlashRedirect: true`.
- `components/login.tsx` — On successful sign-in or sign-up: calls `posthog.identify()` to link the user's email as their distinct ID, captures `user_signed_in` or `user_signed_up`, passes `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` headers to the auth API for session correlation, and captures exceptions on error.
- `components/header.tsx` — Calls `posthog.reset()` when the user signs out to unlink the session from the identified user.
- `pages/pricing.tsx` — Captures `checkout_started` with plan name, price ID, and interval when a user clicks "Get Started".
- `pages/dashboard/index.tsx` — Captures `manage_subscription_clicked`, `team_member_removed`, and `team_member_invited` events with relevant properties.
- `pages/dashboard/general.tsx` — Captures `account_updated` when the user saves their account info.
- `pages/api/auth/sign-in.ts` — Server-side: calls `posthog.identify()` with the user's email and aliases the anonymous client distinct ID to link pre-login events.
- `pages/api/auth/sign-up.ts` — Server-side: same as sign-in — identifies the new user and aliases anonymous events.
- `pages/api/stripe/create-checkout.ts` — Server-side: captures `checkout_session_created` with price ID, team ID, and team name.
- `pages/api/stripe/webhook.ts` — Server-side: captures `subscription_updated` or `subscription_cancelled` from Stripe webhook events, using the Stripe customer ID as the distinct ID.

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signed in to their account | `components/login.tsx` |
| `user_signed_up` | User successfully created a new account | `components/login.tsx` |
| `checkout_started` | User initiated a Stripe checkout for a pricing plan | `pages/pricing.tsx` |
| `team_member_invited` | Team owner sent an invitation to a new team member | `pages/dashboard/index.tsx` |
| `team_member_removed` | Team owner removed a member from the team | `pages/dashboard/index.tsx` |
| `manage_subscription_clicked` | User opened the Stripe customer portal to manage their subscription | `pages/dashboard/index.tsx` |
| `account_updated` | User updated their account information (name/email) | `pages/dashboard/general.tsx` |
| `subscription_updated` | Stripe webhook: a team subscription was updated (server-side) | `pages/api/stripe/webhook.ts` |
| `subscription_cancelled` | Stripe webhook: a team subscription was cancelled/deleted (server-side) | `pages/api/stripe/webhook.ts` |
| `checkout_session_created` | Stripe checkout session was successfully created for a team (server-side) | `pages/api/stripe/create-checkout.ts` |

## Next steps

We've prepared insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented. Create the **"Analytics basics"** dashboard in PostHog and add these five insights:

1. **Signup-to-Subscription Funnel** — Funnel insight with steps: `user_signed_up` → `checkout_started` → `checkout_session_created`. Measures conversion from signup through to checkout.
   [Create this insight →](https://us.posthog.com/project/2/insights/new#insight=FUNNELS)

2. **Daily New Sign-ups** — Trends insight tracking `user_signed_up` over the last 30 days. Your top-of-funnel growth metric.
   [Create this insight →](https://us.posthog.com/project/2/insights/new#insight=TRENDS)

3. **Checkout Started** — Trends insight tracking `checkout_started` alongside `checkout_session_created`. Shows pricing page conversion intent vs actual checkout sessions created.
   [Create this insight →](https://us.posthog.com/project/2/insights/new#insight=TRENDS)

4. **Subscription Churn** — Trends insight tracking `subscription_cancelled` over time. Critical for monitoring churn and cancellations.
   [Create this insight →](https://us.posthog.com/project/2/insights/new#insight=TRENDS)

5. **Team Activity** — Trends insight tracking `team_member_invited` and `team_member_removed` as separate series. Measures team growth and collaboration health.
   [Create this insight →](https://us.posthog.com/project/2/insights/new#insight=TRENDS)

[Open PostHog Dashboards →](https://us.posthog.com/project/2/dashboards)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
