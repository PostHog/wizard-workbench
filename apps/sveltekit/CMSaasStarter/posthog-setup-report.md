<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this SvelteKit CMSaaS Starter project. The integration includes client-side event tracking, server-side event capture via `posthog-node`, a reverse proxy to avoid ad blockers, user identification on login and signup, and automatic error tracking on both client and server.

## Summary of changes

- **`src/hooks.client.ts`** *(new)* — Initializes `posthog-js` in the browser via SvelteKit's `init` hook; routes events through `/ingest` reverse proxy; captures client-side errors via `handleError`.
- **`src/hooks.server.ts`** — Added `/ingest` reverse proxy handler for PostHog traffic; added `handleError` to capture server-side errors; imported `posthog-node` singleton.
- **`src/lib/server/posthog.ts`** *(new)* — Singleton `posthog-node` client used across all server-side files.
- **`svelte.config.js`** — Added `paths.relative: false` (required for session replay to work correctly with SSR).
- **`.env`** — Added `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST`.

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user_signed_in` | Fired client-side when a user signs in (Supabase SIGNED_IN event); also identifies the user | `src/routes/(marketing)/login/sign_in/+page.svelte` |
| `user_signed_up` | Fired client-side when a user signs up (Supabase SIGNED_IN event); also identifies the user | `src/routes/(marketing)/login/sign_up/+page.svelte` |
| `profile_created` | Fired server-side when a new profile is created for the first time | `src/routes/(admin)/account/api/+page.server.ts` |
| `profile_updated` | Fired server-side when an existing profile is updated | `src/routes/(admin)/account/api/+page.server.ts` |
| `checkout_initiated` | Fired server-side when a Stripe checkout session is created for a subscription | `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` |
| `billing_portal_opened` | Fired server-side when a user opens the Stripe billing portal to manage their subscription | `src/routes/(admin)/account/(menu)/billing/manage/+page.server.ts` |
| `account_deleted` | Fired server-side when a user successfully deletes their account | `src/routes/(admin)/account/api/+page.server.ts` |
| `contact_form_submitted` | Fired server-side when a contact form is submitted and saved | `src/routes/(marketing)/contact_us/+page.server.ts` |
| `email_subscription_toggled` | Fired server-side when a user toggles their email subscription preference | `src/routes/(admin)/account/api/+page.server.ts` |
| `password_changed` | Fired server-side when a user successfully changes their password | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_change_requested` | Fired server-side when a user requests an email address change | `src/routes/(admin)/account/api/+page.server.ts` |
| `pricing_plan_clicked` | Fired client-side when a visitor clicks a plan CTA button on the pricing page | `src/routes/(marketing)/pricing/pricing_module.svelte` |

## Next steps

To monitor your key business metrics, create an **"Analytics basics"** dashboard in PostHog with the following insights:

- **Signup → Profile → Checkout funnel** — Conversion funnel: `user_signed_up` → `profile_created` → `checkout_initiated`
- **New signups over time** — Trend chart of `user_signed_up` events
- **Checkout initiations over time** — Trend chart of `checkout_initiated` events (revenue top of funnel)
- **Account churn** — Trend chart of `account_deleted` events
- **Pricing plan click breakdown** — Breakdown of `pricing_plan_clicked` by `plan_name` property

Create these in your PostHog project: https://us.posthog.com/project/2/dashboards

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-sveltekit/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
