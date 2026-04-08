<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CMSaasStarter SvelteKit project. The integration includes client-side initialization with session replay support, a server-side reverse proxy to bypass ad blockers, server-side event tracking using posthog-node, user identification tied to Supabase Auth events, and comprehensive error tracking on both client and server.

## Files created or modified

### New files
- `src/hooks.client.ts` — Initializes posthog-js in the browser via the SvelteKit `init` hook, with `capture_exceptions: true` and `handleError` for automatic client-side error tracking.
- `src/lib/server/posthog.ts` — Singleton factory for the server-side `posthog-node` client, used across all server routes.

### Modified files
- `src/hooks.server.ts` — Added a `posthogProxy` handle that routes `/ingest/*` requests to PostHog servers (avoiding ad blockers), added `handleError` for server-side exception capture.
- `svelte.config.js` — Added `paths: { relative: false }` required for PostHog session replay with SSR.
- `src/routes/(marketing)/login/sign_in/+page.svelte` — Calls `posthog.identify()` and captures `user_signed_in` on Supabase `SIGNED_IN` auth state change.
- `src/routes/(marketing)/login/sign_up/+page.svelte` — Calls `posthog.identify()` and captures `user_signed_up` on Supabase `SIGNED_IN` auth state change.
- `src/routes/(admin)/account/sign_out/+page.svelte` — Captures `user_signed_out` and calls `posthog.reset()` before redirecting.
- `src/routes/(admin)/account/api/+page.server.ts` — Captures `profile_created`, `profile_updated`, `password_changed`, and `account_deleted` via posthog-node.
- `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` — Captures `subscription_checkout_started` with plan and customer details via posthog-node.
- `src/routes/(marketing)/contact_us/+page.server.ts` — Captures `contact_form_submitted` via posthog-node.
- `src/routes/(marketing)/pricing/pricing_module.svelte` — Captures `plan_selected` client-side when a user clicks a plan CTA.

## Events tracked

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signs in via Supabase Auth | `src/routes/(marketing)/login/sign_in/+page.svelte` |
| `user_signed_up` | User creates a new account via Supabase Auth | `src/routes/(marketing)/login/sign_up/+page.svelte` |
| `user_signed_out` | User signs out | `src/routes/(admin)/account/sign_out/+page.svelte` |
| `profile_created` | User completes their profile for the first time (key onboarding step) | `src/routes/(admin)/account/api/+page.server.ts` |
| `profile_updated` | User updates their existing profile | `src/routes/(admin)/account/api/+page.server.ts` |
| `subscription_checkout_started` | User initiates a Stripe checkout for a paid plan (conversion event) | `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` |
| `account_deleted` | User deletes their account (churn event) | `src/routes/(admin)/account/api/+page.server.ts` |
| `contact_form_submitted` | Visitor submits the contact us form (top-of-funnel lead event) | `src/routes/(marketing)/contact_us/+page.server.ts` |
| `plan_selected` | User clicks a pricing plan CTA | `src/routes/(marketing)/pricing/pricing_module.svelte` |
| `password_changed` | User successfully changes their password | `src/routes/(admin)/account/api/+page.server.ts` |

## Next steps

Once events start flowing in, we recommend building insights and a dashboard in PostHog to monitor user behavior. Here are the key insights to create:

**Suggested "Analytics basics" dashboard:**

1. **Sign-up to profile completion funnel** — Funnel from `user_signed_up` → `profile_created` to measure onboarding completion rate.
2. **Subscription conversion funnel** — Funnel from `user_signed_in` → `plan_selected` → `subscription_checkout_started` to measure paid conversion.
3. **Sign-ups over time** — Trend of `user_signed_up` to track growth.
4. **Contact form leads** — Trend of `contact_form_submitted` to track top-of-funnel leads.
5. **Churn events** — Trend of `account_deleted` to monitor churn.

You can create these at https://us.posthog.com/project/2/insights/new

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-sveltekit/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
