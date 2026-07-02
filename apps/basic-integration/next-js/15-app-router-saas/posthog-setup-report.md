# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router SaaS application. PostHog is initialized client-side via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+) with a reverse proxy configured in `next.config.ts` to improve reliability. Server-side event tracking uses `posthog-node` through a shared helper in `lib/posthog-server.ts`. User identity is established on both the client side (via a `PostHogIdentify` component mounted in the root layout) and the server side (via `identify()` calls in auth server actions). Error tracking is enabled via `capture_exceptions: true` in the client init and `captureException` in critical server error paths.

| Event | Description | File |
|---|---|---|
| `user_signed_up` | A new user successfully created an account. | `app/(login)/actions.ts` |
| `user_signed_in` | A user successfully signed into their account. | `app/(login)/actions.ts` |
| `user_signed_out` | A user signed out of their account. | `app/(login)/actions.ts` |
| `checkout_started` | A user initiated a Stripe checkout session for a plan. | `lib/payments/actions.ts` |
| `checkout_completed` | A user completed the Stripe checkout and a subscription was created. | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | A team's subscription plan was changed via Stripe webhook. | `app/api/stripe/webhook/route.ts` |
| `subscription_cancelled` | A team's subscription was cancelled via Stripe webhook. | `app/api/stripe/webhook/route.ts` |
| `team_member_invited` | A team owner sent an invitation to a new team member. | `app/(login)/actions.ts` |
| `team_member_removed` | A team member was removed from the team. | `app/(login)/actions.ts` |
| `account_updated` | A user updated their account name or email. | `app/(login)/actions.ts` |
| `password_updated` | A user successfully changed their account password. | `app/(login)/actions.ts` |
| `account_deleted` | A user deleted their account. | `app/(login)/actions.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/228144/dashboard/1792599)
- [New Signups](https://us.posthog.com/project/228144/insights/3yL05rKP) — daily signup count over the last 30 days
- [Daily Active Users](https://us.posthog.com/project/228144/insights/8Lc9Y6PX) — unique users signing in per day
- [Signup to Checkout Funnel](https://us.posthog.com/project/228144/insights/mFMRzAu3) — conversion from signup → checkout started → checkout completed
- [Subscription Cancellations](https://us.posthog.com/project/228144/insights/jfQTqQXh) — churn signal: cancelled subscriptions over time
- [Team Growth — Invitations Sent](https://us.posthog.com/project/228144/insights/JLOIeR1n) — invitations sent vs. new signups week over week

## Verify before merging

- [ ] Run a full production build (`pnpm build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the `PostHogIdentify` component in `app/layout.tsx` handles this on every page load, but verify the component renders correctly for authenticated users in your local dev environment.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
