<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of this Next.js Pages Router project with PostHog product analytics and error tracking. The integration adds client-side initialization through `instrumentation-client.ts`, a reverse-proxy rewrite setup in `next.config.ts`, environment-based configuration via `.env.local`, client-side event capture for authentication, checkout, team invites, account updates, and sign-out, plus server-side event capture for sign-in, sign-up, checkout session creation, sign-out correlation, and Stripe subscription webhook updates.

| Event name | Description | File |
| --- | --- | --- |
| pricing_checkout_started | Captures when a visitor starts a checkout flow from the pricing page. | pages/pricing.tsx |
| user_signed_in | Captures when a user successfully signs in from the authentication form. | components/login.tsx |
| user_signed_up | Captures when a user successfully creates an account from the authentication form. | components/login.tsx |
| user_signed_out | Captures when an authenticated user signs out from the user menu. | components/header.tsx |
| team_invite_submitted | Captures when a team owner submits an invitation for a new team member. | pages/dashboard/index.tsx |
| account_update_submitted | Captures when a user saves updated account details from settings. | pages/dashboard/general.tsx |
| server_sign_in_succeeded | Captures when the sign-in API authenticates a user successfully. | pages/api/auth/sign-in.ts |
| server_sign_up_succeeded | Captures when the sign-up API creates an account successfully. | pages/api/auth/sign-up.ts |
| server_checkout_session_created | Captures when the server creates a Stripe checkout session. | pages/api/stripe/create-checkout.ts |
| server_subscription_updated | Captures when a Stripe subscription webhook updates team billing state. | pages/api/stripe/webhook.ts |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: https://us.posthog.com/project/483112/dashboard/1796159
- Insight: Sign-up completions (wizard) — https://us.posthog.com/project/483112/insights/NNRUOJIN
- Insight: Sign-in completions (wizard) — https://us.posthog.com/project/483112/insights/fujFarUY
- Insight: Checkout starts (wizard) — https://us.posthog.com/project/483112/insights/x8pYKBXr
- Insight: Server checkout sessions (wizard) — https://us.posthog.com/project/483112/insights/NKlx3uhp
- Insight: Team invitations submitted (wizard) — https://us.posthog.com/project/483112/insights/yy4HeG3R

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
