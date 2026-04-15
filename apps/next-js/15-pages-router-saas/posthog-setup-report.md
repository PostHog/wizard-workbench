<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router SaaS application. The integration covers client-side initialization, user identification, event tracking across key business flows, server-side event capture, and error tracking.

**Summary of changes:**

- `instrumentation-client.ts` *(new)* — Client-side PostHog initialization via Next.js instrumentation hook with reverse proxy, exception capture, and debug mode.
- `lib/posthog-server.ts` *(new)* — Singleton PostHog Node.js client for server-side event capture.
- `next.config.ts` — Added `/ingest` reverse proxy rewrites and `skipTrailingSlashRedirect` to route PostHog requests through the app (reduces ad-blocker interference).
- `.env.local` — Added `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables.
- `components/login.tsx` — Added `sign_in_submitted` / `sign_up_submitted` capture on form submit, `posthog.identify()` on successful auth, distinct ID forwarded to API via `X-POSTHOG-DISTINCT-ID` header, and exception capture.
- `pages/pricing.tsx` — Added `checkout_initiated` capture with plan name and price details; exception capture on error.
- `pages/dashboard/general.tsx` — Added `account_updated` capture on successful profile save; exception capture.
- `pages/api/auth/sign-in.ts` — Server-side `user_signed_in` capture with `posthog.identify()` and anonymous ID linking; returns `userId` to client for correlation.
- `pages/api/auth/sign-up.ts` — Server-side `user_signed_up` capture with `posthog.identify()` and anonymous ID linking; returns `userId` to client.
- `pages/api/stripe/create-checkout.ts` — Server-side `checkout_session_created` capture with price and team details.
- `pages/api/stripe/webhook.ts` — Server-side `subscription_changed` capture on subscription updated/deleted Stripe webhook events.
- `pages/api/team/invite.ts` — Server-side `team_member_invited` capture with team and role details.
- `pages/api/team/remove-member.ts` — Server-side `team_member_removed` capture.
- `pages/api/stripe/customer-portal.ts` — Server-side `customer_portal_accessed` capture.

## Events

| Event | Description | File |
|---|---|---|
| `sign_in_submitted` | User submitted the sign-in form | `components/login.tsx` |
| `sign_up_submitted` | User submitted the sign-up form | `components/login.tsx` |
| `checkout_initiated` | User clicked 'Get Started' on a pricing plan | `pages/pricing.tsx` |
| `account_updated` | User saved changes to their account information | `pages/dashboard/general.tsx` |
| `user_signed_in` | Server-side: user successfully authenticated | `pages/api/auth/sign-in.ts` |
| `user_signed_up` | Server-side: new user account created | `pages/api/auth/sign-up.ts` |
| `checkout_session_created` | Server-side: Stripe checkout session was created | `pages/api/stripe/create-checkout.ts` |
| `subscription_changed` | Server-side: subscription updated or deleted via Stripe webhook | `pages/api/stripe/webhook.ts` |
| `team_member_invited` | Server-side: a team member was invited | `pages/api/team/invite.ts` |
| `team_member_removed` | Server-side: a team member was removed from the team | `pages/api/team/remove-member.ts` |
| `customer_portal_accessed` | Server-side: user accessed the Stripe customer portal | `pages/api/stripe/customer-portal.ts` |

## Next steps

To build dashboards and insights based on these events, visit your PostHog project:

- **PostHog Project**: https://app.posthog.com/project/2

**Recommended insights to create in your "Analytics basics" dashboard:**

1. **Signup conversion funnel** — Funnel: `sign_up_submitted` → `user_signed_up`
2. **Checkout conversion funnel** — Funnel: `checkout_initiated` → `checkout_session_created` → `subscription_changed` (status=active)
3. **New signups over time** — Trend: `user_signed_up` (daily/weekly)
4. **Subscription churn** — Trend: `subscription_changed` filtered by `status = canceled`
5. **Team growth** — Trend: `team_member_invited` over time

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
