<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router SaaS application. The integration covers both client-side and server-side event tracking, user identification, session continuity, error tracking, and a reverse proxy setup for improved reliability.

## Summary of changes

**New files created:**
- `instrumentation-client.ts` — Client-side PostHog initialization (Next.js 15.3+ pattern). Initializes `posthog-js` with the `/ingest` reverse proxy, exception capture, and development debug mode.
- `lib/posthog-server.ts` — Server-side PostHog client factory using `posthog-node`. Creates a fresh client per API call with `flushAt: 1` / `flushInterval: 0` to ensure immediate event delivery.

**Modified files:**
- `next.config.ts` — Added `/ingest` reverse proxy rewrites so PostHog requests route through the Next.js server, reducing tracking blocker interference.
- `components/login.tsx` — On sign-in/sign-up success: calls `posthog.identify()` with the returned user ID, captures `user_signed_in` / `user_signed_up` events, sends `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` headers to correlate with server-side events. Adds `posthog.captureException()` on error.
- `components/header.tsx` — Captures `sign_out` event and calls `posthog.reset()` before clearing session.
- `pages/pricing.tsx` — Captures `checkout_initiated` with plan name, price amount, and billing interval when the user submits the checkout form.
- `pages/api/auth/sign-in.ts` — Server-side: identifies user, captures `user_signed_in` with email and anonymous distinct ID correlation. Returns `userId` in response for client-side identify.
- `pages/api/auth/sign-up.ts` — Server-side: identifies user, captures `user_signed_up` with email, invitation flag, and anonymous distinct ID correlation. Returns `userId` in response for client-side identify.
- `pages/api/stripe/checkout.ts` — Server-side: captures `checkout_completed` with plan name, subscription ID, and status after a successful Stripe checkout session.
- `pages/api/stripe/webhook.ts` — Server-side: captures `subscription_updated` or `subscription_cancelled` on Stripe webhook events, looking up the team member's user ID from the database.
- `pages/api/team/invite.ts` — Server-side: captures `team_member_invited` with the invited email, role, and team ID.
- `pages/api/team/remove-member.ts` — Server-side: captures `team_member_removed` with the removed member ID and team ID.
- `pages/api/account/update.ts` — Server-side: captures `account_updated` with the new name and email values.

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `user_signed_in` | User successfully signs in to their account | `components/login.tsx`, `pages/api/auth/sign-in.ts` |
| `user_signed_up` | User successfully creates a new account | `components/login.tsx`, `pages/api/auth/sign-up.ts` |
| `sign_out` | User signs out of their account | `components/header.tsx` |
| `checkout_initiated` | User clicks Get Started on a pricing plan | `pages/pricing.tsx` |
| `checkout_completed` | Stripe checkout completed, subscription activated | `pages/api/stripe/checkout.ts` |
| `subscription_updated` | Stripe webhook: subscription plan or status changed | `pages/api/stripe/webhook.ts` |
| `subscription_cancelled` | Stripe webhook: subscription deleted/cancelled | `pages/api/stripe/webhook.ts` |
| `team_member_invited` | Team owner sends an invitation to a new member | `pages/api/team/invite.ts` |
| `team_member_removed` | Team owner removes a member from the team | `pages/api/team/remove-member.ts` |
| `account_updated` | User updates their account name or email | `pages/api/account/update.ts` |

## Next steps

We've prepared the following insights for your "Analytics basics" dashboard. Create them in PostHog using the links below:

**[Open PostHog Dashboard →](https://us.posthog.com/project/2/dashboard)**

### Recommended insights to create

1. **Signup-to-Checkout Conversion Funnel**
   Track how many users go from signing up to initiating and completing checkout.
   Events: `user_signed_up` → `checkout_initiated` → `checkout_completed`
   [Create funnel insight →](https://us.posthog.com/project/2/insights/new#funnel)

2. **Daily Active Sign-ins**
   Monitor daily sign-in volume to track user engagement over time.
   Event: `user_signed_in` (trend, daily)
   [Create trend insight →](https://us.posthog.com/project/2/insights/new#trend)

3. **Subscription Cancellation Rate**
   Track subscription cancellations vs activations to measure churn.
   Events: `subscription_cancelled` vs `checkout_completed` (trend, weekly)
   [Create trend insight →](https://us.posthog.com/project/2/insights/new#trend)

4. **Team Growth — Invitations Sent**
   See how actively teams are growing by tracking member invitations.
   Event: `team_member_invited` (trend, weekly)
   [Create trend insight →](https://us.posthog.com/project/2/insights/new#trend)

5. **Checkout Initiation by Plan**
   Break down which pricing plan users select most at checkout initiation.
   Event: `checkout_initiated`, breakdown by `plan_name` property
   [Create breakdown insight →](https://us.posthog.com/project/2/insights/new#trend)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
