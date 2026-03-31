<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the CMSaasStarter SvelteKit application. The following changes were made:

- **`src/hooks.client.ts`** (new): Initializes PostHog on the client side via the SvelteKit `init` hook. Uses a `/ingest` reverse proxy to avoid ad blockers. Also captures client-side errors via `handleError` with `captureException`.
- **`src/hooks.server.ts`** (modified): Added a `posthogProxy` handle to route `/ingest/*` requests to PostHog's servers (including `/ingest/static/` and `/ingest/array/` to the assets host). Added `handleError` for server-side error capture. Added `getPostHogClient` import from the new server singleton.
- **`src/lib/server/posthog.ts`** (new): Server-side PostHog singleton using `posthog-node`. Used for all server-side event capture.
- **`svelte.config.js`** (modified): Added `paths: { relative: false }` required for session replay to work correctly with SSR.
- **`.env`** (updated): Added `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` environment variables.

| Event | Description | File |
|---|---|---|
| `user_signed_up` | User registered a new account | `src/routes/(marketing)/login/sign_up/+page.svelte` |
| `user_signed_in` | User successfully signed in | `src/routes/(marketing)/login/sign_in/+page.svelte` |
| `user_signed_out` | User signed out of their account | `src/routes/(admin)/account/api/+page.server.ts` |
| `profile_created` | User created their profile for the first time | `src/routes/(admin)/account/api/+page.server.ts` |
| `profile_updated` | User updated their profile | `src/routes/(admin)/account/api/+page.server.ts` |
| `account_deleted` | User deleted their account (churn) | `src/routes/(admin)/account/api/+page.server.ts` |
| `password_updated` | User successfully changed their password | `src/routes/(admin)/account/api/+page.server.ts` |
| `checkout_started` | User initiated a Stripe checkout session | `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` |
| `pricing_plan_clicked` | User clicked a pricing plan CTA | `src/routes/(marketing)/pricing/pricing_module.svelte` |
| `contact_form_submitted` | User submitted the contact form | `src/routes/(marketing)/contact_us/+page.svelte` |

User identification (`posthog.identify`) is called on both sign-in and sign-up with the Supabase user ID and email, linking client-side and server-side events.

## Next steps

We've set up tracking for the key business events in your SaaS app. Here are the recommended insights to build in your PostHog dashboard:

1. **Signup → Profile Created → Checkout Started funnel** — tracks how many users complete the full onboarding flow
   - [Create funnel insight](https://us.posthog.com/project/238460/insights/new?insight=FUNNELS)

2. **User signups over time** — trend of `user_signed_up` events
   - [Create trends insight](https://us.posthog.com/project/238460/insights/new?insight=TRENDS)

3. **Checkout started over time** — trend of `checkout_started` events showing subscription conversion
   - [Create trends insight](https://us.posthog.com/project/238460/insights/new?insight=TRENDS)

4. **Account deletions (churn)** — trend of `account_deleted` events to monitor churn
   - [Create trends insight](https://us.posthog.com/project/238460/insights/new?insight=TRENDS)

5. **Contact form submissions** — trend of `contact_form_submitted` to track lead generation
   - [Create trends insight](https://us.posthog.com/project/238460/insights/new?insight=TRENDS)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-sveltekit/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
