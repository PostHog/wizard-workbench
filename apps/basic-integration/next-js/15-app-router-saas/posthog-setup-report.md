<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 App Router SaaS application. PostHog is initialized client-side via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+) and a reverse proxy is configured in `next.config.ts` to route PostHog traffic through `/ingest` to avoid ad blockers. A server-side PostHog client (`lib/posthog-server.ts`) is used across Server Actions and API routes. Ten business-critical events are captured across the authentication, payments, and team management flows, with `identify` calls on sign-in and sign-up to correlate client and server events to the same user.

| Event name | Description | File |
|---|---|---|
| `user_signed_up` | A new user successfully created an account. | `app/(login)/actions.ts` |
| `user_signed_in` | An existing user successfully signed in. | `app/(login)/actions.ts` |
| `user_signed_out` | A user signed out of their account. | `app/(login)/actions.ts` |
| `checkout_started` | A user initiated a Stripe checkout session for a subscription plan. | `lib/payments/actions.ts` |
| `subscription_activated` | A user's subscription was successfully activated after completing checkout. | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | A team's subscription plan or status was updated via Stripe webhook. | `lib/payments/stripe.ts` |
| `subscription_canceled` | A team's subscription was canceled or became unpaid via Stripe webhook. | `lib/payments/stripe.ts` |
| `team_member_invited` | A team owner invited a new member to join their team. | `app/(login)/actions.ts` |
| `team_member_removed` | A team member was removed from the team. | `app/(login)/actions.ts` |
| `account_deleted` | A user permanently deleted their account. | `app/(login)/actions.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1812605)
- [New signups over time (wizard)](https://us.posthog.com/project/483112/insights/w6GUtyll)
- [Signup to subscription funnel (wizard)](https://us.posthog.com/project/483112/insights/358Yfp1l)
- [Subscription cancellations (wizard)](https://us.posthog.com/project/483112/insights/19qogeQn)
- [Active users (signins) (wizard)](https://us.posthog.com/project/483112/insights/q0P6gr6C)
- [Team invitations sent (wizard)](https://us.posthog.com/project/483112/insights/ZBO0yMhr)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — currently `identify` is called only on sign-in and sign-up; a handler that refreshes the page while already logged in will create an anonymous session until the user signs in again.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
