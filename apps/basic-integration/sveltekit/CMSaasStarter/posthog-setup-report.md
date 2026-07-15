# PostHog post-wizard report

The wizard has completed a SvelteKit PostHog integration. It installs the browser and Node SDKs, configures PostHog through public environment variables, initializes browser tracking in the client hook, and adds a same-origin `/ingest` proxy for analytics and session replay assets. Server-side errors are captured and the server SDK flushes per request. Session replay compatibility is enabled with non-relative asset paths.

Authenticated Supabase users are identified with their stable user ID; email is set only as a person property. The integration identifies both newly signed-in users and returning users with an existing session, and resets the browser identity after sign-out. No user-entered PII is included in event properties.

| Event name | Description | Added in |
| --- | --- | --- |
| `subscription_checkout_started` | Tracks when an authenticated user starts a paid subscription checkout session. | `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` |
| `billing_portal_opened` | Tracks when an authenticated user opens the billing management portal. | `src/routes/(admin)/account/(menu)/billing/manage/+page.server.ts` |
| `contact_request_submitted` | Tracks when a visitor successfully submits the contact form. | `src/routes/(marketing)/contact_us/+page.svelte` |
| `user_signed_in` | Tracks when an authenticated session is established in the browser. | `src/routes/(marketing)/login/sign_in/+page.svelte` |
| `user_signed_up` | Tracks when a new authenticated session is established after sign-up. | `src/routes/(marketing)/login/sign_up/+page.svelte` |
| `user_signed_out` | Tracks when a user successfully signs out. | `src/routes/(admin)/account/sign_out/+page.svelte` |

## Next steps

A dashboard and shareable notebook could not be created because the PostHog MCP server was unavailable in this runtime. Create an **Analytics basics (wizard)** dashboard after the MCP connection is restored, using the events above for signup, contact, checkout, and billing views.

## Verify before merging

- [ ] Run a full production build and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to any monorepo or bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path calls `identify` with a stable authenticated user ID.

### Agent skill

The project contains the installed agent skill folder under `.claude/skills/integration-sveltekit` for future PostHog development.
