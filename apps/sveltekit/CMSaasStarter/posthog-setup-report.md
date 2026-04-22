<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this SvelteKit CMSaasStarter project. The integration includes client-side initialization with session replay support, a reverse proxy to bypass ad blockers, server-side event tracking for critical business flows, user identification on login/signup, error capture on both client and server, and 10 analytics events covering the full user lifecycle from signup through churn.

## Changes made

### New files
- `src/hooks.client.ts` — Initializes PostHog in the browser via the SvelteKit `init` hook; captures client-side errors via `handleError`
- `src/lib/server/posthog.ts` — Server-side PostHog singleton (posthog-node) used across server actions

### Modified files
- `src/hooks.server.ts` — Added `/ingest` reverse proxy handle (bypasses ad blockers) and `handleError` for server-side error capture
- `svelte.config.js` — Added `paths.relative: false` (required for session replay to work correctly with SSR)
- `src/routes/(marketing)/login/sign_in/+page.svelte` — Identifies user and captures `user_signed_in` on Supabase `SIGNED_IN` auth state change
- `src/routes/(marketing)/login/sign_up/+page.svelte` — Identifies user and captures `user_signed_up` on `SIGNED_IN` auth state change
- `src/routes/(admin)/account/sign_out/+page.svelte` — Captures `user_signed_out` and calls `posthog.reset()` on successful sign-out
- `src/routes/(admin)/account/api/+page.server.ts` — Captures `profile_created`, `profile_updated`, `account_deleted`, `password_changed`, `email_change_initiated` in server actions
- `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` — Captures `checkout_started` when a Stripe checkout session is created
- `src/routes/(marketing)/contact_us/+page.server.ts` — Captures `contact_form_submitted` after successful contact request save

### Environment variables
- `.env` — Added `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST`

### Packages installed
- `posthog-js` — Client-side analytics
- `posthog-node` — Server-side analytics

## Events

| Event | Description | File |
|-------|-------------|------|
| `user_signed_in` | User successfully signs in via email/password or OAuth | `src/routes/(marketing)/login/sign_in/+page.svelte` |
| `user_signed_up` | New user signs up for the first time | `src/routes/(marketing)/login/sign_up/+page.svelte` |
| `user_signed_out` | User signs out of their account | `src/routes/(admin)/account/sign_out/+page.svelte` |
| `profile_created` | User completes their profile for the first time (conversion event) | `src/routes/(admin)/account/api/+page.server.ts` |
| `profile_updated` | User updates their existing profile information | `src/routes/(admin)/account/api/+page.server.ts` |
| `checkout_started` | User initiates a Stripe checkout session to subscribe to a plan | `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` |
| `account_deleted` | User successfully deletes their account (churn event) | `src/routes/(admin)/account/api/+page.server.ts` |
| `password_changed` | User successfully updates their password | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_change_initiated` | User requests an email address change | `src/routes/(admin)/account/api/+page.server.ts` |
| `contact_form_submitted` | User submits the contact us form | `src/routes/(marketing)/contact_us/+page.server.ts` |

## Next steps

Visit your PostHog project to build dashboards and insights based on the events above. Recommended insights to create:

1. **Signup → Profile → Checkout funnel** — `user_signed_up` → `profile_created` → `checkout_started` (conversion funnel)
2. **Sign-in volume over time** — Trend of `user_signed_in` events
3. **Churn rate** — `account_deleted` events over time
4. **Contact form submissions** — Trend of `contact_form_submitted` with breakdown by `has_message`
5. **Checkout conversion** — Unique users who fired `checkout_started` vs `profile_created`

Visit your PostHog project at https://us.posthog.com to create these dashboards manually.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-sveltekit/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
