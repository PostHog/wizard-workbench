<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CMSaasStarter SvelteKit application. The integration includes:

- **Client-side initialization** via `src/hooks.client.ts` — PostHog is initialized once on app start using the `init()` hook, with a reverse proxy path (`/ingest`) to avoid ad blockers and `capture_exceptions: true` for automatic error tracking.
- **Server-side tracking** via an updated `src/hooks.server.ts` — a reverse proxy handler routes `/ingest` requests to PostHog servers, and a `handleError` hook captures all unhandled server errors.
- **Server-side PostHog singleton** at `src/lib/server/posthog.ts` — used across all server-side tracking to ensure one shared client instance.
- **User identification** on sign-in and sign-up — `posthog.identify()` is called with the Supabase user ID and email when auth state changes to `SIGNED_IN` or `SIGNED_UP`.
- **Session cleanup** on sign-out — `posthog.reset()` is called after successful sign-out.
- **12 business-critical events** tracked across auth, billing, profile, and settings flows.
- **Session replay** support — `paths.relative: false` added to `svelte.config.js`.
- **Environment variables** set in `.env` with `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST`.

## Events tracked

| Event | Description | File |
|-------|-------------|------|
| `user_signed_in` | User successfully signed in (identifies user) | `src/routes/(marketing)/login/sign_in/+page.svelte` |
| `user_signed_up` | User created a new account (identifies user) | `src/routes/(marketing)/login/sign_up/+page.svelte` |
| `user_signed_out` | User signed out (resets PostHog session) | `src/routes/(admin)/account/sign_out/+page.svelte` |
| `profile_created` | User completed their profile for the first time | `src/routes/(admin)/account/api/+page.server.ts` |
| `profile_updated` | User updated their existing profile | `src/routes/(admin)/account/api/+page.server.ts` |
| `checkout_initiated` | User initiated a Stripe checkout session | `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` |
| `plan_selected` | User clicked plan CTA on the pricing module | `src/routes/(marketing)/pricing/pricing_module.svelte` |
| `contact_form_submitted` | User submitted the contact form | `src/routes/(marketing)/contact_us/+page.server.ts` |
| `password_changed` | User successfully changed their password | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_change_requested` | User requested an email address change | `src/routes/(admin)/account/api/+page.server.ts` |
| `account_deleted` | User deleted their account (churn signal) | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_subscription_toggled` | User toggled marketing email preference | `src/routes/(admin)/account/api/+page.server.ts` |

## Next steps

We've designed an **"Analytics basics"** dashboard with 5 insights to keep an eye on user behavior. To create it, go to your [PostHog project](https://us.posthog.com/project/2) and create a new dashboard named "Analytics basics" with the following insights:

1. **Sign-up to Profile Conversion Funnel** — Funnel: `user_signed_up` → `profile_created`
2. **Checkout Funnel** — Funnel: `plan_selected` → `checkout_initiated`
3. **Daily Active Sign-ins** — Trend: `user_signed_in` over time
4. **Account Churn** — Trend: `account_deleted` over time
5. **Contact Form Leads** — Trend: `contact_form_submitted` over time

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-sveltekit/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
