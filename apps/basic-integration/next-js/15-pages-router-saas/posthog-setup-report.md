# PostHog post-wizard report

The wizard installed the PostHog browser and Node.js SDKs, initialized browser analytics and exception capture through Next.js instrumentation, added a flush-safe server client, configured local PostHog environment variables, identified authenticated users, reset identity on logout, and instrumented critical authentication, checkout, subscription, and team-management actions. Autocapture and session recording remain at their defaults.

| Event | Description | File |
| --- | --- | --- |
| `user_signed_in` | A user successfully signed in to an existing account. | `pages/api/auth/sign-in.ts` |
| `user_signed_up` | A user successfully created an account and joined or created a team. | `pages/api/auth/sign-up.ts` |
| `checkout_started` | An authenticated user successfully created a checkout session for a selected price. | `pages/api/stripe/create-checkout.ts` |
| `subscription_changed` | Stripe reported a subscription update or deletion that was processed by the application. | `pages/api/stripe/webhook.ts` |
| `team_member_invited` | A team owner successfully invited a new team member. | `pages/api/team/invite.ts` |
| `team_member_removed` | A team member was successfully removed from a team. | `pages/api/team/remove-member.ts` |
| `user_signed_out` | A signed-in user successfully ended their session. | `components/header.tsx` |

## Next steps

The dashboard and notebook could not be created because the PostHog MCP server was unavailable at runtime. Reconnect the configured PostHog MCP server and create **Analytics basics (wizard)** with insights over the event contract above.

## Verify before merging

- [ ] Run a full production build after configuring `POSTGRES_URL`; the wizard's build compiled and type-checked successfully but page-data collection stopped because that existing environment variable was missing.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path calls `identify` after `/api/user` loads and that login/signup sessions merge with the same numeric user ID.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
