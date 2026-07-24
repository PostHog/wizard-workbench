# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router SaaS application. PostHog is initialized client-side via `instrumentation-client.ts` (Next.js 15.3+ pattern) with a reverse proxy through `/ingest`. A server-side singleton client in `lib/posthog-server.ts` tracks critical business events in Server Actions and API routes using `posthog-node`. Users are identified on login and signup (server-side) and on page load when already authenticated (client-side via SWR in the dashboard layout). `posthog.reset()` is called on sign-out.

| Event name | Description | File |
|---|---|---|
| `user_signed_up` | Fired when a new user successfully completes account registration. | `app/(login)/actions.ts` |
| `user_signed_in` | Fired when an existing user successfully signs in. | `app/(login)/actions.ts` |
| `user_signed_out` | Fired when a user signs out of their account. | `app/(login)/actions.ts` |
| `checkout_started` | Fired when a user initiates a Stripe checkout session from the pricing page. | `lib/payments/stripe.ts` |
| `checkout_completed` | Fired when a Stripe checkout session succeeds and the subscription is activated. | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Fired when a subscription status changes (e.g. trial to active, plan change). | `app/api/stripe/webhook/route.ts` |
| `subscription_canceled` | Fired when a subscription is canceled or becomes unpaid via Stripe webhook. | `app/api/stripe/webhook/route.ts` |
| `password_updated` | Fired when a user successfully changes their account password. | `app/(login)/actions.ts` |
| `account_deleted` | Fired when a user successfully deletes their account (soft delete). | `app/(login)/actions.ts` |
| `team_member_invited` | Fired when a team owner sends an invitation to a new team member. | `app/(login)/actions.ts` |
| `team_member_removed` | Fired when a team member is removed from the team. | `app/(login)/actions.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1902669)
- [Signup → Checkout funnel (wizard)](https://us.posthog.com/project/483112/insights/TC2sVfQB)
- [New signups over time (wizard)](https://us.posthog.com/project/483112/insights/V1B2qBN0)
- [Daily active users (wizard)](https://us.posthog.com/project/483112/insights/1E1a10BZ)
- [Subscription events over time (wizard)](https://us.posthog.com/project/483112/insights/O2w77yJR)
- [Team engagement over time (wizard)](https://us.posthog.com/project/483112/insights/QICcC8dB)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
