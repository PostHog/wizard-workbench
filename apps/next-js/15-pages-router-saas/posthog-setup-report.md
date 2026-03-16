<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router SaaS application. The integration includes client-side initialization via `instrumentation-client.ts`, a server-side PostHog client singleton, user identification on login/signup, 11 custom business events across client and server code, PostHog exception capture for error tracking, and a reverse proxy setup via Next.js rewrites.

New files created:
- `instrumentation-client.ts` — Client-side PostHog initialization (Next.js 15.3+ pattern)
- `lib/posthog-server.ts` — Server-side PostHog singleton using `posthog-node`

Modified files:
- `next.config.ts` — Added reverse proxy rewrites for PostHog ingestion
- `components/login.tsx` — User identification + `user_signed_in` / `user_signed_up` events + error capture
- `components/header.tsx` — `user_signed_out` event + `posthog.reset()`
- `pages/pricing.tsx` — `checkout_started` event with plan details + distinct ID header passthrough
- `pages/dashboard/general.tsx` — `account_updated` event + error capture
- `pages/api/stripe/create-checkout.ts` — Server-side `checkout_session_created` event
- `pages/api/stripe/webhook.ts` — Server-side `subscription_updated` / `subscription_cancelled` events
- `pages/api/team/invite.ts` — Server-side `team_member_invited` event
- `pages/api/team/remove-member.ts` — Server-side `team_member_removed` event
- `pages/api/stripe/customer-portal.ts` — Server-side `customer_portal_accessed` event

| Event Name | Description | File |
|---|---|---|
| `user_signed_up` | User successfully created a new account | `components/login.tsx` |
| `user_signed_in` | User successfully signed in to their account | `components/login.tsx` |
| `user_signed_out` | User signed out of their account | `components/header.tsx` |
| `checkout_started` | User clicked 'Get Started' on a pricing plan and initiated checkout | `pages/pricing.tsx` |
| `checkout_session_created` | Stripe checkout session was successfully created on the server | `pages/api/stripe/create-checkout.ts` |
| `subscription_updated` | User's subscription was updated via Stripe webhook | `pages/api/stripe/webhook.ts` |
| `subscription_cancelled` | User's subscription was cancelled via Stripe webhook | `pages/api/stripe/webhook.ts` |
| `team_member_invited` | Team owner invited a new member to join the team | `pages/api/team/invite.ts` |
| `team_member_removed` | Team owner removed a member from the team | `pages/api/team/remove-member.ts` |
| `account_updated` | User updated their account information (name/email) | `pages/dashboard/general.tsx` |
| `customer_portal_accessed` | User opened the Stripe customer billing portal | `pages/api/stripe/customer-portal.ts` |

## Next steps

To set up an "Analytics basics" dashboard in PostHog, navigate to your [PostHog project](https://us.posthog.com/project/2) and create a new dashboard with the following insights:

1. **Signup → Checkout conversion funnel** — Funnel: `user_signed_up` → `checkout_started` → `checkout_session_created`
2. **Active subscriptions trend** — Trend of `subscription_updated` (filter: status = active)
3. **Churn rate** — Trend of `subscription_cancelled` over time
4. **Team collaboration** — Trend of `team_member_invited` and `team_member_removed`
5. **Account engagement** — Trend of `account_updated` and `customer_portal_accessed`

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
