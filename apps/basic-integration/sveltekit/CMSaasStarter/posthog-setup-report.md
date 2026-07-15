# PostHog post-wizard report

PostHog has been added to the SvelteKit application with browser initialization, server-side event capture, exception capture, user identification during authentication, and session-replay-compatible paths configuration. Events use environment variables and server-side requests flush before returning.

| Event | Description | File |
| --- | --- | --- |
| `user_signed_in` | A user successfully signs in through Supabase authentication. | `src/routes/(marketing)/login/sign_in/+page.svelte` |
| `user_signed_up` | A user completes account creation through the signup flow. | `src/routes/(marketing)/login/sign_up/+page.svelte` |
| `checkout_started` | An authenticated user starts a Stripe subscription checkout session. | `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` |
| `email_subscription_toggled` | A user changes their email subscription preference. | `src/routes/(admin)/account/api/+page.server.ts` |
| `profile_updated` | A user successfully creates or updates their profile. | `src/routes/(admin)/account/api/+page.server.ts` |
| `account_deleted` | A user successfully deletes their account. | `src/routes/(admin)/account/api/+page.server.ts` |
| `user_signed_out` | An authenticated user signs out. | `src/routes/(admin)/account/sign_out/+page.svelte` |

## Next steps

Dashboard and notebook creation could not be completed because the PostHog MCP server was unavailable in this run. The production bundle compiles, but prerendering requires the project's existing Supabase environment variables, which were not configured in this environment.

## Verify before merging

- [ ] Run a full production build with the project's Supabase environment variables and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite and update mocks or fixtures if needed.
- [ ] Confirm the PostHog environment variables are configured in each deployment environment.
- [ ] Wire source-map upload into CI so production stack traces de-minify.
- [x] Confirm the returning-visitor path calls `identify` for authenticated sessions.

### Agent skill

The installed integration skill is available in `.claude/skills/integration-sveltekit` for future agent development.
