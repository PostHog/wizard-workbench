# PostHog post-wizard report

The wizard has completed a deep integration of your SvelteKit SaaS project with PostHog. Here's a summary of every change made:

- **`src/hooks.client.ts`** (new) — Initializes PostHog JS on the client side with a reverse proxy path (`/ingest`), the `2026-01-30` defaults snapshot, and automatic exception capture via `capture_exceptions: true`. Also exports `handleError` to forward client-side exceptions to PostHog.
- **`src/lib/server/posthog.ts`** (new) — Singleton factory for the server-side `posthog-node` client configured with `flushAt: 1` and `flushInterval: 0` so events are sent immediately on each server request.
- **`src/hooks.server.ts`** (edited) — Added a `posthogProxy` handle that reverse-proxies `/ingest/*` requests to PostHog's US servers, avoiding ad-blockers. Also exports `handleError` to capture server errors as `server_error` events.
- **`svelte.config.js`** (edited) — Added `paths: { relative: false }` required for PostHog session replay to function correctly with SvelteKit SSR.
- **`src/routes/(marketing)/login/sign_in/+page.svelte`** (edited) — Calls `posthog.identify(userId, { email })` and captures `user_signed_in` on the Supabase `SIGNED_IN` auth state event.
- **`src/routes/(marketing)/login/sign_up/+page.svelte`** (edited) — Listens for the Supabase `SIGNED_IN` auth state event, calls `posthog.identify(userId, { email })`, and captures `user_signed_up`.
- **`src/routes/(admin)/account/sign_out/+page.svelte`** (edited) — Calls `posthog.reset()` on successful sign-out to unlink the user from future anonymous events.
- **`src/routes/(marketing)/pricing/pricing_module.svelte`** (edited) — Captures `plan_selected` with `plan_id`, `plan_name`, and `plan_price` when a user clicks a plan CTA.
- **`src/routes/(admin)/account/subscribe/[slug]/+page.server.ts`** (edited) — Captures `subscription_checkout_started` server-side with the `plan_id` after a Stripe checkout session is created.
- **`src/routes/(admin)/account/(menu)/billing/manage/+page.server.ts`** (edited) — Captures `billing_portal_opened` server-side when the user is redirected to the Stripe billing portal.
- **`src/routes/(marketing)/contact_us/+page.server.ts`** (edited) — Captures `contact_us_submitted` server-side with `company` and `has_phone` properties.
- **`src/routes/(admin)/account/api/+page.server.ts`** (edited) — Captures five server-side events: `profile_created` / `profile_updated` (with `$set` person properties for name, company, website), `account_deleted`, `email_subscription_toggled`, and `password_changed`.
- **`.env`** (updated) — Added `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` environment variables (covered by `.gitignore`).

## Events

| Event | Description | File |
|-------|-------------|------|
| `user_signed_in` | User successfully signs in | `src/routes/(marketing)/login/sign_in/+page.svelte` |
| `user_signed_up` | New user completes sign-up | `src/routes/(marketing)/login/sign_up/+page.svelte` |
| `profile_created` | User creates their profile for the first time | `src/routes/(admin)/account/api/+page.server.ts` |
| `profile_updated` | User updates their existing profile | `src/routes/(admin)/account/api/+page.server.ts` |
| `subscription_checkout_started` | Stripe checkout session created for a plan | `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` |
| `billing_portal_opened` | User redirected to Stripe billing portal | `src/routes/(admin)/account/(menu)/billing/manage/+page.server.ts` |
| `contact_us_submitted` | Contact form successfully submitted | `src/routes/(marketing)/contact_us/+page.server.ts` |
| `account_deleted` | User deletes their account | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_subscription_toggled` | User subscribes/unsubscribes from emails | `src/routes/(admin)/account/api/+page.server.ts` |
| `password_changed` | User changes their password | `src/routes/(admin)/account/api/+page.server.ts` |
| `plan_selected` | User clicks a pricing plan CTA | `src/routes/(marketing)/pricing/pricing_module.svelte` |

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog with these key insights:

1. **Signup → Profile → Subscription conversion funnel** — a funnel insight with steps: `user_signed_up` → `profile_created` → `subscription_checkout_started`
2. **Daily new signups trend** — a trends insight for `user_signed_up` over time
3. **Churn risk: account deletions** — a trends insight for `account_deleted` over time
4. **Plan selection breakdown** — a trends insight for `plan_selected` broken down by `plan_name`
5. **Contact form submissions** — a trends insight for `contact_us_submitted` over time

Navigate to your [PostHog Insights](https://us.posthog.com/project/2/insights) and [Dashboards](https://us.posthog.com/project/2/dashboards) to build these.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
