<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this SvelteKit SaaS starter. The integration covers both client-side and server-side event tracking, user identification, error capture, and a reverse proxy to avoid ad blockers.

## What was set up

- **`src/hooks.client.ts`** (new): Initializes PostHog in the browser via the `init()` hook, routes events through the `/ingest` reverse proxy, and captures client-side errors via `handleError`.
- **`src/hooks.server.ts`** (modified): Added a PostHog reverse proxy handler (routes `/ingest` to PostHog servers) and a `handleError` hook for server-side error capture.
- **`src/lib/server/posthog.ts`** (new): Server-side PostHog singleton using `posthog-node` for reliable server-side event capture.
- **`svelte.config.js`** (modified): Added `paths.relative: false` — required for PostHog session replay to work correctly with SSR.
- **`.env`** (modified): Added `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` environment variables.
- **Six application files** instrumented with business event tracking (see table below).

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `user_signed_in` | User successfully signs in via Supabase auth (SIGNED_IN auth state change) | `src/routes/(marketing)/login/sign_in/+page.svelte` |
| `user_signed_up` | New user completes signup and auth state changes to SIGNED_IN | `src/routes/(marketing)/login/sign_up/+page.svelte` |
| `user_signed_out` | User signs out of the application | `src/routes/(admin)/account/sign_out/+page.svelte` |
| `plan_selected` | User clicks to select a pricing plan on the pricing module | `src/routes/(marketing)/pricing/pricing_module.svelte` |
| `contact_us_submitted` | User successfully submits the contact us form | `src/routes/(marketing)/contact_us/+page.server.ts` |
| `checkout_session_started` | User initiates a Stripe checkout session for a subscription plan | `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` |
| `profile_created` | New user creates their profile for the first time | `src/routes/(admin)/account/api/+page.server.ts` |
| `profile_updated` | Existing user updates their profile information | `src/routes/(admin)/account/api/+page.server.ts` |
| `account_deleted` | User permanently deletes their account | `src/routes/(admin)/account/api/+page.server.ts` |
| `password_changed` | User successfully changes their password | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_subscription_toggled` | User toggles their email subscription preference | `src/routes/(admin)/account/api/+page.server.ts` |
| `billing_portal_accessed` | User accesses the Stripe billing management portal | `src/routes/(admin)/account/(menu)/billing/manage/+page.server.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics**: https://us.posthog.com/project/2/dashboard/1346453
  - **Daily Sign Ups & Sign Ins**: https://us.posthog.com/project/2/insights/S7ZgfEVJ — Daily unique users signing up and signing in
  - **Subscription Conversion Funnel**: https://us.posthog.com/project/2/insights/876Kj61f — User flow from plan selection through checkout
  - **Churn Signals**: https://us.posthog.com/project/2/insights/1GcEqNEk — Account deletions and sign-outs as churn indicators
  - **Subscription Revenue Events**: https://us.posthog.com/project/2/insights/bxo4bUnw — Checkout completions and subscription changes
  - **Team Growth Activity**: https://us.posthog.com/project/2/insights/BVccAOVs — Team invitation and removal signals

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
