<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 Pages Router SaaS application. Here is a summary of all changes made:

- **Installed** `posthog-js` (client-side) and `posthog-node` (server-side) packages via pnpm.
- **Created** `instrumentation-client.ts` at the project root — initializes PostHog client-side using Next.js 15.3+'s native instrumentation support, with a reverse proxy, exception capture, and debug mode in development.
- **Created** `lib/posthog-server.ts` — a singleton PostHog Node.js client used by all API routes for server-side event capture and user identification.
- **Updated** `next.config.ts` — added `/ingest` reverse proxy rewrites to route PostHog traffic through the app, reducing tracking blockers.
- **Set** environment variables `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` in `.env.local`.
- **Added client-side tracking and identification** in `components/login.tsx`, `pages/pricing.tsx`, `pages/dashboard/index.tsx`, and `pages/dashboard/general.tsx`.
- **Added server-side tracking and identification** in `pages/api/auth/sign-in.ts`, `pages/api/auth/sign-up.ts`, `pages/api/auth/sign-out.ts`, `pages/api/stripe/create-checkout.ts`, and `pages/api/stripe/webhook.ts`.
- **User identification** is performed both client-side (`posthog.identify`) and server-side (`posthog.identify`) on sign-in and sign-up, using the user's email as the distinct ID for cross-platform correlation.
- **Error tracking** via `posthog.captureException` is added to all critical user action handlers.

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signed in with email and password | `components/login.tsx`, `pages/api/auth/sign-in.ts` |
| `user_signed_up` | User successfully created a new account | `components/login.tsx`, `pages/api/auth/sign-up.ts` |
| `user_signed_out` | User signed out and their session was cleared | `pages/api/auth/sign-out.ts` |
| `checkout_started` | User submitted the checkout form on the pricing page | `pages/pricing.tsx` |
| `checkout_session_created` | Stripe checkout session was successfully created server-side | `pages/api/stripe/create-checkout.ts` |
| `subscription_updated` | Stripe webhook: subscription was updated (plan change, renewal, etc.) | `pages/api/stripe/webhook.ts` |
| `subscription_cancelled` | Stripe webhook: subscription was deleted/cancelled | `pages/api/stripe/webhook.ts` |
| `customer_portal_opened` | User clicked to manage their subscription via the Stripe customer portal | `pages/dashboard/index.tsx` |
| `team_member_invited` | Team owner successfully sent an invitation to a new team member | `pages/dashboard/index.tsx` |
| `team_member_removed` | Team owner successfully removed a member from the team | `pages/dashboard/index.tsx` |
| `account_updated` | User successfully saved changes to their account information | `pages/dashboard/general.tsx` |

## Next steps

Your events are now flowing into PostHog. Here are some suggested insights to create based on the instrumented events:

- **Sign-up to Checkout Funnel** — Funnel: `user_signed_up` → `checkout_started` → `checkout_session_created`. Track conversion through your pricing flow.
- **Daily Active Sign-ins** — Trends: count of `user_signed_in` over time. Monitor user engagement and growth.
- **Subscription Health** — Trends: count of `subscription_updated` and `subscription_cancelled` over time. Track churn signals.
- **Team Growth** — Trends: count of `team_member_invited` and `team_member_removed`. Understand team expansion patterns.
- **Account Engagement** — Trends: count of `account_updated` and `customer_portal_opened`. Measure post-signup engagement.

You can create these insights and a dashboard in PostHog here:
- [Create a new dashboard](https://us.posthog.com/project/2/dashboard/new)
- [Create a new insight](https://us.posthog.com/project/2/insights/new)
- [View all events](https://us.posthog.com/project/2/activity/explore)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
