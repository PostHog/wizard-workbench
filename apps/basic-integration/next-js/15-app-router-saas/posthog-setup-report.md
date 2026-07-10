<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your project. PostHog client-side initialization was added with `instrumentation-client.ts`, a server-side helper was added for Next.js server actions and route handlers, authenticated users are now identified on page load, a reverse proxy was configured in `next.config.ts`, and product analytics plus error tracking were instrumented across authentication, billing, team management, and account security flows.

| Event name | Description | File |
| --- | --- | --- |
| sign_in_submitted | Captures when a visitor submits the sign-in form. | app/(login)/login.tsx |
| sign_up_submitted | Captures when a visitor submits the sign-up form. | app/(login)/login.tsx |
| user_signed_in | Captures when an existing user successfully signs in. | app/(login)/actions.ts |
| user_signed_up | Captures when a new user successfully creates an account. | app/(login)/actions.ts |
| user_signed_out | Captures when an authenticated user signs out. | app/(dashboard)/layout.tsx, app/(login)/actions.ts |
| pricing_checkout_started | Captures when a logged-in user starts checkout from pricing. | lib/payments/actions.ts |
| subscription_portal_opened | Captures when a team opens the billing portal. | lib/payments/actions.ts |
| checkout_session_created | Captures when a Stripe checkout session is created. | lib/payments/stripe.ts |
| checkout_completed | Captures when Stripe checkout is completed and applied to a team. | app/api/stripe/checkout/route.ts |
| subscription_webhook_processed | Captures when a Stripe subscription webhook is processed. | lib/payments/stripe.ts, app/api/stripe/webhook/route.ts |
| account_updated | Captures when a signed-in user updates account details. | app/(login)/actions.ts |
| password_updated | Captures when a signed-in user changes their password. | app/(login)/actions.ts |
| account_deleted | Captures when a signed-in user deletes their account. | app/(login)/actions.ts |
| team_member_invited | Captures when a team owner sends an invitation. | app/(login)/actions.ts |
| team_member_removed | Captures when a team owner removes a team member. | app/(login)/actions.ts |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1831059)
- [Signup to checkout funnel (wizard)](https://us.posthog.com/project/483112/insights/VgXrKqPX)
- [New users over time (wizard)](https://us.posthog.com/project/483112/insights/8RtvKOaG)
- [Successful sign-ins (wizard)](https://us.posthog.com/project/483112/insights/691ydQF9)
- [Billing lifecycle events (wizard)](https://us.posthog.com/project/483112/insights/jjkn8G7W)
- [Account risk events (wizard)](https://us.posthog.com/project/483112/insights/4gG0uOKj)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
