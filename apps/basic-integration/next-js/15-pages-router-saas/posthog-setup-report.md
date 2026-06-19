<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 Pages Router SaaS app. PostHog is initialized client-side via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+) and server-side via a singleton `lib/posthog-server.ts`. A reverse proxy via Next.js rewrites routes PostHog ingestion through `/ingest` to avoid ad blockers. User identification happens on both the client (login/signup forms) and the server (sign-up API route). Twelve events are tracked across five client-side files and seven server-side API routes, covering the full user lifecycle from signup through subscription management and team collaboration.

| Event Name | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signed in to their account. | `components/login.tsx` |
| `user_signed_up` | User successfully created a new account. | `components/login.tsx` |
| `user_signed_out` | User signed out of their account. | `components/header.tsx` |
| `checkout_started` | User clicked Get Started on a pricing plan and initiated checkout. | `pages/pricing.tsx` |
| `account_updated` | User saved changes to their account information. | `pages/dashboard/general.tsx` |
| `checkout_completed` | User successfully completed a Stripe checkout and subscription was created. | `pages/api/stripe/checkout.ts` |
| `subscription_updated` | A Stripe subscription was updated via webhook. | `pages/api/stripe/webhook.ts` |
| `subscription_cancelled` | A Stripe subscription was cancelled via webhook. | `pages/api/stripe/webhook.ts` |
| `team_member_invited` | A team owner sent an invitation to a new team member. | `pages/api/team/invite.ts` |
| `team_member_removed` | A team member was removed from the team. | `pages/api/team/remove-member.ts` |
| `customer_portal_accessed` | User opened the Stripe customer portal to manage their subscription. | `pages/api/stripe/customer-portal.ts` |
| `user_signed_up_server` | Server-side event fired when a new user account is successfully created. | `pages/api/auth/sign-up.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/2/dashboard/90003)
- [Conversion Funnel: Signup to Checkout](https://us.posthog.com/project/2/insights/9vs9p6of)
- [Trend: User Sign-ins](https://us.posthog.com/project/2/insights/zpaimvjb)
- [Trend: New Signups](https://us.posthog.com/project/2/insights/42a0ckvn)
- [Trend: Subscription Cancellations (Churn)](https://us.posthog.com/project/2/insights/tgg54ijq)
- [Trend: Team Member Invites (Growth)](https://us.posthog.com/project/2/insights/g2eymwsx)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
