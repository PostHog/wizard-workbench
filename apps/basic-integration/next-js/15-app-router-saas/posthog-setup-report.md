# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 SaaS app. PostHog is initialized client-side via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+) with a reverse proxy configured in `next.config.ts` to route events through `/ingest`. A server-side singleton client (`lib/posthog-server.ts`) handles event capture from Server Actions and API routes. User identification is performed both client-side (on session load in the layout) and server-side (on sign-in and sign-up). 14 events cover the full user lifecycle: acquisition, conversion, subscription management, team collaboration, account security, and churn.

| Event Name | Description | File |
|---|---|---|
| `user_signed_up` | A new user successfully created an account. | `app/(login)/actions.ts` |
| `user_signed_in` | An existing user successfully signed in. | `app/(login)/actions.ts` |
| `user_signed_out` | A user signed out of their account. | `app/(dashboard)/layout.tsx` |
| `pricing_viewed` | A user viewed the pricing page, marking the top of the checkout conversion funnel. | `app/(dashboard)/pricing/page.tsx` |
| `checkout_started` | A user clicked the checkout button to begin a subscription purchase. | `app/(dashboard)/pricing/submit-button.tsx` |
| `checkout_completed` | A user successfully completed the Stripe checkout and subscribed to a plan. | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | A team's subscription changed status (e.g. became active or trialing) via Stripe webhook. | `lib/payments/stripe.ts` |
| `subscription_cancelled` | A team's subscription was cancelled or became unpaid via Stripe webhook. | `lib/payments/stripe.ts` |
| `subscription_portal_opened` | A user clicked to manage their subscription in the Stripe customer portal. | `app/(dashboard)/dashboard/page.tsx` |
| `team_member_invited` | A team owner sent an invitation to a new team member. | `app/(login)/actions.ts` |
| `team_member_removed` | A team member was removed from the team. | `app/(login)/actions.ts` |
| `account_updated` | A user updated their account name or email address. | `app/(login)/actions.ts` |
| `password_updated` | A user successfully changed their account password. | `app/(login)/actions.ts` |
| `account_deleted` | A user permanently deleted their account. | `app/(login)/actions.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1787390)
- [Conversion Funnel: Pricing → Checkout](https://us.posthog.com/project/483112/insights/F9ch8D7t)
- [New User Registrations](https://us.posthog.com/project/483112/insights/Q29Cj17f)
- [Subscription Cancellations (Churn)](https://us.posthog.com/project/483112/insights/VUQDMhPm)
- [Completed Checkouts (Revenue)](https://us.posthog.com/project/483112/insights/OwaosfdM)
- [Team Invitations (Product Engagement)](https://us.posthog.com/project/483112/insights/4JleTybX)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the layout's `useEffect` handles this on every authenticated page load, but verify it fires correctly for users who are already signed in when they return.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
