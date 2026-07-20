# PostHog post-wizard report

The wizard integrated PostHog into this Next.js Pages Router application. It installed the browser and Node.js SDKs, initialized browser analytics and exception capture, added a short-lived server client with immediate flushing, identifies authenticated users on login, signup, and returning sessions, resets identity on logout, and instruments key authentication, checkout, subscription, and team-management actions. PostHog configuration is read from `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` in `.env.local`.

| Event | Description | File |
| --- | --- | --- |
| `user_signed_in` | A user successfully signed in to an existing account. | `pages/api/auth/sign-in.ts` |
| `user_signed_up` | A user successfully created an account or accepted a team invitation. | `pages/api/auth/sign-up.ts` |
| `checkout_started` | An authenticated user successfully created a Stripe checkout session. | `pages/api/stripe/create-checkout.ts` |
| `customer_portal_opened` | A user successfully opened the subscription management portal. | `pages/api/stripe/customer-portal.ts` |
| `subscription_changed` | Stripe reported that a subscription was updated or deleted. | `pages/api/stripe/webhook.ts` |
| `team_member_invited` | A team owner successfully invited a new team member. | `pages/api/team/invite.ts` |
| `team_member_removed` | A team member was successfully removed from a team. | `pages/api/team/remove-member.ts` |
| `user_signed_out` | A signed-in user initiated sign out in the browser. | `components/header.tsx` |

## Next steps

The PostHog MCP service was unavailable during dashboard and notebook creation, so no shareable dashboard, insights, or notebook links could be generated. Re-run that step when the MCP service is reachable and create the `Analytics basics (wizard)` dashboard from the exact event names above.

## Verify before merging

- [ ] Run a full production build and provide the required `POSTGRES_URL`; the integration compiled and passed TypeScript checking, but page-data collection could not complete without the existing database configuration.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or a bundler upload step) into CI so production stack traces de-minify.
- [ ] Confirm a returning authenticated visit identifies the user in PostHog and that login/signup server events correlate to the same distinct ID.

### Agent skill

We've left an agent skill folder in the project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
