<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your CMSaasStarter SvelteKit application. Here is a summary of what was set up:

**Client-side (`posthog-js`):** Initialized via `src/hooks.client.ts` with the `/ingest` reverse proxy path to avoid ad blockers, automatic exception capture enabled, and a `handleError` hook for client-side error tracking.

**Server-side (`posthog-node`):** A singleton client in `src/lib/server/posthog.ts` is used across all server-side events. A `handleError` export in `src/hooks.server.ts` captures unhandled server errors. A reverse proxy handler routes `/ingest` requests through your SvelteKit server to PostHog, bypassing ad blockers.

**Session replay:** `svelte.config.js` updated with `paths.relative: false` (required for PostHog session replay to work correctly with SSR).

**User identification:** On sign-in and sign-up, `posthog.identify()` is called with the Supabase user ID and email, correlating client and server events to the same user.

**Environment variables:** PostHog token and host are stored in `.env.local` using `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST`.

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `user_signed_in` | User successfully signs in via Supabase Auth | `src/routes/(marketing)/login/sign_in/+page.svelte` |
| `user_signed_up` | User signs up (when email verification not required) | `src/routes/(marketing)/login/sign_up/+page.svelte` |
| `user_signed_out` | User signs out of their account | `src/routes/(admin)/account/api/+page.server.ts` |
| `profile_created` | User creates their profile for the first time | `src/routes/(admin)/account/api/+page.server.ts` |
| `profile_updated` | User updates their profile information | `src/routes/(admin)/account/api/+page.server.ts` |
| `subscription_checkout_started` | User initiates a Stripe checkout for a paid plan | `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` |
| `billing_portal_opened` | User opens the Stripe billing portal | `src/routes/(admin)/account/(menu)/billing/manage/+page.server.ts` |
| `plan_selected` | User clicks to select a pricing plan | `src/routes/(marketing)/pricing/pricing_module.svelte` |
| `contact_form_submitted` | User successfully submits the contact form | `src/routes/(marketing)/contact_us/+page.server.ts` |
| `account_deleted` | User permanently deletes their account | `src/routes/(admin)/account/api/+page.server.ts` |
| `password_updated` | User successfully changes their password | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_updated` | User requests an email address change | `src/routes/(admin)/account/api/+page.server.ts` |
| `server_error` | Unhandled server-side error | `src/hooks.server.ts` |

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog with the following insights to monitor key business metrics:

1. **Signup → Subscription funnel** (Funnel insight): `user_signed_up` → `profile_created` → `plan_selected` → `subscription_checkout_started`
2. **Daily active users** (Trend): `user_signed_in` over time
3. **Subscription checkouts** (Trend): `subscription_checkout_started` over time, broken down by `plan_id`
4. **Churn indicator** (Trend): `account_deleted` over time
5. **Contact form conversions** (Trend): `contact_form_submitted` over time

You can create this dashboard at: https://us.posthog.com/project/238460/dashboard

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-sveltekit/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
