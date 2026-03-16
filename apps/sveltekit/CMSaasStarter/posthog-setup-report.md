<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this SvelteKit SaaS starter project. Here is a summary of all changes made:

## Changes summary

- **`svelte.config.js`** — Added `paths.relative: false` (required for PostHog session replay to work correctly with SSR).
- **`src/hooks.client.ts`** _(new file)_ — Initializes PostHog on the client side via the SvelteKit `init` hook. Configures a `/ingest` reverse proxy path to avoid ad blockers. Enables automatic exception capture via `captureException`.
- **`src/hooks.server.ts`** — Added a `/ingest` reverse proxy handler (proxies PostHog requests server-side to avoid ad blockers). Added `handleError` for server-side error capture with PostHog.
- **`src/lib/server/posthog.ts`** _(new file)_ — Server-side PostHog singleton using `posthog-node`. Used by all server-side event captures.
- **`.env`** — Added `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` environment variables.

## Event tracking table

| Event | Description | File |
|---|---|---|
| `user_signed_in` | Fired when a user successfully signs in via Supabase auth. Also calls `posthog.identify()` with the user's ID and email. | `src/routes/(marketing)/login/sign_in/+page.svelte` |
| `user_signed_out` | Fired when a user signs out from the application. Calls `posthog.reset()` to clear the user identity. | `src/routes/(admin)/account/sign_out/+page.svelte` |
| `pricing_plan_clicked` | Fired when a user clicks a plan CTA on the pricing page. Properties: `plan_id`, `plan_name`, `plan_price`. | `src/routes/(marketing)/pricing/pricing_module.svelte` |
| `checkout_started` | Fired server-side when a Stripe checkout session is created. Properties: `plan_price_id`. | `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` |
| `checkout_error` | Fired server-side when Stripe checkout session creation fails. Properties: `plan_price_id`, `error`. | `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` |
| `billing_portal_opened` | Fired server-side when a user is redirected to the Stripe billing portal. | `src/routes/(admin)/account/(menu)/billing/manage/+page.server.ts` |
| `contact_form_submitted` | Fired server-side when a contact form submission is saved successfully. Properties: `has_company`, `has_phone`. | `src/routes/(marketing)/contact_us/+page.server.ts` |
| `account_deleted` | Fired server-side when a user successfully deletes their account. | `src/routes/(admin)/account/api/+page.server.ts` |
| `profile_created` | Fired server-side when a user creates their profile for the first time. Sets person properties: `email`, `name`, `company`. | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_update_requested` | Fired server-side when a user requests an email address change. | `src/routes/(admin)/account/api/+page.server.ts` |
| `password_updated` | Fired server-side when a user successfully updates their password. Properties: `via_recovery`. | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_subscription_toggled` | Fired server-side when a user toggles their email subscription preference. Properties: `unsubscribed`. | `src/routes/(admin)/account/api/+page.server.ts` |
| `server_error` | Fired server-side on any unhandled server error. Properties: `error`, `status`, `message`. | `src/hooks.server.ts` |

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog with the following insights to monitor user behavior and business health:

1. **Signup → Profile → Subscription funnel** — Conversion funnel: `user_signed_in` → `profile_created` → `checkout_started`
2. **Checkout started trend** — Line chart of `checkout_started` over time, broken down by `plan_price_id`
3. **Pricing plan clicks** — Bar chart of `pricing_plan_clicked` broken down by `plan_name` (top of purchase funnel)
4. **Churn signals** — Count of `account_deleted` and `email_subscription_toggled` (where `unsubscribed = true`) over time
5. **Contact form submissions** — Trend of `contact_form_submitted` over time

To create this dashboard, visit your [PostHog project](https://us.posthog.com/project/2/dashboards) and create a new dashboard called "Analytics basics", then add insights for each of the above.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-sveltekit/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
