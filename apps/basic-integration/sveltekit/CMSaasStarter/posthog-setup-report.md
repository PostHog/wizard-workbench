# PostHog post-wizard report

The wizard completed a SvelteKit PostHog integration covering client initialization, a reverse proxy for browser ingestion, server-side analytics helpers, user identification for authenticated sessions, exception capture in client and server hooks, and targeted business-event instrumentation for onboarding, contact, account, and billing flows. Environment variables were added for the PostHog project token and host, `posthog-js` and `posthog-node` were installed, and session replay support was enabled in `svelte.config.js` by setting `paths.relative` to `false`.

| Event name | Description | File |
| --- | --- | --- |
| `contact_request_submitted` | Captures successful contact form submissions from marketing visitors. | `src/routes/(marketing)/contact_us/+page.server.ts` |
| `checkout_session_started` | Captures when an authenticated user starts a paid checkout session for a plan. | `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` |
| `email_subscription_toggled` | Captures when a signed-in user changes their email subscription preference. | `src/routes/(admin)/account/api/+page.server.ts` |
| `account_email_update_requested` | Captures when a signed-in user requests an email address change. | `src/routes/(admin)/account/api/+page.server.ts` |
| `account_password_updated` | Captures when a signed-in user successfully changes their password. | `src/routes/(admin)/account/api/+page.server.ts` |
| `account_deleted` | Captures when a signed-in user successfully deletes their account. | `src/routes/(admin)/account/api/+page.server.ts` |
| `profile_created` | Captures when a signed-in user creates their company profile for the first time. | `src/routes/(admin)/account/api/+page.server.ts` |
| `profile_updated` | Captures when a signed-in user updates their company profile. | `src/routes/(admin)/account/api/+page.server.ts` |
| `user_signed_in` | Captures when a client session becomes authenticated and the user is identified. | `src/routes/(marketing)/login/sign_in/+page.svelte` |
| `user_signed_out` | Captures when a signed-in user signs out from the account area. | `src/routes/(admin)/account/api/+page.server.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1846875)
- [Profile creation volume (wizard)](https://us.posthog.com/project/483112/insights/ctVdrdyA)
- [Plan checkout starts (wizard)](https://us.posthog.com/project/483112/insights/DwNWlBup)
- [Contact requests submitted (wizard)](https://us.posthog.com/project/483112/insights/1z0d8SdZ)
- [Signup to profile funnel (wizard)](https://us.posthog.com/project/483112/insights/SFe0wHGB)
- [Subscription preference changes (wizard)](https://us.posthog.com/project/483112/insights/KGFeKg16)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
