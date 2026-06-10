<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this SvelteKit SaaS starter. The integration covers client-side tracking, server-side event capture, user identification, a reverse proxy to avoid ad blockers, session replay support, and error tracking.

**New files created:**
- `src/hooks.client.ts` — Initializes PostHog on the client via the SvelteKit `init` hook, sets up the reverse proxy (`/ingest`), enables exception capture, and handles client-side errors via `handleError`.
- `src/lib/server/posthog.ts` — Server-side PostHog singleton using `posthog-node`, shared across all server routes.

**Modified files:**
- `src/hooks.server.ts` — Added `posthogProxy` handler to forward `/ingest` and `/ingest/static|array` requests to PostHog's ingestion servers, prepended to the existing `sequence`. Added `handleError` for server-side error capture.
- `svelte.config.js` — Added `paths: { relative: false }` required for session replay to work correctly with SSR.
- `src/routes/(marketing)/login/sign_in/+page.svelte` — Calls `posthog.identify()` and captures `user_signed_in` on the `SIGNED_IN` auth state change event.
- `src/routes/(marketing)/login/sign_up/+page.svelte` — Captures `user_signed_up` and identifies new users on `SIGNED_IN` when `created_at` is within 10 seconds.
- `src/routes/(admin)/account/sign_out/+page.svelte` — Captures `user_signed_out` and calls `posthog.reset()` after Supabase sign-out.
- `src/routes/(admin)/account/api/+page.server.ts` — Server-side events for profile creation/update, email change, password change, email subscription toggle, and account deletion.
- `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` — Captures `checkout_initiated` with the Stripe price ID when a checkout session is created.
- `src/routes/(admin)/account/(menu)/billing/manage/+page.server.ts` — Captures `billing_portal_opened` when the Stripe billing portal session is created.
- `src/routes/(marketing)/contact_us/+page.server.ts` — Captures `contact_form_submitted` after a successful contact request is saved.

| Event | Description | File |
|-------|-------------|------|
| `user_signed_in` | User successfully signs in via Supabase Auth UI | `src/routes/(marketing)/login/sign_in/+page.svelte` |
| `user_signed_up` | New user successfully signs up | `src/routes/(marketing)/login/sign_up/+page.svelte` |
| `user_signed_out` | User signs out and PostHog session is reset | `src/routes/(admin)/account/sign_out/+page.svelte` |
| `profile_created` | User completes their profile for the first time (activation) | `src/routes/(admin)/account/api/+page.server.ts` |
| `profile_updated` | User updates their existing profile information | `src/routes/(admin)/account/api/+page.server.ts` |
| `checkout_initiated` | User starts a Stripe checkout session to subscribe | `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` |
| `billing_portal_opened` | User opens the Stripe billing portal | `src/routes/(admin)/account/(menu)/billing/manage/+page.server.ts` |
| `email_changed` | User requests an email address change | `src/routes/(admin)/account/api/+page.server.ts` |
| `password_changed` | User successfully changes their password | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_subscription_toggled` | User toggles their email marketing preference | `src/routes/(admin)/account/api/+page.server.ts` |
| `account_deleted` | User permanently deletes their account (churn event) | `src/routes/(admin)/account/api/+page.server.ts` |
| `contact_form_submitted` | Visitor submits the contact form (lead generation) | `src/routes/(marketing)/contact_us/+page.server.ts` |

## Next steps

We've suggested the following insights for your PostHog dashboard. Head to PostHog to create them:

- **Sign-up to profile completion funnel** — `user_signed_up` → `profile_created`: measures activation rate after registration.
- **Sign-up to checkout funnel** — `user_signed_up` → `checkout_initiated`: measures conversion from free to paid.
- **Checkout initiated trend** — `checkout_initiated` over time: tracks subscription growth.
- **Account deletion trend** — `account_deleted` over time: monitors churn rate.
- **Contact form submissions** — `contact_form_submitted` over time: tracks inbound lead volume.

**[Create a new insight →](https://us.posthog.com/project/2/insights/new)**

**[View all dashboards →](https://us.posthog.com/project/2/dashboard)**

> Note: Dashboard creation requires `dashboard:write` scope on your PostHog personal API key. Add this scope at **PostHog → Settings → Personal API keys**, then re-run the wizard to auto-create the dashboard.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-sveltekit/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
