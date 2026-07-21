# PostHog post-wizard report

The wizard integrated PostHog across the Next.js Pages Router client and API runtime. It installed `posthog-js` and `posthog-node`, initialized browser analytics and exception capture, added a server client with request-safe flushing, correlated browser and server activity, identified authenticated users without putting PII on events, and instrumented core acquisition, subscription, account, and team workflows. PostHog configuration is read from `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` in `.env.local`.

| Event | Description | File |
| --- | --- | --- |
| `checkout_started` | A visitor selected a pricing plan and started the checkout flow. | `pages/pricing.tsx` |
| `user_signed_in` | A user successfully signed in. | `pages/api/auth/sign-in.ts` |
| `user_signed_up` | A user successfully created an account. | `pages/api/auth/sign-up.ts` |
| `user_signed_out` | A user signed out of the application. | `components/header.tsx` |
| `checkout_session_created` | An authenticated checkout session was successfully created. | `pages/api/stripe/create-checkout.ts` |
| `subscription_started` | A completed checkout was applied to the user's team subscription. | `pages/api/stripe/checkout.ts` |
| `subscription_changed` | Stripe reported a subscription update or deletion. | `pages/api/stripe/webhook.ts` |
| `customer_portal_opened` | A user successfully opened the Stripe customer portal. | `pages/api/stripe/customer-portal.ts` |
| `team_member_invited` | A team owner successfully invited a new member. | `pages/api/team/invite.ts` |
| `team_member_removed` | A team member was removed from a team. | `pages/api/team/remove-member.ts` |
| `account_updated` | A user successfully updated their account profile. | `pages/api/account/update.ts` |

## Next steps

Dashboard and notebook creation could not be completed because the PostHog MCP server was unavailable from this runtime. Once it is reachable, create **Analytics basics (wizard)** with a signup-to-subscription funnel, checkout funnel, subscription-change trend, team-growth trend, and account activity trend using the exact event names above.

## Verify before merging

- [ ] Provide `POSTGRES_URL`, run a full production build, and fix any lint or type errors introduced by the generated code. The integration compiled successfully, but page-data collection stopped because `POSTGRES_URL` was missing.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or the build pipeline's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify`; identification currently occurs after successful sign-in or sign-up and after account updates.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
