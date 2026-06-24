# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router SaaS project. The integration covers client-side initialization via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+), a server-side PostHog Node.js client in `lib/posthog-server.ts`, a reverse proxy via Next.js rewrites in `next.config.ts`, server-side event capture in Server Actions and API routes, and client-side user identification and session reset in the dashboard layout.

| Event Name | Description | File |
|---|---|---|
| `user_signed_up` | A new user successfully created an account. | `app/(login)/actions.ts` |
| `user_signed_in` | A user successfully signed in to their account. | `app/(login)/actions.ts` |
| `user_signed_out` | A user signed out of their account. | `app/(login)/actions.ts` |
| `checkout_started` | A user initiated a Stripe checkout session for a subscription plan. | `lib/payments/stripe.ts` |
| `checkout_completed` | A user successfully completed checkout and activated a subscription. | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | A team's subscription status changed (e.g. trial to active, plan upgrade). | `lib/payments/stripe.ts` |
| `subscription_cancelled` | A team's subscription was cancelled or became unpaid. | `lib/payments/stripe.ts` |
| `account_updated` | A user updated their account name or email. | `app/(login)/actions.ts` |
| `password_updated` | A user successfully changed their password. | `app/(login)/actions.ts` |
| `account_deleted` | A user deleted their account. | `app/(login)/actions.ts` |
| `team_member_invited` | A team owner sent an invitation to a new team member. | `app/(login)/actions.ts` |
| `team_member_removed` | A team member was removed from the team. | `app/(login)/actions.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) Dashboard](https://us.posthog.com/project/483112/dashboard/1751155)
- [User Signups Over Time](https://us.posthog.com/project/483112/insights/MNXmOl7R)
- [Sign-in to Paid Conversion Funnel](https://us.posthog.com/project/483112/insights/GPMF9CQE)
- [Checkout Conversion](https://us.posthog.com/project/483112/insights/voErotFn)
- [Subscription Health](https://us.posthog.com/project/483112/insights/xCavSK1q)
- [Account Churn Events](https://us.posthog.com/project/483112/insights/0m7N5uFk)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
