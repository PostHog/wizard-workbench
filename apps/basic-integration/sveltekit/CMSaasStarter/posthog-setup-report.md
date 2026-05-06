<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this SvelteKit CMSaasStarter project. The following changes were made:

- **`src/hooks.client.ts`** *(new)* — Initializes PostHog on the client side using the `init()` hook with the `/ingest` reverse proxy path. Also registers a `handleError` hook to automatically capture all client-side exceptions with `posthog.captureException`.
- **`src/lib/server/posthog.ts`** *(new)* — Singleton server-side PostHog client (`posthog-node`) used across all server routes, with `flushAt: 1` / `flushInterval: 0` for immediate flushing in SSR/serverless contexts.
- **`src/hooks.server.ts`** — Added a `posthogProxy` handle that reverse-proxies `/ingest/*` requests to PostHog's servers (avoids ad blockers). Also added `handleError` to capture server-side errors with a `server_error` event.
- **`svelte.config.js`** — Added `paths: { relative: false }` required for PostHog session replay to work correctly with SSR.
- **`src/routes/(marketing)/login/sign_in/+page.svelte`** — Calls `posthog.identify()` and captures `user_signed_in` when the Supabase `SIGNED_IN` auth event fires.
- **`src/routes/(marketing)/login/sign_up/+page.svelte`** — Calls `posthog.identify()` and captures `user_signed_up` when the Supabase `SIGNED_UP` auth event fires.
- **`src/routes/(admin)/account/sign_out/+page.svelte`** — Captures `user_signed_out` and calls `posthog.reset()` to clear identity on sign-out.
- **`src/routes/(admin)/account/api/+page.server.ts`** — Server-side capture of `profile_created`, `profile_updated`, `account_deleted`, `password_changed`, and `email_subscription_toggled`.
- **`src/routes/(admin)/account/subscribe/[slug]/+page.server.ts`** — Server-side capture of `subscription_checkout_started` with plan ID and Stripe customer ID.
- **`src/routes/(admin)/account/(menu)/billing/manage/+page.server.ts`** — Server-side capture of `billing_portal_opened` when a user accesses the Stripe billing portal.
- **`src/routes/(marketing)/contact_us/+page.server.ts`** — Server-side capture of `contact_form_submitted` after a successful form submission.
- **`src/routes/(marketing)/pricing/pricing_module.svelte`** — Client-side capture of `plan_selected` with plan name and price when a user clicks a plan CTA.
- **`.env`** — Added `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` environment variables.

## Events

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signs in | `src/routes/(marketing)/login/sign_in/+page.svelte` |
| `user_signed_up` | User completes sign up | `src/routes/(marketing)/login/sign_up/+page.svelte` |
| `user_signed_out` | User signs out | `src/routes/(admin)/account/sign_out/+page.svelte` |
| `profile_created` | New user profile first created (onboarding complete) | `src/routes/(admin)/account/api/+page.server.ts` |
| `profile_updated` | User updates their profile | `src/routes/(admin)/account/api/+page.server.ts` |
| `account_deleted` | User deletes their account (churn signal) | `src/routes/(admin)/account/api/+page.server.ts` |
| `subscription_checkout_started` | Stripe checkout session created for a subscription plan | `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` |
| `billing_portal_opened` | User opens the Stripe billing portal | `src/routes/(admin)/account/(menu)/billing/manage/+page.server.ts` |
| `contact_form_submitted` | User submits the contact us form | `src/routes/(marketing)/contact_us/+page.server.ts` |
| `plan_selected` | User clicks a plan CTA on the pricing module | `src/routes/(marketing)/pricing/pricing_module.svelte` |
| `password_changed` | User successfully changes their password | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_subscription_toggled` | User toggles their email subscription preference | `src/routes/(admin)/account/api/+page.server.ts` |

## Next steps

We've prepared an "Analytics basics" dashboard for you to track the most important user behavior. Create it in PostHog with these five insights:

1. **Signup → Subscription funnel** — Track conversion from signup through onboarding to paid subscription.
   [Create funnel insight](https://us.posthog.com/project/2/insights/new?insight=FUNNELS)
   Steps: `user_signed_up` → `profile_created` → `subscription_checkout_started`

2. **Daily active users (sign-ins)** — Monitor daily engagement via sign-in volume.
   [Create trends insight](https://us.posthog.com/project/2/insights/new?insight=TRENDS)
   Event: `user_signed_in` — Daily trend

3. **New signups over time** — Track growth of new user registrations.
   [Create trends insight](https://us.posthog.com/project/2/insights/new?insight=TRENDS)
   Event: `user_signed_up` — Weekly trend

4. **Account deletions (churn)** — Monitor churn signals by tracking account deletions.
   [Create trends insight](https://us.posthog.com/project/2/insights/new?insight=TRENDS)
   Event: `account_deleted` — Weekly trend

5. **Plan selection breakdown** — See which pricing plans users are selecting.
   [Create trends insight](https://us.posthog.com/project/2/insights/new?insight=TRENDS)
   Event: `plan_selected` — Breakdown by `plan_name`

[Create "Analytics basics" dashboard](https://us.posthog.com/project/2/dashboard/new)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-sveltekit/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
