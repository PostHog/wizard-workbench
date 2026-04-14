<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 SaaS application (Pages Router). The integration covers client-side event tracking, user identification, server-side event capture across all critical business operations, and automatic error tracking.

**Files created:**
- `instrumentation-client.ts` — Client-side PostHog initialization with reverse proxy, exception capture, and debug mode
- `lib/posthog-server.ts` — Singleton server-side PostHog client using `posthog-node`
- `.env.local` — `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` set

**Files modified:**
- `next.config.ts` — Added `/ingest` reverse proxy rewrites and `skipTrailingSlashRedirect`
- `components/login.tsx` — User identification (`posthog.identify`) on sign-in/sign-up; captures `sign_in_submitted` / `sign_up_submitted`; exception capture on error
- `pages/pricing.tsx` — Captures `checkout_initiated` with plan name, price, and interval
- `pages/dashboard/general.tsx` — Captures `account_updated` on successful save; exception capture on error
- `pages/api/stripe/create-checkout.ts` — Server-side `checkout_session_created`
- `pages/api/stripe/webhook.ts` — Server-side `subscription_updated` and `subscription_cancelled` from Stripe webhooks
- `pages/api/team/invite.ts` — Server-side `team_member_invited`
- `pages/api/team/remove-member.ts` — Server-side `team_member_removed`
- `pages/api/stripe/customer-portal.ts` — Server-side `customer_portal_opened`

## Events

| Event | Description | File |
|-------|-------------|------|
| `sign_up_submitted` | User successfully submitted the sign-up form and account was created | `components/login.tsx` |
| `sign_in_submitted` | User successfully submitted the sign-in form and logged in | `components/login.tsx` |
| `checkout_initiated` | User clicked 'Get Started' on a pricing card and initiated checkout | `pages/pricing.tsx` |
| `checkout_session_created` | Server-side: Stripe checkout session was created for a user | `pages/api/stripe/create-checkout.ts` |
| `subscription_updated` | Server-side: Stripe webhook received a subscription update event | `pages/api/stripe/webhook.ts` |
| `subscription_cancelled` | Server-side: Stripe webhook received a subscription deletion/cancellation event | `pages/api/stripe/webhook.ts` |
| `team_member_invited` | Server-side: A team member was successfully invited | `pages/api/team/invite.ts` |
| `team_member_removed` | Server-side: A team member was removed from the team | `pages/api/team/remove-member.ts` |
| `account_updated` | User successfully updated their account information (name/email) | `pages/dashboard/general.tsx` |
| `customer_portal_opened` | Server-side: Customer portal session was created, user is accessing billing management | `pages/api/stripe/customer-portal.ts` |

## Next steps

We've prepared an "Analytics basics" dashboard for you to keep an eye on user behavior, based on the events we just instrumented. Visit your PostHog project to create it with these recommended insights:

- **[Create "Analytics basics" dashboard](https://us.posthog.com/project/2/dashboard)** — Click "New dashboard"

Recommended insights to add:

1. **[Signup → Checkout conversion funnel](https://us.posthog.com/project/2/insights/new)** — Funnel: `sign_up_submitted` → `checkout_initiated` → `checkout_session_created`
2. **[New signups over time](https://us.posthog.com/project/2/insights/new)** — Trend: `sign_up_submitted` (daily)
3. **[Subscription cancellations](https://us.posthog.com/project/2/insights/new)** — Trend: `subscription_cancelled` (weekly)
4. **[Team growth: invites sent](https://us.posthog.com/project/2/insights/new)** — Trend: `team_member_invited` vs `team_member_removed` (weekly)
5. **[Billing portal usage](https://us.posthog.com/project/2/insights/new)** — Trend: `customer_portal_opened` (weekly) — high usage may signal billing issues or churn risk

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
