# PostHog post-wizard report

The wizard has completed a deep integration of this Next.js Pages Router SaaS starter with PostHog on both the client and server. The integration adds browser initialization through `instrumentation-client.ts`, a reusable server client for API-route captures and exception tracking, user identification on authenticated page loads, client-side captures around signup, signin, signout, pricing, and billing portal actions, and server-side captures for authentication, checkout, webhook, team management, and account update flows. A managed Next.js rewrite proxy was also added for client ingestion, and local PostHog environment variables were written to `.env.local`.

| Event name | Description | File |
| --- | --- | --- |
| pricing_viewed | Captures when the pricing page is viewed as a top-of-funnel conversion step. | pages/pricing.tsx |
| checkout_started | Captures when a visitor starts the checkout flow for a selected plan. | pages/pricing.tsx |
| user_signed_in | Captures when an existing user successfully signs in. | components/login.tsx, pages/api/auth/sign-in.ts |
| user_signed_up | Captures when a new user account is created successfully. | components/login.tsx, pages/api/auth/sign-up.ts |
| user_signed_out | Captures when a signed-in user signs out. | components/header.tsx, pages/api/auth/sign-out.ts |
| checkout_session_created | Captures when the backend creates a Stripe checkout session. | pages/api/stripe/create-checkout.ts |
| subscription_checkout_completed | Captures when a Stripe checkout session is verified and the team subscription is updated. | pages/api/stripe/checkout.ts |
| stripe_subscription_updated | Captures when the Stripe webhook processes a subscription update or deletion event. | pages/api/stripe/webhook.ts |
| team_member_invited | Captures when a team owner successfully sends a team invitation. | pages/api/team/invite.ts |
| team_member_removed | Captures when a team member is removed from a team. | pages/api/team/remove-member.ts |
| account_updated | Captures when a signed-in user updates account details. | pages/api/account/update.ts |
| subscription_portal_opened | Captures when a signed-in user opens the billing portal from settings. | pages/dashboard/index.tsx, pages/api/stripe/customer-portal.ts |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1842148)
- [Pricing to signup funnel (wizard)](https://us.posthog.com/project/483112/insights/768nqeUe)
- [Subscriptions completed (wizard)](https://us.posthog.com/project/483112/insights/0sDQHFrc)
- [Checkout sessions created (wizard)](https://us.posthog.com/project/483112/insights/jQQRpUKT)
- [Pricing views (wizard)](https://us.posthog.com/project/483112/insights/uTBCV3vi)
- [Signups (wizard)](https://us.posthog.com/project/483112/insights/R5UOyCvT)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
