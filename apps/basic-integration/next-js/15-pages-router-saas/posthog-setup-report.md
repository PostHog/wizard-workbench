# PostHog post-wizard report

The wizard has completed a deep integration of this Next.js Pages Router SaaS starter with PostHog product analytics on both the client and server. The integration adds browser initialization through `instrumentation-client.ts`, a Next.js reverse proxy in `next.config.ts`, and a shared server-side `posthog-node` client in `lib/posthog-server.ts`. It also instruments key authentication, billing, team-management, and account-management flows while keeping personally identifiable information on person profiles via `identify()` instead of event properties. Environment variables were written to `.env.local` using Next.js `NEXT_PUBLIC_` naming, and a PostHog dashboard with five saved insights was created in the linked PostHog project.

| Event name | Description | File |
| --- | --- | --- |
| user_signed_in | Captures a successful user sign-in from the client and server. | components/login.tsx |
| user_signed_up | Captures successful account creation and onboarding entry. | components/login.tsx |
| checkout_started | Captures when a user starts a subscription checkout flow. | pages/pricing.tsx |
| subscription_checkout_created | Captures when the server creates a Stripe checkout session. | pages/api/stripe/create-checkout.ts |
| subscription_checkout_completed | Captures when a Stripe checkout completes successfully. | pages/api/stripe/checkout.ts |
| billing_portal_opened | Captures when a signed-in user opens the billing portal. | pages/dashboard/index.tsx |
| team_member_invited | Captures when an owner invites a team member. | pages/dashboard/index.tsx |
| team_member_removed | Captures when a team member is removed from a workspace. | pages/dashboard/index.tsx |
| account_updated | Captures when a user saves updated account details. | pages/dashboard/general.tsx |
| user_signed_out | Captures when a user signs out of the application. | components/header.tsx |
| subscription_status_changed | Captures Stripe webhook subscription lifecycle changes. | pages/api/stripe/webhook.ts |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1846757)
- [User sign-ins (wizard)](https://us.posthog.com/project/483112/insights/GF3AJy8V)
- [User sign-ups (wizard)](https://us.posthog.com/project/483112/insights/6n5NPRYZ)
- [Checkout starts (wizard)](https://us.posthog.com/project/483112/insights/z5OfdOK5)
- [Subscription completions (wizard)](https://us.posthog.com/project/483112/insights/vh4VmIW6)
- [Signup to subscription funnel (wizard)](https://us.posthog.com/project/483112/insights/x6nXUXBl)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
