<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CMSaasStarter SvelteKit application. Here's what was set up:

**Client-side initialization** (`src/hooks.client.ts`) — PostHog is initialized in the SvelteKit client hooks `init` function with a reverse-proxy `api_host` (`/ingest`) to avoid ad blockers. Client-side error tracking is enabled via `capture_exceptions: true` and `handleError`.

**Server-side PostHog client** (`src/lib/server/posthog.ts`) — A singleton `posthog-node` client is used for all server-side event capture, with `flushAt: 1` and `flushInterval: 0` to ensure events are sent immediately.

**Reverse proxy** (`src/hooks.server.ts`) — All `/ingest/*` requests are proxied to PostHog's servers (`us.i.posthog.com` / `us-assets.i.posthog.com`) to bypass ad blockers. A `handleError` hook captures unhandled server errors as `server_error` events.

**Session replay** (`svelte.config.js`) — `paths.relative: false` was set, which is required for PostHog session replay to work correctly with SSR.

**User identification** — On sign-in and sign-up, `posthog.identify()` is called with the Supabase user ID and email so that server-side and client-side events are correlated to the same person. On sign-out, `posthog.reset()` is called to clear the identity.

**Environment variables** (`.env`) — `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` are set and referenced throughout, never hardcoded.

## Events instrumented

| Event Name | Description | File |
|---|---|---|
| `user_signed_in` | Fired when a user successfully signs in; also calls `posthog.identify()` | `src/routes/(marketing)/login/sign_in/+page.svelte` |
| `user_signed_up` | Fired when a new user completes sign-up; also calls `posthog.identify()` | `src/routes/(marketing)/login/sign_up/+page.svelte` |
| `user_signed_out` | Fired on sign-out; also calls `posthog.reset()` | `src/routes/(admin)/account/sign_out/+page.svelte` |
| `contact_us_submitted` | Fired when the contact form is successfully submitted | `src/routes/(marketing)/contact_us/+page.svelte` |
| `pricing_plan_selected` | Fired when a user clicks a pricing plan CTA (with plan_id, plan_name, plan_price) | `src/routes/(marketing)/pricing/pricing_module.svelte` |
| `subscription_checkout_started` | Server-side: fired when a Stripe checkout session is created (with price_id, customer_id) | `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` |
| `billing_portal_accessed` | Server-side: fired when a user is redirected to the Stripe billing portal | `src/routes/(admin)/account/(menu)/billing/manage/+page.server.ts` |
| `profile_created` | Server-side: fired when a user saves their profile for the first time | `src/routes/(admin)/account/api/+page.server.ts` |
| `profile_updated` | Server-side: fired when a user updates their existing profile | `src/routes/(admin)/account/api/+page.server.ts` |
| `account_deleted` | Server-side: fired when a user successfully deletes their account | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_subscription_toggled` | Server-side: fired when a user toggles their email subscription (with unsubscribed status) | `src/routes/(admin)/account/api/+page.server.ts` |
| `password_changed` | Server-side: fired when a user successfully changes their password | `src/routes/(admin)/account/api/+page.server.ts` |
| `server_error` | Server-side: automatically captured for all unhandled server errors | `src/hooks.server.ts` |

## Next steps

We've recommended five insights for your "Analytics basics" dashboard. Create them in PostHog:

- **[Signup → Sign-in Conversion Funnel](https://us.posthog.com/project/2/insights/new#insight=FUNNELS)** — Add steps: `user_signed_up` → `user_signed_in` to measure how many signups convert to active sign-ins.
- **[New Signups Over Time](https://us.posthog.com/project/2/insights/new#insight=TRENDS)** — Trend on `user_signed_up` to track user acquisition.
- **[Subscription Checkout Funnel](https://us.posthog.com/project/2/insights/new#insight=FUNNELS)** — Add steps: `pricing_plan_selected` → `subscription_checkout_started` to measure plan selection to checkout conversion.
- **[Account Deletions (Churn)](https://us.posthog.com/project/2/insights/new#insight=TRENDS)** — Trend on `account_deleted` to track churn signals.
- **[Contact Form Submissions](https://us.posthog.com/project/2/insights/new#insight=TRENDS)** — Trend on `contact_us_submitted` to measure inbound interest.

Add these insights to a new dashboard at: https://us.posthog.com/project/2/dashboard/new

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
