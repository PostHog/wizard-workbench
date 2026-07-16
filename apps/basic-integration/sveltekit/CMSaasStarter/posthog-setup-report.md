# PostHog post-wizard report

PostHog has been integrated into this SvelteKit application with browser and server SDKs. The browser SDK initializes from public environment variables, preserves identity across authenticated sessions, resets identity on sign-out, and captures client errors. Server-side instrumentation uses a shared `posthog-node` client configured to flush for each request. Session replay compatibility is enabled through SvelteKit path configuration.

| Event name | Description | File |
| --- | --- | --- |
| `user_signed_in` | Tracks a successful authenticated sign-in with the authenticated user as the distinct ID. | `src/routes/(marketing)/login/sign_in/+page.svelte` |
| `contact_request_submitted` | Tracks a successfully saved contact request without submitted contact details. | `src/routes/(marketing)/contact_us/+page.server.ts` |
| `checkout_started` | Tracks creation of a Stripe subscription checkout session with the selected price identifier. | `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` |
| `profile_updated` | Tracks a successful profile update without profile fields. | `src/routes/(admin)/account/api/+page.server.ts` |
| `account_deletion_requested` | Tracks a successful request to delete an account. | `src/routes/(admin)/account/api/+page.server.ts` |

## Next steps

- Dashboard and notebook creation could not be completed because the PostHog MCP server was unavailable in this environment.
- Configure the two documented public PostHog variables for each deployment environment using the values supplied for this project.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

An agent skill folder remains in `.claude/skills/integration-sveltekit` for future PostHog development.
