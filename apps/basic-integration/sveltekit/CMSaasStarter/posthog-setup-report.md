<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this SvelteKit SaaS starter project. Here is a summary of changes made:

- **`src/hooks.client.ts`** (new): Initializes PostHog client-side with a reverse proxy at `/ingest`, captures client-side exceptions via `handleError`.
- **`src/hooks.server.ts`** (modified): Added a `posthogProxy` handler (prepended via `sequence()`) to reverse-proxy `/ingest` requests to PostHog, avoiding ad blockers. Also added `handleError` to capture server-side errors.
- **`src/lib/server/posthog.ts`** (new): Singleton factory for the server-side `posthog-node` client, configured with project token and host.
- **`svelte.config.js`** (modified): Added `paths.relative: false` — required for PostHog session replay to work correctly with SSR.
- **`.env`** (modified): Added `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` environment variables.

| Event Name | Description | File |
|---|---|---|
| `user_signed_in` | Tracks when a user successfully signs in via Supabase auth. Calls `posthog.identify()` with user ID. | `src/routes/(marketing)/login/sign_in/+page.svelte` |
| `user_signed_up` | Tracks when a new user completes sign-up via Supabase auth. Calls `posthog.identify()` with user ID. | `src/routes/(marketing)/login/sign_up/+page.svelte` |
| `subscription_checkout_started` | Tracks when a user initiates a Stripe checkout session to subscribe to a plan. | `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` |
| `contact_us_submitted` | Tracks when a user submits the contact form successfully. | `src/routes/(marketing)/contact_us/+page.server.ts` |
| `profile_updated` | Tracks when a user successfully updates their profile information. | `src/routes/(admin)/account/api/+page.server.ts` |
| `account_deleted` | Tracks when a user deletes their account. | `src/routes/(admin)/account/api/+page.server.ts` |
| `password_changed` | Tracks when a user successfully changes their password. | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_updated` | Tracks when a user requests an email address change. | `src/routes/(admin)/account/api/+page.server.ts` |
| `user_signed_out` | Tracks when a user signs out from the account. | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_subscription_toggled` | Tracks when a user toggles their email subscription preference. | `src/routes/(admin)/account/api/+page.server.ts` |
| `auth_callback_completed` | Tracks when an authentication callback (email verification or OAuth) is completed. | `src/routes/(marketing)/auth/callback/+server.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard:** [Analytics basics (wizard)](https://us.i.posthog.com/project/483112/dashboard/1761336)
- **Sign-up to subscription funnel:** [View insight](https://us.i.posthog.com/project/483112/insights/I6lkO1P6)
- **Daily active users signing in:** [View insight](https://us.i.posthog.com/project/483112/insights/fFUWjgAL)
- **Account churn:** [View insight](https://us.i.posthog.com/project/483112/insights/YtRCxE9H)
- **Contact form submissions:** [View insight](https://us.i.posthog.com/project/483112/insights/Q5EUGm7b)
- **Checkout conversion:** [View insight](https://us.i.posthog.com/project/483112/insights/moXxhffc)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
