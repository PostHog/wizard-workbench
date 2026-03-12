<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this SvelteKit CMSaasStarter project. Here is a summary of all changes made:

**Client-side initialization** (`src/hooks.client.ts` — new file): PostHog JS is initialized on app boot via the `init()` hook using the `PUBLIC_POSTHOG_PROJECT_TOKEN` environment variable. The client routes events through the `/ingest` reverse proxy to avoid ad blockers, and client-side exceptions are automatically captured via `handleError`.

**Server-side client** (`src/lib/server/posthog.ts` — new file): A singleton PostHog Node client is exported via `getPostHogClient()`. It uses `flushAt: 1, flushInterval: 0` to ensure events are sent immediately on each server request.

**Reverse proxy** (`src/hooks.server.ts` — modified): A `posthogProxy` handle was added to the sequence, intercepting all `/ingest/*` requests and forwarding them to `us.i.posthog.com` (or `us-assets.i.posthog.com` for static assets). Server-side errors are captured via `handleError`. The import chain was updated accordingly.

**SvelteKit config** (`svelte.config.js` — modified): `paths.relative: false` was added, which is required for PostHog session replay to work correctly with SSR.

**Environment variables** (`.env` — created): `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` are set and referenced via `$env/static/public`.

**Auth event tracking** (`sign_in/+page.svelte`, `sign_up/+page.svelte` — modified): `posthog.identify()` and event capture are called inside `onAuthStateChange` on `SIGNED_IN`, linking the PostHog anonymous user to the Supabase user ID.

**Account action tracking** (`account/api/+page.server.ts` — modified): Six server-side events are captured across the profile, password, email subscription, account deletion, and sign-out actions.

**Subscription tracking** (`subscribe/[slug]/+page.server.ts` — modified): A `subscription_checkout_started` event is captured when a user is redirected to Stripe Checkout.

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user_signed_in` | Fired when a user successfully signs in via Supabase auth | `src/routes/(marketing)/login/sign_in/+page.svelte` |
| `user_signed_up` | Fired when a user successfully signs up | `src/routes/(marketing)/login/sign_up/+page.svelte` |
| `user_signed_out` | Fired when a user signs out via the signout action | `src/routes/(admin)/account/api/+page.server.ts` |
| `contact_form_submitted` | Fired when a contact us form is successfully submitted | `src/routes/(marketing)/contact_us/+page.svelte` |
| `subscription_checkout_started` | Fired when a user is redirected to Stripe checkout for a subscription plan | `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` |
| `profile_created` | Fired server-side when a user creates their profile for the first time | `src/routes/(admin)/account/api/+page.server.ts` |
| `profile_updated` | Fired server-side when a user updates their existing profile | `src/routes/(admin)/account/api/+page.server.ts` |
| `account_deleted` | Fired server-side when a user deletes their account | `src/routes/(admin)/account/api/+page.server.ts` |
| `password_updated` | Fired server-side when a user successfully updates their password | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_subscription_toggled` | Fired server-side when a user toggles their email subscription status | `src/routes/(admin)/account/api/+page.server.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics**: https://us.posthog.com/project/2/dashboard/1346453
- **Insight — Subscription Conversion Funnel**: https://us.posthog.com/project/2/insights/876Kj61f (signup → subscription checkout)
- **Insight — Daily Sign Ups & Sign Ins**: https://us.posthog.com/project/2/insights/S7ZgfEVJ (user acquisition trend)
- **Insight — Churn Signals**: https://us.posthog.com/project/2/insights/1GcEqNEk (account deletions & sign-outs)
- **Insight — Subscription Revenue Events**: https://us.posthog.com/project/2/insights/bxo4bUnw (checkout completions)
- **Insight — Team Growth Activity**: https://us.posthog.com/project/2/insights/BVccAOVs (member invitations & removals)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
