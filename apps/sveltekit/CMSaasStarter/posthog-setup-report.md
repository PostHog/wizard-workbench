# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your SvelteKit SaaS Starter application. The integration covers both client-side tracking (via `posthog-js`) and server-side tracking (via `posthog-node`), with user identification, error capture, and a reverse proxy to avoid ad blockers.

## Summary of changes

### New files created
- **`src/hooks.client.ts`** — Initializes PostHog on the client side using the `init()` hook. Configures the reverse proxy (`/ingest`), captures client-side errors via `handleError`, and enables `capture_exceptions: true` for automatic JS error tracking.
- **`src/lib/server/posthog.ts`** — A singleton PostHog Node.js client used across all server-side routes.

### Modified files
- **`svelte.config.js`** — Added `paths.relative: false` (required for PostHog session replay to work correctly with SSR).
- **`src/hooks.server.ts`** — Added a `/ingest` reverse proxy handle (to route PostHog requests through the app server and avoid ad blockers), plus a `handleError` hook to capture server-side errors.
- **`src/routes/(marketing)/login/sign_in/+page.svelte`** — Identifies users and captures `user_signed_in` on the Supabase `SIGNED_IN` auth state change.
- **`src/routes/(marketing)/login/sign_up/+page.svelte`** — Identifies users and captures `user_signed_up` on the Supabase `SIGNED_IN` auth state change.
- **`src/routes/(marketing)/pricing/pricing_module.svelte`** — Captures `plan_selected` when a user clicks a pricing CTA button.
- **`src/routes/(marketing)/pricing/+page.svelte`** — Captures `pricing_page_viewed` on mount (top of subscription funnel).
- **`src/routes/(marketing)/contact_us/+page.server.ts`** — Captures `contact_form_submitted` after successful form save.
- **`src/routes/(admin)/account/subscribe/[slug]/+page.server.ts`** — Captures `subscription_checkout_started` when a Stripe checkout session is created.
- **`src/routes/(admin)/account/(menu)/billing/manage/+page.server.ts`** — Captures `billing_portal_opened` when a user is redirected to the Stripe billing portal.
- **`src/routes/(admin)/account/api/+page.server.ts`** — Captures `profile_created` (with user identification via `$set`), `profile_updated`, `account_deleted`, `password_updated`, `email_update_requested`, and `email_subscription_toggled`.

### Environment variables
Added to `.env`:
- `PUBLIC_POSTHOG_KEY` — PostHog project API key
- `PUBLIC_POSTHOG_HOST` — PostHog host (`https://us.i.posthog.com`)

## Events tracked

| Event Name | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signs in via Supabase Auth UI | `src/routes/(marketing)/login/sign_in/+page.svelte` |
| `user_signed_up` | User successfully signs up via Supabase Auth UI | `src/routes/(marketing)/login/sign_up/+page.svelte` |
| `profile_created` | User creates their profile for the first time | `src/routes/(admin)/account/api/+page.server.ts` |
| `profile_updated` | User updates their existing profile | `src/routes/(admin)/account/api/+page.server.ts` |
| `subscription_checkout_started` | Stripe checkout session created for a subscription plan | `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` |
| `billing_portal_opened` | User redirected to Stripe billing portal | `src/routes/(admin)/account/(menu)/billing/manage/+page.server.ts` |
| `contact_form_submitted` | Contact form successfully submitted and saved | `src/routes/(marketing)/contact_us/+page.server.ts` |
| `account_deleted` | User successfully deletes their account | `src/routes/(admin)/account/api/+page.server.ts` |
| `password_updated` | User successfully changes their password | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_update_requested` | User requests an email address change | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_subscription_toggled` | User toggles their email subscription preference | `src/routes/(admin)/account/api/+page.server.ts` |
| `plan_selected` | User clicks a plan CTA button on the pricing module | `src/routes/(marketing)/pricing/pricing_module.svelte` |
| `pricing_page_viewed` | User views the pricing page (top of subscription funnel) | `src/routes/(marketing)/pricing/+page.svelte` |

## Next steps

We've prepared insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **[PostHog Project Dashboard](https://us.posthog.com/project/238460/dashboard)** — Visit your PostHog project to create the "Analytics basics" dashboard.

Suggested insights to add to the **"Analytics basics"** dashboard:

1. **Subscription Conversion Funnel** — Funnel insight: `pricing_page_viewed` → `plan_selected` → `subscription_checkout_started`
2. **Daily Sign-ups & Sign-ins** — Trends insight: `user_signed_up` + `user_signed_in` over time
3. **Onboarding Completion** — Funnel insight: `user_signed_up` → `profile_created`
4. **Account Churn** — Trends insight: `account_deleted` over time (monitor user churn)
5. **Revenue & Billing Activity** — Trends insight: `subscription_checkout_started` + `billing_portal_opened` over time

Create these at: **[https://us.posthog.com/project/238460/insights/new](https://us.posthog.com/project/238460/insights/new)**

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-sveltekit/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
