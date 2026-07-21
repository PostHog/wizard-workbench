# PostHog post-wizard report

The wizard integrated PostHog into this Next.js Pages Router application for both browser and server runtimes. It installed `posthog-js` and `posthog-node`, initialized browser analytics and exception autocapture, added a server client with per-request flushing, configured the required environment variables, identifies authenticated users, resets identity on sign-out, and instruments key authentication, checkout, subscription, account, and team-management actions without putting PII in event properties.

| Event | Description | File |
|---|---|---|
| `user_signed_in` | A user successfully signs in to an existing account. | `pages/api/auth/sign-in.ts` |
| `user_signed_up` | A user successfully creates an account. | `pages/api/auth/sign-up.ts` |
| `user_signed_out` | An authenticated user signs out from the application. | `components/header.tsx` |
| `checkout_started` | A visitor or user starts the checkout flow for a selected plan. | `pages/pricing.tsx` |
| `checkout_session_created` | The server successfully creates a checkout session for an authenticated user. | `pages/api/stripe/create-checkout.ts` |
| `subscription_started` | A completed checkout is persisted as an active subscription. | `pages/api/stripe/checkout.ts` |
| `subscription_status_changed` | Stripe reports an update or deletion to a subscription. | `pages/api/stripe/webhook.ts` |
| `account_updated` | An authenticated user successfully updates account details. | `pages/api/account/update.ts` |
| `team_member_invited` | An authenticated user successfully invites a team member. | `pages/api/team/invite.ts` |
| `team_member_removed` | An authenticated user removes a member from their team. | `pages/api/team/remove-member.ts` |

## Next steps

Dashboard and notebook creation could not be completed because the PostHog MCP endpoint was unavailable during this run. The integration targets PostHog project 483112 and is ready to populate insights once events arrive.

## Verify before merging

- [ ] Run a full production build after configuring `POSTGRES_URL`; the wizard's build compiled and passed type checking, but page-data collection stopped because that existing database environment variable was missing.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or the bundler upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify`; the current integration identifies users after successful sign-in or sign-up and when account person properties change.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
