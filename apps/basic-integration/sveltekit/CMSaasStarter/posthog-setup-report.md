# PostHog post-wizard report

The wizard integrated PostHog into the SvelteKit client and server runtimes, enabled browser and server exception capture, preserved default autocapture and session recording behavior, configured SSR-compatible session replay paths, identified authenticated users, and added server-side analytics for key lead, billing, profile, and account lifecycle actions. Server events use the authenticated Supabase user ID where available and flush before request completion.

| Event | Description | File |
| --- | --- | --- |
| `user_signed_in` | An authenticated user signs in, with the authentication provider recorded. | `src/routes/(marketing)/login/sign_in/+page.svelte` |
| `user_signed_out` | An authenticated user signs out of the application. | `src/routes/(admin)/account/sign_out/+page.svelte`, `src/routes/(admin)/account/api/+page.server.ts` |
| `contact_request_submitted` | A visitor successfully submits the contact request form. | `src/routes/(marketing)/contact_us/+page.server.ts` |
| `checkout_started` | An authenticated user starts a Stripe subscription checkout for a paid plan. | `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` |
| `billing_portal_opened` | An authenticated customer opens the Stripe billing portal. | `src/routes/(admin)/account/(menu)/billing/manage/+page.server.ts` |
| `profile_saved` | An authenticated user successfully creates or updates their profile. | `src/routes/(admin)/account/api/+page.server.ts` |
| `account_deleted` | An authenticated user successfully deletes their account. | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_subscription_updated` | An authenticated user changes their email subscription preference. | `src/routes/(admin)/account/api/+page.server.ts` |

## Next steps

The PostHog dashboard and notebook could not be created because the configured PostHog MCP server was unavailable during setup. Reconnect the MCP server, then create **Analytics basics (wizard)** with insights for the checkout funnel, contact leads, profile activation, subscription preferences, and account deletion.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or the bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path calls `identify` after an authenticated account layout loads.

### Agent skill

We've left an agent skill folder in the project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
