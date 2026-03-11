# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your SvelteKit SaaS application. Here is a summary of every change made:

- **`posthog-js`** and **`posthog-node`** installed as dependencies.
- **`src/lib/server/posthog.ts`** created: a singleton `getPostHogClient()` function using `posthog-node` for all server-side event capture, configured with `flushAt: 1` and `flushInterval: 0` for immediate delivery.
- **`src/hooks.client.ts`** created: initialises `posthog-js` on the client via the `/ingest` reverse proxy (to avoid ad blockers), enables `capture_exceptions`, and wires up `handleError` to forward client-side exceptions to PostHog.
- **`src/hooks.server.ts`** updated: prepended a `posthogProxy` handler to the `sequence()` chain to proxy `/ingest/*` requests to PostHog's ingestion endpoint, and added a `handleError` export to capture server-side errors.
- **`svelte.config.js`** updated: added `paths: { relative: false }` inside the `kit` config — required for PostHog session replay to work correctly with SSR.
- **`.env`** updated: `PUBLIC_POSTHOG_KEY` and `PUBLIC_POSTHOG_HOST` set.
- **10 analytics events** instrumented across 6 files (see table below).

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signs in (auth state change to SIGNED_IN) | `src/routes/(marketing)/login/sign_in/+page.svelte` |
| `user_signed_up` | User completes sign-up and submits the sign-up form | `src/routes/(marketing)/login/sign_up/+page.svelte` |
| `user_signed_out` | User successfully signs out | `src/routes/(admin)/account/sign_out/+page.svelte` |
| `profile_created` | User creates their profile for the first time | `src/routes/(admin)/account/api/+page.server.ts` |
| `profile_updated` | User updates their existing profile | `src/routes/(admin)/account/api/+page.server.ts` |
| `subscription_checkout_started` | User initiates subscription checkout by clicking a plan | `src/routes/(marketing)/pricing/pricing_module.svelte` |
| `account_deleted` | User successfully deletes their account | `src/routes/(admin)/account/api/+page.server.ts` |
| `contact_us_submitted` | User successfully submits the contact-us form | `src/routes/(marketing)/contact_us/+page.server.ts` |
| `password_reset_requested` | User requests a password reset | `src/routes/(marketing)/login/forgot_password/+page.svelte` |
| `password_changed` | User successfully changes their password | `src/routes/(admin)/account/api/+page.server.ts` |

## Next steps

We recommend building an **"Analytics basics"** dashboard in PostHog with the following insights, based on the events instrumented above:

1. **Signup trend** — Trends chart for `user_signed_up` over time (daily/weekly). Measures top-of-funnel acquisition.
2. **Activation funnel** — Funnel: `user_signed_up` → `profile_created` → `subscription_checkout_started`. Measures how many signups convert to paying customers.
3. **Subscription checkout starts** — Trends chart for `subscription_checkout_started` broken down by `plan_id`. Shows which plans attract the most interest.
4. **Churn signal** — Trends chart for `account_deleted` over time. Early warning of product dissatisfaction.
5. **Contact form submissions** — Trends chart for `contact_us_submitted` over time. Proxy for pre-sales interest or support load.

To build this dashboard, visit [https://us.posthog.com/project/2/dashboards](https://us.posthog.com/project/2/dashboards) and create a new dashboard named "Analytics basics", then add each insight using the event names above.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-sveltekit/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
