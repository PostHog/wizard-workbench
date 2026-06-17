<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this SvelteKit SaaS starter project. Here's a summary of every change made:

- **`src/hooks.client.ts`** (new) — Initializes PostHog on the client via the SvelteKit `init` hook, routing all traffic through the `/ingest` reverse proxy to avoid ad-blockers. Also exports `handleError` to auto-capture client-side exceptions with `captureException`.
- **`src/lib/server/posthog.ts`** (new) — Singleton PostHog Node.js client for server-side event capture, using `flushAt: 1` / `flushInterval: 0` so each server action immediately ships its events.
- **`src/hooks.server.ts`** — Added a `posthogProxy` handle that transparently forwards `/ingest` (and `/ingest/static`, `/ingest/array`) requests to the PostHog ingest and asset CDN hosts. Also added `handleError` to capture server-side errors with `distinctId: "server"`.
- **`svelte.config.js`** — Added `paths: { relative: false }` as required for PostHog session replay to work correctly under SSR.
- **`src/routes/(marketing)/login/sign_in/+page.svelte`** — Added `posthog.identify(userId, { email })` and a `user_signed_in` capture inside the existing `onAuthStateChange` listener, so every sign-in associates the PostHog distinct ID with the Supabase user.
- **`src/routes/(marketing)/login/sign_up/+page.svelte`** — Added a new `onAuthStateChange` listener for `SIGNED_IN`, calling `posthog.identify` and capturing `user_signed_up` with the auth provider.
- **`src/routes/(admin)/account/subscribe/[slug]/+page.server.ts`** — Captures `subscription_checkout_started` server-side with `plan_id` before redirecting to the Stripe checkout URL.
- **`src/routes/(admin)/account/(menu)/billing/manage/+page.server.ts`** — Captures `billing_portal_accessed` server-side before redirecting to the Stripe billing portal.
- **`src/routes/(marketing)/contact_us/+page.server.ts`** — Captures `contact_form_submitted` after successful DB insert, using the submitter's email as `distinctId`.
- **`src/routes/(admin)/account/api/+page.server.ts`** — Added server-side captures for `profile_created`, `profile_updated`, `account_deleted`, `password_changed`, `email_changed`, and `user_signed_out` in the respective form actions. Profile events include `$set` properties to keep the person record in PostHog up-to-date.
- **`src/routes/(marketing)/pricing/pricing_module.svelte`** — Added `plan_cta_clicked` capture on each pricing plan button, including `plan_id` and `plan_name` properties.
- **`.env`** — Created with `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` (covered by `.gitignore`).

## Events

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signs in (any provider). Calls `identify` with user ID + email. | `src/routes/(marketing)/login/sign_in/+page.svelte` |
| `user_signed_up` | New user completes sign-up. Calls `identify` with user ID + email. | `src/routes/(marketing)/login/sign_up/+page.svelte` |
| `user_signed_out` | User signs out via the signout action. | `src/routes/(admin)/account/api/+page.server.ts` |
| `subscription_checkout_started` | Stripe checkout session created for a subscription plan. Includes `plan_id`. | `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` |
| `billing_portal_accessed` | User enters the Stripe billing portal to manage their subscription. | `src/routes/(admin)/account/(menu)/billing/manage/+page.server.ts` |
| `profile_created` | User fills out their profile for the first time (onboarding milestone). | `src/routes/(admin)/account/api/+page.server.ts` |
| `profile_updated` | User updates their existing profile. | `src/routes/(admin)/account/api/+page.server.ts` |
| `account_deleted` | User deletes their account. Critical churn signal. | `src/routes/(admin)/account/api/+page.server.ts` |
| `contact_form_submitted` | Visitor submits the contact form. | `src/routes/(marketing)/contact_us/+page.server.ts` |
| `plan_cta_clicked` | Visitor clicks a pricing plan CTA button. Includes `plan_id` and `plan_name`. | `src/routes/(marketing)/pricing/pricing_module.svelte` |
| `password_changed` | User changes their password. | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_changed` | User initiates an email address change. | `src/routes/(admin)/account/api/+page.server.ts` |

## Next steps

Create an **"Analytics basics (wizard)"** dashboard in PostHog to monitor key business metrics. Below are the recommended insights to add:

- **Sign-up trend** — Trends chart of `user_signed_up` over time. Tracks top-of-funnel growth.
- **Onboarding funnel** — Funnel: `user_signed_up` → `profile_created` → `subscription_checkout_started`. Shows where new users drop off before subscribing.
- **Subscription checkout started** — Trends chart of `subscription_checkout_started`, broken down by `plan_id`. Highlights which plan attracts the most interest.
- **Churn signal** — Trends chart of `account_deleted` over time. An early warning for retention problems.
- **Contact form submissions** — Trends chart of `contact_form_submitted`. Useful for correlating marketing campaigns with inbound interest.

[Create a new dashboard](https://us.posthog.com/project/2/dashboard) | [Create a new insight](https://us.posthog.com/project/2/insights/new)

> **Note:** The wizard could not automatically create the dashboard and insights because the connected PostHog API key is missing the `dashboard:write`, `insight:write`, and `query:read` scopes. Add those scopes to your personal API key (or re-authenticate the MCP connector) and re-run this step, or create the dashboard manually using the links above.

## Verify before merging

- [ ] Run a full production build (`npm run build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any bootstrap/onboarding scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify in error tracking.
- [ ] Confirm the returning-visitor path also calls `identify` — currently `identify` is only called on the sign-in and sign-up pages. A user who is already signed in and navigates directly to `/account` will have their PostHog session linked to an anonymous distinct ID until they sign out and back in. Consider calling `posthog.identify` from the root layout when a session is already present on page load.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-sveltekit/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
