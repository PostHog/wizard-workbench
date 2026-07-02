<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router SaaS application. The setup includes client-side initialization via `instrumentation-client.ts`, a reverse proxy configuration in `next.config.ts`, a shared server-side PostHog client in `lib/posthog-server.ts`, user identification on sign-in and sign-up, and 13 events tracked across 9 files spanning both client and server code. Error tracking via `captureException` was added to all critical client-side flows.

| Event Name | Description | File |
|---|---|---|
| `user_signed_up` | User successfully completed sign-up and was redirected to the dashboard. | `components/login.tsx` |
| `user_signed_in` | User successfully signed in and was redirected to the dashboard. | `components/login.tsx` |
| `user_signed_out` | User clicked sign out from the header dropdown menu. | `components/header.tsx` |
| `pricing_plan_selected` | User clicked 'Get Started' on a pricing plan card to begin checkout. | `pages/pricing.tsx` |
| `manage_subscription_clicked` | User clicked 'Manage Subscription' to open the Stripe customer portal. | `pages/dashboard/index.tsx` |
| `team_member_invited` | User successfully sent a team invitation to another email address. | `pages/dashboard/index.tsx` |
| `team_member_removed` | User successfully removed a member from their team. | `pages/dashboard/index.tsx` |
| `account_updated` | User successfully updated their account name or email in general settings. | `pages/dashboard/general.tsx` |
| `server_user_signed_up` | Server confirmed a new user account was created successfully. | `pages/api/auth/sign-up.ts` |
| `server_user_signed_in` | Server confirmed a user authenticated successfully. | `pages/api/auth/sign-in.ts` |
| `server_checkout_started` | Server created a Stripe checkout session for a user selecting a plan. | `pages/api/stripe/create-checkout.ts` |
| `server_checkout_completed` | Server confirmed a Stripe checkout session was completed and subscription activated. | `pages/api/stripe/checkout.ts` |
| `server_subscription_updated` | Stripe webhook confirmed a subscription was updated or cancelled. | `pages/api/stripe/webhook.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1792953)
- [New Signups (wizard)](https://us.posthog.com/project/483112/insights/DfrjIVp0)
- [Daily Active Users (wizard)](https://us.posthog.com/project/483112/insights/oilEnaxe)
- [Pricing to Checkout Funnel (wizard)](https://us.posthog.com/project/483112/insights/BIyVqwrp)
- [Team Invitations Sent (wizard)](https://us.posthog.com/project/483112/insights/3u9NSR41)
- [Subscription Completions (wizard)](https://us.posthog.com/project/483112/insights/ron3CZgV)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
