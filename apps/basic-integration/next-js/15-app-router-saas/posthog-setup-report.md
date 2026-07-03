# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 App Router SaaS application. PostHog is initialized client-side via `instrumentation-client.ts` with a reverse proxy configured in `next.config.ts` for improved reliability. A server-side PostHog client (`lib/posthog-server.ts`) is used to capture critical business events from server actions and API routes. Users are identified both server-side (on sign-in/sign-up) and client-side (via a `PostHogIdentify` component in the dashboard layout). Automatic error tracking is enabled via `capture_exceptions: true`, with additional exception capture on the Stripe checkout error path. A `posthog.reset()` call is wired to the sign-out flow to clear the identity link.

| Event name | Description | File |
|---|---|---|
| `user_signed_in` | A user successfully signed in with their email and password. | `app/(login)/actions.ts` |
| `user_signed_up` | A new user successfully created an account. | `app/(login)/actions.ts` |
| `user_signed_out` | A user signed out of their account. | `app/(login)/actions.ts` |
| `account_updated` | A user updated their account name or email. | `app/(login)/actions.ts` |
| `password_updated` | A user successfully changed their password. | `app/(login)/actions.ts` |
| `account_deleted` | A user deleted their account. | `app/(login)/actions.ts` |
| `team_member_invited` | A team owner sent an invitation to a new team member. | `app/(login)/actions.ts` |
| `team_member_removed` | A team member was removed from the team. | `app/(login)/actions.ts` |
| `checkout_initiated` | A user clicked the Get Started button to begin a subscription checkout. | `app/(dashboard)/pricing/submit-button.tsx` |
| `subscription_checkout_completed` | A user successfully completed a Stripe checkout and started a subscription. | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | A team subscription was updated via a Stripe webhook event. | `app/api/stripe/webhook/route.ts` |
| `subscription_cancelled` | A team subscription was cancelled via a Stripe webhook event. | `app/api/stripe/webhook/route.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1796166)
- [New user signups](https://us.posthog.com/project/483112/insights/Gqez44bC)
- [Active users — daily sign-ins](https://us.posthog.com/project/483112/insights/tqNjwKa1)
- [Subscription checkout conversion funnel](https://us.posthog.com/project/483112/insights/iS1SUQ0Q)
- [Subscription events — updates vs cancellations](https://us.posthog.com/project/483112/insights/IpHD6Lkp)
- [Account deletions — churn signal](https://us.posthog.com/project/483112/insights/kdAOlB77)

## Verify before merging

- [ ] Run a full production build (`pnpm build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the `PostHogIdentify` component in the dashboard layout handles this, but verify it loads on every authenticated page view by signing in and navigating between routes.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
