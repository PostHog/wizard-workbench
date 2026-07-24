# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CMSaasStarter SvelteKit project. Here is a summary of all changes made:

- **`src/hooks.client.ts`** (new) — Initializes `posthog-js` via the SvelteKit `init()` hook with a reverse proxy at `/ingest`, exception autocapture, and client-side `handleError` for automatic error tracking.
- **`src/lib/server/posthog.ts`** (new) — Singleton `getPostHogClient()` factory for `posthog-node` configured with `flushAt: 1` and `flushInterval: 0` to ensure events are not silently dropped in short-lived server handlers.
- **`src/hooks.server.ts`** — Added a `posthogProxy` Handle that routes `/ingest` requests to `us.i.posthog.com` (and `/ingest/static/`, `/ingest/array/` to `us-assets.i.posthog.com`) to avoid ad blockers. Added `handleError` for server-side error tracking.
- **`svelte.config.js`** — Added `paths.relative: false` required for PostHog session replay to work correctly with SSR.
- **`src/routes/(marketing)/login/sign_in/+page.svelte`** — Calls `posthog.identify()` and captures `sign_in` on Supabase `SIGNED_IN` auth state change.
- **`src/routes/(marketing)/login/sign_up/+page.svelte`** — Listens for `SIGNED_IN` on the sign-up page (which fires for new registrations), identifies the user, and captures `signed_up`.
- **`src/routes/(admin)/account/+layout.svelte`** — Calls `posthog.identify()` on mount when a session already exists, ensuring returning visitors are identified on page refresh.
- **`src/routes/(admin)/account/sign_out/+page.svelte`** — Calls `posthog.reset()` after successful Supabase sign-out to clear the identified session.
- **`src/routes/(admin)/account/api/+page.server.ts`** — Added server-side PostHog captures for `profile_created`, `profile_updated`, `account_deleted`, `password_changed`, `email_change_initiated`, and `email_subscription_toggled`. Each uses the Supabase user ID as `distinctId` and calls `posthog.flush()` before returning.
- **`src/routes/(admin)/account/subscribe/[slug]/+page.server.ts`** — Captures `subscription_checkout_started` with `plan_id` property before redirecting to Stripe.
- **`src/routes/(admin)/account/(menu)/billing/manage/+page.server.ts`** — Captures `billing_portal_opened` before redirecting to the Stripe billing portal.
- **`src/routes/(marketing)/contact_us/+page.server.ts`** — Captures `contact_us_submitted` after successful form submission and email dispatch.
- **`src/routes/(marketing)/pricing/pricing_module.svelte`** — Captures `plan_selected` with `plan_id`, `plan_name`, and `plan_price` when a visitor clicks a pricing plan button.
- **`.env`** — Added `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST`.

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `sign_in` | User successfully signs in via the sign-in page | `src/routes/(marketing)/login/sign_in/+page.svelte` |
| `signed_up` | New user successfully completes registration | `src/routes/(marketing)/login/sign_up/+page.svelte` |
| `profile_created` | User creates their profile for the first time | `src/routes/(admin)/account/api/+page.server.ts` |
| `profile_updated` | User updates their existing profile information | `src/routes/(admin)/account/api/+page.server.ts` |
| `subscription_checkout_started` | User redirected to Stripe checkout for a subscription | `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` |
| `billing_portal_opened` | User redirected to Stripe billing portal | `src/routes/(admin)/account/(menu)/billing/manage/+page.server.ts` |
| `account_deleted` | User successfully deletes their account | `src/routes/(admin)/account/api/+page.server.ts` |
| `password_changed` | User successfully changes their password | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_change_initiated` | User initiates an email address change | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_subscription_toggled` | User toggles marketing email subscription | `src/routes/(admin)/account/api/+page.server.ts` |
| `contact_us_submitted` | Visitor submits the contact us form | `src/routes/(marketing)/contact_us/+page.server.ts` |
| `plan_selected` | User clicks a pricing plan button | `src/routes/(marketing)/pricing/pricing_module.svelte` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1901952)
- [Sign-ups & Sign-ins over time (wizard)](https://us.posthog.com/project/483112/insights/kKCELjFJ)
- [Signup to subscription funnel (wizard)](https://us.posthog.com/project/483112/insights/i4sxbYme)
- [Plan selections by plan (wizard)](https://us.posthog.com/project/483112/insights/0l5M8R6Y)
- [Account deletions over time (wizard)](https://us.posthog.com/project/483112/insights/VpwScrd7)
- [Contact form submissions (wizard)](https://us.posthog.com/project/483112/insights/6PhTrKY3)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the admin layout identifies on mount, but verify sessions persisted via cookie correctly carry the Supabase user ID through to PostHog on each page load.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
