<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this CMSaaS Starter SvelteKit application. Here's a summary of all changes made:

**New files created:**
- `src/hooks.client.ts` — Initializes PostHog (posthog-js) in the browser using the `init` hook, sets up the `/ingest` reverse proxy as the API host, and captures client-side errors via `handleError`.
- `src/lib/server/posthog.ts` — Server-side PostHog singleton using `posthog-node`. Provides `getPostHogClient()` for use in server actions and API routes.

**Modified files:**
- `src/hooks.server.ts` — Added a reverse proxy handle (`/ingest` → PostHog servers) to avoid ad blockers, and a `handleError` export that captures server-side errors to PostHog.
- `svelte.config.js` — Added `paths: { relative: false }` required for session replay to work correctly with SSR.
- `src/routes/(marketing)/login/sign_in/+page.svelte` — Identifies the user in PostHog and captures `user_signed_in` on successful auth state change.
- `src/routes/(marketing)/login/sign_up/+page.svelte` — Identifies the user in PostHog and captures `user_signed_up` on successful auth state change.
- `src/routes/(admin)/account/sign_out/+page.svelte` — Captures `user_signed_out` and calls `posthog.reset()` on successful sign-out.
- `src/routes/(marketing)/pricing/pricing_module.svelte` — Captures `plan_selected` with plan details when a user clicks a plan CTA.
- `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` — Captures `checkout_started` server-side when a Stripe checkout session is created.
- `src/routes/(admin)/account/api/+page.server.ts` — Captures `profile_created`, `profile_updated` (with `$set` person properties), `account_deleted`, `password_changed`, `email_changed`, and `email_subscription_toggled` server-side.
- `src/routes/(marketing)/contact_us/+page.server.ts` — Captures `contact_form_submitted` server-side after a successful contact form submission.

---

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `user_signed_in` | User successfully signs in via email/password or OAuth | `src/routes/(marketing)/login/sign_in/+page.svelte` |
| `user_signed_up` | User successfully completes sign up | `src/routes/(marketing)/login/sign_up/+page.svelte` |
| `user_signed_out` | User signs out of their account | `src/routes/(admin)/account/sign_out/+page.svelte` |
| `plan_selected` | User clicks to select a pricing plan | `src/routes/(marketing)/pricing/pricing_module.svelte` |
| `checkout_started` | User initiates Stripe checkout for a plan | `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` |
| `profile_created` | User completes their profile for the first time | `src/routes/(admin)/account/api/+page.server.ts` |
| `profile_updated` | User updates their existing profile | `src/routes/(admin)/account/api/+page.server.ts` |
| `account_deleted` | User deletes their account | `src/routes/(admin)/account/api/+page.server.ts` |
| `contact_form_submitted` | User submits the contact us form | `src/routes/(marketing)/contact_us/+page.server.ts` |
| `password_changed` | User successfully changes their password | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_changed` | User requests an email address change | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_subscription_toggled` | User toggles their email subscription preference | `src/routes/(admin)/account/api/+page.server.ts` |

---

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Create "Analytics basics" dashboard](https://us.posthog.com/projects/2/dashboards/new)
- [Sign-up to profile conversion funnel](https://us.posthog.com/projects/2/insights/new#insight=FUNNELS&events=%5B%7B%22id%22%3A%22user_signed_up%22%7D%2C%7B%22id%22%3A%22profile_created%22%7D%2C%7B%22id%22%3A%22checkout_started%22%7D%5D)
- [New sign-ups over time](https://us.posthog.com/projects/2/insights/new#insight=TRENDS&events=%5B%7B%22id%22%3A%22user_signed_up%22%7D%5D)
- [Plan selections over time](https://us.posthog.com/projects/2/insights/new#insight=TRENDS&events=%5B%7B%22id%22%3A%22plan_selected%22%7D%5D)
- [Account churn (deletions) over time](https://us.posthog.com/projects/2/insights/new#insight=TRENDS&events=%5B%7B%22id%22%3A%22account_deleted%22%7D%5D)
- [Contact form submissions](https://us.posthog.com/projects/2/insights/new#insight=TRENDS&events=%5B%7B%22id%22%3A%22contact_form_submitted%22%7D%5D)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
