<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this SvelteKit SaaS starter project. The integration includes:

- **Client-side initialization** via `src/hooks.client.ts` using the `init()` hook pattern, with PostHog JS initialized once on startup with session replay enabled
- **Reverse proxy** in `src/hooks.server.ts` routing `/ingest` requests to PostHog servers to avoid ad blockers
- **Server-side tracking** via a singleton `src/lib/server/posthog.ts` using `posthog-node` for tracking business-critical server actions
- **Error tracking** on both client (via `handleError` in `hooks.client.ts`) and server (via `handleError` in `hooks.server.ts`)
- **User identification** on sign-in and sign-up using `posthog.identify()` with Supabase user IDs
- **User session reset** on sign-out via `posthog.reset()`
- **`paths.relative: false`** added to `svelte.config.js` as required for session replay to work correctly with SSR
- **Environment variables** stored in `.env.local` as `PUBLIC_POSTHOG_KEY` and `PUBLIC_POSTHOG_HOST`

## Events instrumented

| Event Name | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signs in via Supabase auth | `src/routes/(marketing)/login/sign_in/+page.svelte` |
| `user_signed_up` | User successfully signs up | `src/routes/(marketing)/login/sign_up/+page.svelte` |
| `user_signed_out` | User signs out of the application | `src/routes/(admin)/account/sign_out/+page.svelte` |
| `profile_created` | User creates their profile for the first time | `src/routes/(admin)/account/create_profile/+page.svelte` |
| `contact_form_submitted` | User submits the contact us form successfully | `src/routes/(marketing)/contact_us/+page.svelte` |
| `plan_selected` | User clicks to select a pricing plan | `src/routes/(marketing)/pricing/pricing_module.svelte` |
| `checkout_initiated` | Server redirects user to Stripe checkout (subscription purchase started) | `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` |
| `password_reset_requested` | User triggers password recovery flow | `src/routes/(marketing)/login/forgot_password/+page.svelte` |
| `account_deleted` | User successfully deletes their account | `src/routes/(admin)/account/api/+page.server.ts` |
| `profile_updated` | User successfully updates their profile information | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_subscription_toggled` | User toggles their email subscription preference | `src/routes/(admin)/account/api/+page.server.ts` |

## Next steps

To build an "Analytics basics" dashboard in PostHog, navigate to [PostHog Dashboards](https://us.posthog.com/project/2/dashboards) and create a new dashboard with insights like:

1. **Signup-to-profile conversion funnel**: `user_signed_up` → `profile_created` → `plan_selected` → `checkout_initiated`
2. **Daily signups trend**: Trend of `user_signed_up` over time
3. **Churn signals**: Trend of `account_deleted` over time
4. **Contact form conversion**: Trend of `contact_form_submitted` — measures marketing intent
5. **Checkout funnel**: `plan_selected` → `checkout_initiated` conversion rate

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-sveltekit/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
