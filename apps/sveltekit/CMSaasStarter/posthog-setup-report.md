<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CMSaasStarter SvelteKit project. The integration covers client-side initialization, server-side event tracking, a reverse proxy to avoid ad blockers, user identification, session replay configuration, and automatic error capture.

## Summary of changes

| File | Change |
|------|--------|
| `svelte.config.js` | Added `paths.relative: false` for session replay compatibility |
| `src/lib/server/posthog.ts` | **New** — Server-side PostHog singleton using `posthog-node` |
| `src/hooks.client.ts` | **New** — Client-side PostHog init, user error capture via `handleError` |
| `src/hooks.server.ts` | Added PostHog reverse proxy (`/ingest` route) and server `handleError` for server-side error capture |
| `src/routes/(marketing)/login/sign_in/+page.svelte` | `user_signed_in` event + `posthog.identify()` on Supabase `SIGNED_IN` state change |
| `src/routes/(admin)/account/sign_out/+page.svelte` | `user_signed_out` event + `posthog.reset()` on successful sign-out |
| `src/routes/(admin)/account/api/+page.server.ts` | `user_profile_created`, `user_profile_updated`, `account_deleted`, `password_changed`, `email_subscription_toggled` events |
| `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` | `checkout_session_created` event on Stripe checkout session creation |
| `src/routes/(marketing)/contact_us/+page.server.ts` | `contact_form_submitted` event after successful contact form save |

## Instrumented events

| Event | Description | File |
|-------|-------------|------|
| `user_signed_in` | User successfully signed in via the sign-in page | `src/routes/(marketing)/login/sign_in/+page.svelte` |
| `user_signed_out` | User signed out of their account | `src/routes/(admin)/account/sign_out/+page.svelte` |
| `user_profile_created` | User created their profile for the first time (onboarding milestone) | `src/routes/(admin)/account/api/+page.server.ts` |
| `user_profile_updated` | User updated their existing profile | `src/routes/(admin)/account/api/+page.server.ts` |
| `checkout_session_created` | User initiated a Stripe checkout session to subscribe to a paid plan | `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` |
| `account_deleted` | User successfully deleted their account (churn event) | `src/routes/(admin)/account/api/+page.server.ts` |
| `contact_form_submitted` | Visitor submitted the contact us form | `src/routes/(marketing)/contact_us/+page.server.ts` |
| `password_changed` | User successfully changed their password | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_subscription_toggled` | User toggled their email subscription preference | `src/routes/(admin)/account/api/+page.server.ts` |
| `server_error` | Automatic capture of unhandled server-side errors | `src/hooks.server.ts` |

## Next steps

The following insights and dashboard can be built in PostHog to monitor user behavior based on these events:

1. **Sign-in funnel** — Track `user_signed_in` to monitor authentication volume
2. **Onboarding conversion funnel** — `user_signed_in` → `user_profile_created` → `checkout_session_created`
3. **Churn rate** — `account_deleted` over time
4. **Subscription intent** — `checkout_session_created` by `plan_id`
5. **Contact form leads** — `contact_form_submitted` over time

To create an "Analytics basics" dashboard, visit your [PostHog project](https://us.posthog.com/project/2) and add insights using the event names from the table above.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
