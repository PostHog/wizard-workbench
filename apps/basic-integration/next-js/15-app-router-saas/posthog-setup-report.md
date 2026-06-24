# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your Next.js 15 App Router SaaS application. PostHog is initialized client-side via `instrumentation-client.ts` using the recommended approach for Next.js 15.3+, with a reverse proxy configured in `next.config.ts` to route analytics through `/ingest`. A shared server-side client (`lib/posthog-server.ts`) is used by all Server Actions and API routes to capture business-critical events with `posthog-node`. User identification is performed client-side in the dashboard layout when user data loads, and `posthog.reset()` is called on sign-out. Environment variables are stored in `.env.local`.

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `pricing_plan_selected` | User clicks 'Get Started' on a pricing plan to begin the checkout flow. | `app/(dashboard)/pricing/submit-button.tsx` |
| `user_signed_up` | A new user successfully completes account registration. | `app/(login)/actions.ts` |
| `user_signed_in` | An existing user successfully authenticates and starts a session. | `app/(login)/actions.ts` |
| `user_signed_out` | A user ends their session by signing out. | `app/(login)/actions.ts` |
| `password_updated` | A user successfully changes their account password. | `app/(login)/actions.ts` |
| `account_deleted` | A user permanently deletes their account. | `app/(login)/actions.ts` |
| `account_updated` | A user updates their profile information such as name or email. | `app/(login)/actions.ts` |
| `team_member_removed` | A team owner removes a member from the team. | `app/(login)/actions.ts` |
| `team_member_invited` | A team owner sends an invitation to a new team member. | `app/(login)/actions.ts` |
| `checkout_started` | A user initiates the Stripe checkout flow for a subscription plan. | `lib/payments/actions.ts` |
| `checkout_completed` | A user successfully completes the Stripe checkout and activates a subscription. | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | A team's subscription plan is changed or renewed via Stripe webhook. | `app/api/stripe/webhook/route.ts` |
| `subscription_cancelled` | A team's subscription is cancelled or becomes unpaid via Stripe webhook. | `app/api/stripe/webhook/route.ts` |
| `subscription_management_opened` | A user opens the Stripe billing portal to manage their subscription. | `lib/payments/actions.ts` |

## Next steps

We've built some insights for you to keep an eye on user behavior, based on the events we just instrumented:

- [Sign-up to Checkout Conversion Funnel](https://us.posthog.com/project/483112/insights/1Tn6sKsp)
- [Daily Active Users (Sign-ins)](https://us.posthog.com/project/483112/insights/RQOgOdrA)
- [Subscription Events Over Time](https://us.posthog.com/project/483112/insights/V0ADPb7E)
- [Account Churn Events](https://us.posthog.com/project/483112/insights/cpzg5Ei0)
- [Team Collaboration Activity](https://us.posthog.com/project/483112/insights/vLeBXDV3)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
