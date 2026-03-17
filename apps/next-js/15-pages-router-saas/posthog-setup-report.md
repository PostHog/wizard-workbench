<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router SaaS application. The integration covers both client-side and server-side event tracking, user identification, session replay, and error tracking.

**Summary of changes:**

- **`instrumentation-client.ts`** (new): Initializes PostHog client-side using the Next.js 15.3+ instrumentation API. Enables session replay, error tracking, and automatic pageview capture via the reverse proxy.
- **`next.config.ts`**: Added PostHog reverse proxy rewrites (`/ingest/*`) and `skipTrailingSlashRedirect: true` to improve ad-blocker resilience and data accuracy.
- **`lib/posthog-server.ts`** (new): Singleton server-side PostHog client using `posthog-node` for API route event tracking.
- **`components/login.tsx`**: Added `posthog.identify()` on successful sign-in and sign-up to link client-side anonymous sessions to known users.
- **`components/header.tsx`**: Added `user_signed_out` event capture and `posthog.reset()` on sign-out to cleanly end user sessions.
- **`pages/pricing.tsx`**: Added `checkout_initiated` event in the pricing card submit handler, capturing plan name, price, and interval.
- **`pages/dashboard/general.tsx`**: Added `account_updated` event after successful account info save.
- **`pages/api/auth/sign-up.ts`**: Added server-side `posthog.identify()` and `user_signed_up` event after successful user registration.
- **`pages/api/auth/sign-in.ts`**: Added server-side `posthog.identify()` and `user_signed_in` event after successful login.
- **`pages/api/stripe/checkout.ts`**: Added `checkout_completed` event after Stripe checkout session is successfully processed.
- **`pages/api/stripe/webhook.ts`**: Added `subscription_updated` event when Stripe webhook fires subscription update or deletion.
- **`pages/api/team/invite.ts`**: Added `team_member_invited` event after an invitation is sent.
- **`pages/api/team/remove-member.ts`**: Added `team_member_removed` event after a team member is removed.

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | Fired server-side when a new user successfully creates an account | `pages/api/auth/sign-up.ts` |
| `user_signed_in` | Fired server-side when a user successfully signs in | `pages/api/auth/sign-in.ts` |
| `user_signed_out` | Fired client-side when a user signs out | `components/header.tsx` |
| `checkout_initiated` | Fired client-side when a user clicks Get Started on a pricing plan | `pages/pricing.tsx` |
| `checkout_completed` | Fired server-side when a Stripe checkout session is successfully completed | `pages/api/stripe/checkout.ts` |
| `subscription_updated` | Fired server-side when a Stripe subscription is updated or deleted | `pages/api/stripe/webhook.ts` |
| `team_member_invited` | Fired server-side when a team member is invited | `pages/api/team/invite.ts` |
| `team_member_removed` | Fired server-side when a team member is removed | `pages/api/team/remove-member.ts` |
| `account_updated` | Fired client-side when a user saves changes to their account | `pages/dashboard/general.tsx` |

## Next steps

We recommend building an **"Analytics basics"** dashboard in PostHog with the following insights to monitor user behavior:

1. **Signup funnel** — Funnel from `checkout_initiated` → `user_signed_up` → `checkout_completed` to measure conversion through the payment flow.
2. **New user signups over time** — Trend of `user_signed_up` events per day to track growth.
3. **Active users** — Trend of `user_signed_in` events per day/week for engagement tracking.
4. **Churn signals** — Trend of `subscription_updated` events filtered to `status = canceled` or deleted subscriptions.
5. **Team growth** — Trend of `team_member_invited` events to understand virality and collaboration adoption.

You can create this dashboard at: [https://us.posthog.com/project/2/dashboard](https://us.posthog.com/project/2/dashboard)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
