# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this SvelteKit SaaS starter project. Here is what was added:

- **`src/hooks.client.ts`** (new): Initializes PostHog on the client side using the `/ingest` reverse proxy path, enables exception capture (`capture_exceptions: true`), and hooks into `handleError` to automatically report client-side errors.
- **`src/hooks.server.ts`** (updated): Added a `posthogProxy` handle that proxies `/ingest` and `/ingest/static|array` requests to PostHog servers (bypasses ad blockers). Also added `handleError` to capture server-side errors.
- **`src/lib/server/posthog.ts`** (new): Singleton factory for the server-side `posthog-node` client with `flushAt: 1` / `flushInterval: 0` to ensure events are sent immediately from serverless-style endpoints.
- **`svelte.config.js`** (updated): Added `paths.relative: false` — required for session replay to work correctly with SSR.
- **`src/routes/(marketing)/login/sign_in/+page.svelte`** (updated): Calls `posthog.identify()` and captures `user_signed_in` on Supabase `SIGNED_IN` auth state change.
- **`src/routes/(marketing)/login/sign_up/+page.svelte`** (updated): Calls `posthog.identify()` and captures `user_signed_up` on Supabase `SIGNED_IN` auth state change.
- **`src/routes/(admin)/account/sign_out/+page.svelte`** (updated): Captures `user_signed_out` and calls `posthog.reset()` on successful sign-out.
- **`src/routes/(marketing)/pricing/pricing_module.svelte`** (updated): Captures `plan_selected` with `plan_id`, `plan_name`, and `stripe_price_id` when a user clicks a plan CTA.
- **`src/routes/(admin)/account/api/+page.server.ts`** (updated): Added server-side events for `profile_created`, `profile_updated`, `password_changed`, `email_change_initiated`, `account_deleted`, and `email_subscription_toggled`.
- **`src/routes/(admin)/account/subscribe/[slug]/+page.server.ts`** (updated): Captures `subscription_checkout_started` server-side when a Stripe checkout session is created.
- **`src/routes/(marketing)/contact_us/+page.server.ts`** (updated): Captures `contact_form_submitted` server-side with anonymized properties after successful form submission.

## Events

| Event Name | Description | File |
|---|---|---|
| `user_signed_in` | Fired when a user successfully signs in via the sign-in page. | `src/routes/(marketing)/login/sign_in/+page.svelte` |
| `user_signed_up` | Fired when a new user completes sign-up via the sign-up page. | `src/routes/(marketing)/login/sign_up/+page.svelte` |
| `user_signed_out` | Fired when a user signs out of their account. | `src/routes/(admin)/account/sign_out/+page.svelte` |
| `profile_created` | Fired server-side when a user creates their profile for the first time. | `src/routes/(admin)/account/api/+page.server.ts` |
| `profile_updated` | Fired server-side when a user updates their existing profile. | `src/routes/(admin)/account/api/+page.server.ts` |
| `subscription_checkout_started` | Fired server-side when a Stripe checkout session is created. | `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` |
| `contact_form_submitted` | Fired server-side when a visitor submits the contact us form. | `src/routes/(marketing)/contact_us/+page.server.ts` |
| `password_changed` | Fired server-side when a user successfully changes their password. | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_change_initiated` | Fired server-side when a user initiates an email address change. | `src/routes/(admin)/account/api/+page.server.ts` |
| `account_deleted` | Fired server-side when a user successfully deletes their account. | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_subscription_toggled` | Fired server-side when a user toggles their email subscription preference. | `src/routes/(admin)/account/api/+page.server.ts` |
| `plan_selected` | Fired client-side when a user clicks to select a pricing plan. | `src/routes/(marketing)/pricing/pricing_module.svelte` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics (wizard)](https://us.posthog.com/project/2/dashboard/4500)
- **User Sign-ups Over Time**: [https://us.posthog.com/project/2/insights/8a6d52a4](https://us.posthog.com/project/2/insights/8a6d52a4)
- **Sign-up to Subscription Funnel**: [https://us.posthog.com/project/2/insights/fff4d10b](https://us.posthog.com/project/2/insights/fff4d10b)
- **Contact Form Submissions**: [https://us.posthog.com/project/2/insights/77d4bbc1](https://us.posthog.com/project/2/insights/77d4bbc1)
- **Account Deletions (Churn)**: [https://us.posthog.com/project/2/insights/3b558ed3](https://us.posthog.com/project/2/insights/3b558ed3)
- **Plan Selection Breakdown**: [https://us.posthog.com/project/2/insights/3d251c3e](https://us.posthog.com/project/2/insights/3d251c3e)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
