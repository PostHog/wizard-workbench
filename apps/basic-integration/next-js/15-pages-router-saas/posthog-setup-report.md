<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of this Next.js Pages Router project with PostHog. The work included installing `posthog-js` and `posthog-node`, initializing the browser SDK through `instrumentation-client.ts`, wiring a reverse proxy through Next.js rewrites, adding PostHog environment variables in `.env.local`, creating a reusable server-side PostHog helper, identifying authenticated users on login and signup, and instrumenting client and server events across authentication, billing, team collaboration, and account management flows. A targeted build verification was also run; the PostHog changes compiled successfully, but the full production build is still blocked by an unrelated missing `POSTGRES_URL` environment variable required by the app.

| Event name | Description | File |
| --- | --- | --- |
| auth_form_submitted | Captures when a user successfully submits the sign-in or sign-up form on the client. | components/login.tsx |
| user_signed_in | Captures when sign-in succeeds on the server. | pages/api/auth/sign-in.ts |
| user_signed_up | Captures when sign-up succeeds on the server. | pages/api/auth/sign-up.ts |
| user_signed_out | Captures when a signed-in user signs out from the client and server. | components/header.tsx; pages/api/auth/sign-out.ts |
| checkout_started | Captures when a user starts a Stripe checkout flow from pricing. | pages/pricing.tsx |
| checkout_session_created | Captures when the server creates a Stripe checkout session. | pages/api/stripe/create-checkout.ts |
| checkout_completed | Captures when Stripe checkout completes and the team subscription is activated. | pages/api/stripe/checkout.ts |
| billing_portal_opened | Captures when a user opens the Stripe billing portal from team settings. | pages/dashboard/index.tsx; pages/api/stripe/customer-portal.ts |
| team_member_invited | Captures when a team owner invites a member from team settings and the server stores the invitation. | pages/dashboard/index.tsx; pages/api/team/invite.ts |
| team_member_removed | Captures when a team owner removes a member from team settings and the server processes the removal. | pages/dashboard/index.tsx; pages/api/team/remove-member.ts |
| account_updated | Captures when a user saves account profile changes from general settings. | pages/dashboard/general.tsx; pages/api/account/update.ts |
| stripe_webhook_processed | Captures when a Stripe subscription webhook is successfully processed. | pages/api/stripe/webhook.ts |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1831063)
- [Signups by source (wizard)](https://us.posthog.com/project/483112/insights/60qtzqHp)
- [Checkout completions (wizard)](https://us.posthog.com/project/483112/insights/CHN18yTq)
- [Account updates (wizard)](https://us.posthog.com/project/483112/insights/ClZoItBT)
- [Team invitations sent (wizard)](https://us.posthog.com/project/483112/insights/wOF1I7Zn)
- [Signup to checkout funnel (wizard)](https://us.posthog.com/project/483112/insights/4qRCFhKt)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names added here to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
