# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the CMSaasStarter SvelteKit project. Here is a summary of what was set up:

- **`src/hooks.client.ts`** (new) — Initialises `posthog-js` via the SvelteKit `init` hook, routing events through the `/ingest` reverse proxy. Also registers a `handleError` hook to automatically capture all client-side exceptions.
- **`src/hooks.server.ts`** (updated) — Adds a `posthogProxy` handle to proxy `/ingest` requests to PostHog servers (avoiding ad blockers), and a `handleError` hook to capture server-side errors via `posthog-node`.
- **`src/lib/server/posthog.ts`** (new) — Singleton `getPostHogClient()` for the `posthog-node` SDK used in all server-side event tracking.
- **`svelte.config.js`** (updated) — Added `paths.relative: false` required for PostHog session replay to work correctly under SSR.
- **`src/routes/(marketing)/login/sign_in/+page.svelte`** (updated) — Calls `posthog.identify()` and captures `user_signed_in` when Supabase Auth state changes to `SIGNED_IN`.
- **`src/routes/(admin)/account/sign_out/+page.svelte`** (updated) — Captures `user_signed_out` then calls `posthog.reset()` on successful sign-out.
- **`src/routes/(marketing)/pricing/pricing_module.svelte`** (updated) — Captures `plan_selected` with `plan_id` and `plan_name` when a user clicks a pricing plan CTA.
- **`src/routes/(admin)/account/api/+page.server.ts`** (updated) — Server-side events for `profile_created`, `profile_updated`, `account_deleted`, `email_updated`, `password_updated`, and `email_subscription_toggled`.
- **`src/routes/(admin)/account/subscribe/[slug]/+page.server.ts`** (updated) — Captures `subscription_checkout_started` with `plan_id` when a Stripe checkout session is created.
- **`src/routes/(marketing)/contact_us/+page.server.ts`** (updated) — Captures `contact_form_submitted` after a successful contact request is saved.

| Event name | Description | File |
|---|---|---|
| `user_signed_in` | Captured when a user successfully authenticates via the sign-in page. | `src/routes/(marketing)/login/sign_in/+page.svelte` |
| `user_signed_out` | Captured when a user completes the sign-out flow and PostHog is reset. | `src/routes/(admin)/account/sign_out/+page.svelte` |
| `plan_selected` | Captured when a user clicks the call-to-action button on a pricing plan card. | `src/routes/(marketing)/pricing/pricing_module.svelte` |
| `profile_created` | Captured server-side when a user submits their profile for the first time. | `src/routes/(admin)/account/api/+page.server.ts` |
| `profile_updated` | Captured server-side when an existing user updates their profile information. | `src/routes/(admin)/account/api/+page.server.ts` |
| `account_deleted` | Captured server-side when a user permanently deletes their account. | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_updated` | Captured server-side when a user requests an email address change. | `src/routes/(admin)/account/api/+page.server.ts` |
| `password_updated` | Captured server-side when a user successfully changes their password. | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_subscription_toggled` | Captured server-side when a user toggles their email marketing subscription status. | `src/routes/(admin)/account/api/+page.server.ts` |
| `subscription_checkout_started` | Captured server-side when a Stripe checkout session is created for a subscription plan. | `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` |
| `contact_form_submitted` | Captured server-side when a visitor successfully submits the contact form. | `src/routes/(marketing)/contact_us/+page.server.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1813125)
- [Sign-ins over time (wizard)](https://us.posthog.com/project/483112/insights/h7zu7DC8)
- [Account deletions over time (wizard)](https://us.posthog.com/project/483112/insights/vzIqq1K0)
- [Subscription checkout funnel (wizard)](https://us.posthog.com/project/483112/insights/wJA7A1k6)
- [Profile creations over time (wizard)](https://us.posthog.com/project/483112/insights/cMFOtthS)
- [Contact form submissions (wizard)](https://us.posthog.com/project/483112/insights/Z9EU4YOU)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — currently `identify` is only called on fresh login via the Supabase `SIGNED_IN` event. Consider calling `identify` in the account layout's `onMount` if a session already exists, so returning visitors are identified without a new sign-in.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
