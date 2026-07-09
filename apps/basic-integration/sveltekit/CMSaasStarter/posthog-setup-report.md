<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this CMSaasStarter SvelteKit application. Here is a summary of all changes made:

- **`src/hooks.client.ts`** (new): Initializes `posthog-js` on the client via the SvelteKit `init` hook, routing traffic through the `/ingest` reverse proxy. Also exports `handleError` to capture all client-side exceptions automatically.
- **`src/hooks.server.ts`** (updated): Added the `posthogProxy` handle (via `sequence`) to proxy PostHog requests through `/ingest`, avoiding ad blockers. Added `handleError` to capture server-side errors with `posthog-node`.
- **`src/lib/server/posthog.ts`** (new): Server-side PostHog singleton using `posthog-node`, configured with `flushAt: 1` and `flushInterval: 0` for immediate flushing in SvelteKit's serverless-style handlers.
- **`svelte.config.js`** (updated): Added `paths.relative: false` required for PostHog session replay to work correctly with SSR.
- **`src/routes/(admin)/account/+layout.svelte`** (updated): Calls `posthog.identify(session.user.id)` on every page load when a session is active, keeping returning visitors linked to their PostHog person.
- **`src/routes/(marketing)/login/sign_in/+page.svelte`** (updated): Calls `posthog.identify()` and captures `user_signed_in` on Supabase's `SIGNED_IN` auth state change.
- **`src/routes/(marketing)/login/sign_up/+page.svelte`** (updated): Calls `posthog.identify()` and captures `user_signed_up` on Supabase's `SIGNED_IN` auth state change.
- **`src/routes/(admin)/account/sign_out/+page.svelte`** (updated): Captures `user_signed_out` and calls `posthog.reset()` to unlink future events from the departing session.
- **`src/routes/(admin)/account/api/+page.server.ts`** (updated): Captures `profile_created`, `profile_updated`, `password_changed`, `email_changed`, `account_deleted`, and `email_subscription_toggled` server-side events.
- **`src/routes/(admin)/account/subscribe/[slug]/+page.server.ts`** (updated): Captures `subscription_checkout_started` with the Stripe price ID when a user initiates checkout.
- **`src/routes/(marketing)/contact_us/+page.server.ts`** (updated): Captures `contact_us_submitted` when a contact form is successfully saved.

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signs in to their account | `src/routes/(marketing)/login/sign_in/+page.svelte` |
| `user_signed_up` | User completes sign-up and creates a new account | `src/routes/(marketing)/login/sign_up/+page.svelte` |
| `user_signed_out` | User signs out of their account | `src/routes/(admin)/account/sign_out/+page.svelte` |
| `profile_created` | User creates their profile for the first time | `src/routes/(admin)/account/api/+page.server.ts` |
| `profile_updated` | User updates their profile details | `src/routes/(admin)/account/api/+page.server.ts` |
| `subscription_checkout_started` | User initiates checkout for a subscription plan | `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` |
| `contact_us_submitted` | User submits the contact us form | `src/routes/(marketing)/contact_us/+page.server.ts` |
| `password_changed` | User successfully changes their password | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_changed` | User successfully requests an email change | `src/routes/(admin)/account/api/+page.server.ts` |
| `account_deleted` | User deletes their account | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_subscription_toggled` | User changes their email subscription preference | `src/routes/(admin)/account/api/+page.server.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1824653)
- **Sign-up to subscription funnel**: [https://us.posthog.com/project/483112/insights/z1XwQe5g](https://us.posthog.com/project/483112/insights/z1XwQe5g)
- **New sign-ups over time**: [https://us.posthog.com/project/483112/insights/aQMWSyON](https://us.posthog.com/project/483112/insights/aQMWSyON)
- **Account deletions vs sign-ups**: [https://us.posthog.com/project/483112/insights/4L0BVOyz](https://us.posthog.com/project/483112/insights/4L0BVOyz)
- **Subscription checkout started**: [https://us.posthog.com/project/483112/insights/tHYDQpET](https://us.posthog.com/project/483112/insights/tHYDQpET)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify in PostHog Error Tracking.
- [ ] Confirm the returning-visitor path also calls `identify` — the admin layout calls it on every page load when a session is active, but verify this path works end-to-end after login and on a hard refresh.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-sveltekit/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
