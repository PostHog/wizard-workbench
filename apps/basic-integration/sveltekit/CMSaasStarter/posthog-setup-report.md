# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this SvelteKit SaaS starter. The integration covers client-side initialization, a reverse proxy to bypass ad blockers, server-side event capture for all critical business operations, user identification on sign-in, and a reset on sign-out. Error tracking is active on both client and server via `capture_exceptions` and `handleError` hooks. Session replay is enabled with the required `paths.relative: false` svelte.config.js setting.

**New files created:**
- `src/hooks.client.ts` — initializes `posthog-js` with reverse proxy (`/ingest`), error capturing enabled
- `src/lib/server/posthog.ts` — singleton `posthog-node` client for all server-side captures

**Modified files:**
- `src/hooks.server.ts` — added `/ingest` reverse proxy handler and `handleError` server error tracking
- `svelte.config.js` — added `paths.relative: false` (required for session replay)
- `src/routes/(marketing)/login/sign_in/+page.svelte` — `posthog.identify()` + `sign_in_completed` on SIGNED_IN auth event
- `src/routes/(admin)/account/sign_out/+page.svelte` — `posthog.reset()` on successful sign-out
- `src/routes/(marketing)/pricing/pricing_module.svelte` — `plan_selected` on plan CTA click
- `src/routes/(admin)/account/api/+page.server.ts` — server-side captures for profile, account, and settings events
- `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` — `checkout_initiated` before Stripe redirect
- `src/routes/(admin)/account/(menu)/billing/manage/+page.server.ts` — `billing_portal_opened` before Stripe portal redirect
- `src/routes/(marketing)/contact_us/+page.server.ts` — `contact_us_submitted` on successful save

## Events tracked

| Event | Description | File |
|-------|-------------|------|
| `sign_in_completed` | User successfully signs in (Supabase SIGNED_IN event fires) | `src/routes/(marketing)/login/sign_in/+page.svelte` |
| `profile_created` | User submits their profile for the first time | `src/routes/(admin)/account/api/+page.server.ts` |
| `profile_updated` | User updates an existing profile (name, company, website) | `src/routes/(admin)/account/api/+page.server.ts` |
| `checkout_initiated` | Stripe Checkout session created; user is about to pay | `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` |
| `billing_portal_opened` | User opens the Stripe Billing Portal to manage their subscription | `src/routes/(admin)/account/(menu)/billing/manage/+page.server.ts` |
| `contact_us_submitted` | Contact form submitted and saved successfully | `src/routes/(marketing)/contact_us/+page.server.ts` |
| `account_deleted` | User's account is permanently deleted | `src/routes/(admin)/account/api/+page.server.ts` |
| `password_updated` | User successfully changes their password | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_updated` | User requests an email address change | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_subscription_toggled` | User toggles marketing email subscription preference | `src/routes/(admin)/account/api/+page.server.ts` |
| `plan_selected` | User clicks a plan CTA on the pricing module | `src/routes/(marketing)/pricing/pricing_module.svelte` |

## Next steps

We recommend building an **"Analytics basics"** dashboard in PostHog with the following five insights:

1. **Signup → Checkout funnel** — Funnel insight with steps: `sign_in_completed` → `profile_created` → `plan_selected` → `checkout_initiated`. This is your core conversion funnel.

2. **Plan selection over time** — Trends insight for `plan_selected`, broken down by `plan_name`. Tracks which plans are most popular.

3. **Checkout initiated over time** — Trends insight for `checkout_initiated`. Measures the rate at which users enter Stripe checkout.

4. **Churn signals** — Trends insight showing `account_deleted` and `billing_portal_opened` together. Rising portal opens without new checkouts can signal churn risk.

5. **Contact us submissions** — Trends insight for `contact_us_submitted`. Tracks inbound interest; spikes may indicate product issues or marketing campaigns.

Create these at [/insights](/insights) and group them into a new dashboard at [/dashboard](/dashboard).

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-sveltekit/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
