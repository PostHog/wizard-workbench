<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this SvelteKit CMSaaS Starter project. The integration includes client-side and server-side event tracking, user identification, a reverse proxy to reduce ad-blocker interference, automatic client-side error capture, and server-side error tracking.

## Changes made

| File | Change |
|------|--------|
| `src/hooks.client.ts` | **Created** — Initializes PostHog JS in the browser via the `init()` hook; routes events through `/ingest` reverse proxy; captures all unhandled client-side errors via `handleError` |
| `src/hooks.server.ts` | **Updated** — Added `/ingest` reverse proxy handler (`posthogProxy`); added `handleError` to capture server-side errors with PostHog Node |
| `src/lib/server/posthog.ts` | **Created** — Singleton `getPostHogClient()` for server-side event capture using `posthog-node` |
| `svelte.config.js` | **Updated** — Added `paths.relative: false` (required for PostHog session replay to work correctly with SSR) |
| `.env.local` | **Updated** — Added `PUBLIC_POSTHOG_KEY` and `PUBLIC_POSTHOG_HOST` |

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `user_signed_in` | Fired when a user successfully signs in (Supabase `SIGNED_IN` event); also calls `posthog.identify()` | `src/routes/(marketing)/login/sign_in/+page.svelte` |
| `user_signed_up` | Fired when a new user completes sign-up (Supabase `SIGNED_IN` event on the sign-up page); also calls `posthog.identify()` | `src/routes/(marketing)/login/sign_up/+page.svelte` |
| `profile_created` | Server-side — fired when a user submits their profile for the first time | `src/routes/(admin)/account/api/+page.server.ts` |
| `profile_updated` | Server-side — fired when a user updates an existing profile | `src/routes/(admin)/account/api/+page.server.ts` |
| `password_changed` | Server-side — fired after a successful password change | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_change_requested` | Server-side — fired when a user requests an email address change | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_subscription_toggled` | Server-side — fired when a user subscribes or unsubscribes from emails | `src/routes/(admin)/account/api/+page.server.ts` |
| `account_deleted` | Server-side — fired when a user permanently deletes their account (churn event) | `src/routes/(admin)/account/api/+page.server.ts` |
| `subscription_checkout_initiated` | Server-side — fired when a Stripe checkout session is successfully created | `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` |
| `billing_portal_accessed` | Server-side — fired when a user is redirected to the Stripe billing portal | `src/routes/(admin)/account/(menu)/billing/manage/+page.server.ts` |
| `contact_form_submitted` | Server-side — fired when a contact form is successfully submitted and saved | `src/routes/(marketing)/contact_us/+page.server.ts` |
| `plan_selected` | Client-side — fired when a user clicks a pricing plan CTA button | `src/routes/(marketing)/pricing/pricing_module.svelte` |

## Next steps

To set up an "Analytics basics" dashboard, visit your [PostHog project](https://us.posthog.com/project/2/dashboards) and create a new dashboard with these suggested insights:

1. **Conversion funnel** — Steps: `user_signed_up` → `profile_created` → `plan_selected` → `subscription_checkout_initiated`
2. **Sign-ins over time** — Trend for `user_signed_in` (daily)
3. **New sign-ups over time** — Trend for `user_signed_up` (daily)
4. **Account churn** — Trend for `account_deleted` (weekly)
5. **Contact form submissions** — Trend for `contact_form_submitted` (weekly)

To create dashboards and insights programmatically, use a [PostHog Personal API Key](https://us.posthog.com/settings/user-api-keys) with the REST API.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-sveltekit/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
