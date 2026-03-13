<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 Pages Router SaaS application. Here is a summary of all changes made:

**New files created:**
- `instrumentation-client.ts` — Initializes PostHog client-side using the recommended Next.js 15.3+ approach, with session replay, error tracking, and reverse proxy support.
- `next.config.ts` — Updated with PostHog reverse proxy rewrites (`/ingest/*`) and `skipTrailingSlashRedirect: true`.
- `lib/posthog-server.ts` — Singleton server-side PostHog client using `posthog-node` for API route tracking.
- `.env.local` — PostHog public token and host set as environment variables.

**Files edited with event tracking:**
- `components/login.tsx` — Identifies users (`posthog.identify`) and captures `user_signed_in` / `user_signed_up` on successful auth. Captures exceptions on errors.
- `components/header.tsx` — Captures `user_signed_out` and calls `posthog.reset()` on sign-out.
- `pages/pricing.tsx` — Captures `pricing_plan_selected` when a plan card is submitted and `checkout_completed` when Stripe redirects. Captures exceptions on errors.
- `pages/dashboard/index.tsx` — Captures `team_member_invited`, `team_member_removed`, and `manage_subscription_clicked`.
- `pages/dashboard/general.tsx` — Captures `account_updated` on success. Captures exceptions on errors.
- `pages/api/auth/sign-in.ts` — Server-side `posthog.identify` and `server_user_signed_in` event on successful authentication.
- `pages/api/auth/sign-up.ts` — Server-side `posthog.identify` and `server_user_signed_up` event on new account creation.
- `pages/api/stripe/webhook.ts` — Server-side `server_subscription_updated` event on Stripe subscription webhook events.

---

## Event tracking summary

| Event Name | Description | File |
|---|---|---|
| `user_signed_up` | User successfully created a new account | `components/login.tsx` |
| `user_signed_in` | User successfully signed in to their account | `components/login.tsx` |
| `user_signed_out` | User signed out of their account | `components/header.tsx` |
| `pricing_plan_selected` | User clicked Get Started on a pricing plan | `pages/pricing.tsx` |
| `checkout_completed` | Checkout session created and user redirected to Stripe | `pages/pricing.tsx` |
| `team_member_invited` | Team owner invited a new member | `pages/dashboard/index.tsx` |
| `team_member_removed` | Team owner removed a member from their team | `pages/dashboard/index.tsx` |
| `account_updated` | User updated their account name or email | `pages/dashboard/general.tsx` |
| `manage_subscription_clicked` | User clicked Manage Subscription | `pages/dashboard/index.tsx` |
| `server_user_signed_in` | Server-side: user successfully authenticated | `pages/api/auth/sign-in.ts` |
| `server_user_signed_up` | Server-side: new user account created | `pages/api/auth/sign-up.ts` |
| `server_subscription_updated` | Server-side: Stripe subscription status changed via webhook | `pages/api/stripe/webhook.ts` |

---

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog with the following insights:

1. **Sign-up conversion funnel** — `user_signed_up` → `pricing_plan_selected` → `checkout_completed`
2. **Daily active users (sign-ins)** — Trend of `user_signed_in` over time
3. **Churn signal** — Trend of `user_signed_out` events
4. **Team growth** — Trend of `team_member_invited` events
5. **Subscription health** — `server_subscription_updated` breakdown by `status` property

Create your dashboard here: [https://us.posthog.com/project/2/dashboard](https://us.posthog.com/project/2/dashboard)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
