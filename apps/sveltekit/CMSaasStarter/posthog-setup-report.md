<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CMSaasStarter SvelteKit project. PostHog is now initialized on both the client and server sides, with a reverse proxy configured to avoid ad blockers, full user identification on login/signup, error tracking on both client and server, and 11 meaningful business events instrumented across critical user flows.

## Files created or modified

| File | Change |
|------|--------|
| `src/hooks.client.ts` | **Created** – PostHog JS initialization via `init()` export, client-side error tracking via `handleError` |
| `src/hooks.server.ts` | **Modified** – Added PostHog reverse proxy (`/ingest` route) and server-side error tracking via `handleError` |
| `src/lib/server/posthog.ts` | **Created** – Server-side PostHog Node.js singleton (`getPostHogClient`) |
| `svelte.config.js` | **Modified** – Added `paths.relative: false` (required for PostHog session replay with SSR) |
| `.env` | **Modified** – Added `PUBLIC_POSTHOG_KEY` and `PUBLIC_POSTHOG_HOST` |

## Events instrumented

| Event Name | Description | File |
|------------|-------------|-------|
| `user_signed_in` | User successfully signed in via the sign in page (Supabase auth state change) | `src/routes/(marketing)/login/sign_in/+page.svelte` |
| `user_signed_up` | User successfully signed up for an account (Supabase auth state change) | `src/routes/(marketing)/login/sign_up/+page.svelte` |
| `user_signed_out` | User signed out of the application | `src/routes/(admin)/account/sign_out/+page.svelte` |
| `subscription_checkout_started` | User initiated a subscription checkout for a paid plan via Stripe | `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` |
| `contact_us_submitted` | User successfully submitted the contact us form | `src/routes/(marketing)/contact_us/+page.server.ts` |
| `profile_created` | User created their profile for the first time after sign-up | `src/routes/(admin)/account/api/+page.server.ts` |
| `profile_updated` | User updated their profile (full name, company, website) | `src/routes/(admin)/account/api/+page.server.ts` |
| `account_deleted` | User deleted their account (churn signal) | `src/routes/(admin)/account/api/+page.server.ts` |
| `password_changed` | User successfully changed their password | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_subscription_toggled` | User toggled their email subscription preference | `src/routes/(admin)/account/api/+page.server.ts` |
| `forgot_password_requested` | User requested a password reset via password recovery flow | `src/routes/(marketing)/login/forgot_password/+page.svelte` |

## Next steps

We recommend building a dashboard in PostHog to keep an eye on user behavior. Here are the five insights to create, based on the events we just instrumented:

1. **Sign-up → Profile → Checkout conversion funnel** – Create a Funnel insight with steps: `user_signed_up` → `profile_created` → `subscription_checkout_started`. This shows where users drop off in the core conversion path.

2. **New sign-ups over time** – Create a Trend insight for `user_signed_up` broken down by day. This is your primary acquisition metric.

3. **Active users over time** – Create a Trend insight for `user_signed_in` to track daily/weekly active users returning to the app.

4. **Churn signal: account deletions** – Create a Trend insight for `account_deleted`. This is your most critical churn signal.

5. **Contact form submissions** – Create a Trend insight for `contact_us_submitted`. This shows marketing demand and sales pipeline interest.

To create these in PostHog:
- Go to [https://us.posthog.com/project/2/insights](https://us.posthog.com/project/2/insights)
- Create each insight and add them to a new dashboard named "Analytics basics"

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-sveltekit/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
