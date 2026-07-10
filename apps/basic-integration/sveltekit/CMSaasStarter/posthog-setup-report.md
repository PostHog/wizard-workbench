# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this CMSaasStarter SvelteKit application. The integration covers client-side and server-side event tracking, user identification, error capture, a reverse proxy to avoid ad blockers, and session replay support.

**Key changes made:**

- `svelte.config.js` — added `paths.relative: false` (required for PostHog session replay with SSR)
- `src/hooks.client.ts` (new) — initialises PostHog on the client via the SvelteKit `init` hook, routing through `/ingest`; also captures client-side exceptions via `handleError`
- `src/hooks.server.ts` — added a `/ingest` reverse proxy handler and server-side `handleError` that captures `server_error` events with PostHog
- `src/lib/server/posthog.ts` (new) — singleton `getPostHogClient()` for server-side PostHog Node usage
- `src/routes/(marketing)/login/sign_in/+page.svelte` — captures `user_signed_in` and calls `posthog.identify()` on Supabase `SIGNED_IN` auth state change
- `src/routes/(marketing)/login/sign_up/+page.svelte` — captures `user_signed_up` and calls `posthog.identify()` on `SIGNED_UP`
- `src/routes/(admin)/account/sign_out/+page.svelte` — captures `user_signed_out` then calls `posthog.reset()`
- `src/routes/(admin)/account/+layout.svelte` — calls `posthog.identify()` on page load for already-authenticated users
- `src/routes/(marketing)/pricing/pricing_module.svelte` — captures `plan_selected` with `plan_id` and `plan_name` when a user clicks a plan
- `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` — captures `subscription_checkout_started` (server-side) with `price_id` and `customer_id`
- `src/routes/(admin)/account/(menu)/billing/manage/+page.server.ts` — captures `billing_portal_opened` (server-side) with `customer_id`
- `src/routes/(marketing)/contact_us/+page.server.ts` — captures `contact_form_submitted` (server-side) with `has_company` and `has_phone`
- `src/routes/(admin)/account/api/+page.server.ts` — captures `profile_created` / `profile_updated` with `posthog.identify()` for person properties; `password_changed`; `account_deleted`; `email_subscription_toggled`
- `.env` — `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` written

| Event | Description | File |
|-------|-------------|------|
| `user_signed_in` | Fires when a user successfully signs in via the Supabase auth state change. | `src/routes/(marketing)/login/sign_in/+page.svelte` |
| `user_signed_up` | Fires when a new user successfully signs up via the Supabase auth state change. | `src/routes/(marketing)/login/sign_up/+page.svelte` |
| `user_signed_out` | Fires when a user signs out from the dedicated sign-out page. | `src/routes/(admin)/account/sign_out/+page.svelte` |
| `plan_selected` | Fires when a user clicks to select a pricing plan on the pricing module. | `src/routes/(marketing)/pricing/pricing_module.svelte` |
| `subscription_checkout_started` | Fires on the server when a Stripe checkout session is successfully created for a subscription. | `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` |
| `billing_portal_opened` | Fires on the server when a user is redirected to the Stripe billing portal. | `src/routes/(admin)/account/(menu)/billing/manage/+page.server.ts` |
| `profile_created` | Fires on the server when a user creates their profile for the first time. | `src/routes/(admin)/account/api/+page.server.ts` |
| `profile_updated` | Fires on the server when a user updates their existing profile. | `src/routes/(admin)/account/api/+page.server.ts` |
| `contact_form_submitted` | Fires on the server when a contact form submission is successfully saved. | `src/routes/(marketing)/contact_us/+page.server.ts` |
| `password_changed` | Fires on the server when a user successfully updates their password. | `src/routes/(admin)/account/api/+page.server.ts` |
| `account_deleted` | Fires on the server when a user successfully deletes their account. | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_subscription_toggled` | Fires on the server when a user subscribes or unsubscribes from marketing emails. | `src/routes/(admin)/account/api/+page.server.ts` |

## Next steps

We've built some insights and a dashboard to keep an eye on user behaviour, based on the events we just instrumented:

- **Dashboard** — [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1829379)
- **Sign-ups & Sign-ins** — [View insight](https://us.posthog.com/project/483112/insights/KSWaYoGM)
- **Subscription conversion funnel** — [View insight](https://us.posthog.com/project/483112/insights/lqbUHtCW)
- **Account deletions** — [View insight](https://us.posthog.com/project/483112/insights/nfeEhnK0)
- **Billing activity** — [View insight](https://us.posthog.com/project/483112/insights/Hv37j7wa)
- **Profile completions** — [View insight](https://us.posthog.com/project/483112/insights/tGn4CStU)

Dashboard subscriptions and alerts were not configured in this run (the consent prompt was unavailable). You can set these up manually in PostHog: a weekly email digest of the dashboard and alerts on the subscription conversion funnel (relative decrease) and account deletions (spike) would be the highest-signal choices.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs. The account layout now calls `posthog.identify()` on mount, covering this case; confirm it fires in your environment.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
