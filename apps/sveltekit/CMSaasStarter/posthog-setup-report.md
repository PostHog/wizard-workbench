# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into CMSaasStarter. The integration includes:

- **Client-side initialization** (`src/hooks.client.ts`): PostHog is initialized once when the browser app starts, with session replay support and automatic exception capture via `captureException`.
- **Server-side PostHog singleton** (`src/lib/server/posthog.ts`): A shared `posthog-node` client for all server-side event tracking.
- **Reverse proxy** (`src/hooks.server.ts`): `/ingest` requests are proxied to PostHog servers to avoid ad blockers. Server-side errors are captured via `handleError`.
- **Session replay support** (`svelte.config.js`): `paths.relative: false` added to ensure session replay works correctly with SSR.
- **Environment variables** (`.env`): `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` set securely and referenced throughout.
- **User identification**: `posthog.identify()` is called on sign-in and sign-up with the Supabase user ID and email.
- **Sign-out reset**: `posthog.reset()` is called on sign-out to clear the user identity.
- **12 events tracked** across client and server code (see table below).

| Event | Description | File |
|-------|-------------|------|
| `user_signed_in` | User successfully signed in via Supabase Auth | `src/routes/(marketing)/login/sign_in/+page.svelte` |
| `user_signed_up` | User successfully signed up via Supabase Auth | `src/routes/(marketing)/login/sign_up/+page.svelte` |
| `user_signed_out` | User signed out of their account | `src/routes/(admin)/account/sign_out/+page.svelte` |
| `profile_created` | User completed profile creation for the first time (server-side) | `src/routes/(admin)/account/api/+page.server.ts` |
| `profile_updated` | User updated their profile information (server-side) | `src/routes/(admin)/account/api/+page.server.ts` |
| `subscription_checkout_started` | User initiated Stripe checkout for a subscription plan (server-side) | `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` |
| `billing_portal_opened` | User opened the Stripe billing portal to manage subscription (server-side) | `src/routes/(admin)/account/(menu)/billing/manage/+page.server.ts` |
| `contact_form_submitted` | User successfully submitted the contact us form (server-side) | `src/routes/(marketing)/contact_us/+page.server.ts` |
| `account_deleted` | User deleted their account (server-side) | `src/routes/(admin)/account/api/+page.server.ts` |
| `plan_selected` | User clicked to select a pricing plan from the pricing module | `src/routes/(marketing)/pricing/pricing_module.svelte` |
| `password_updated` | User successfully updated their password (server-side) | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_subscription_toggled` | User toggled their email subscription preference (server-side) | `src/routes/(admin)/account/api/+page.server.ts` |

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog with the following insights to monitor key user behavior:

1. **Signup → Profile Created funnel** — Track conversion from `user_signed_up` → `profile_created` → `plan_selected` → `subscription_checkout_started` to measure your activation funnel.
2. **Daily Active Users** — Trend of `user_signed_in` events over time segmented by unique users.
3. **Plan selection breakdown** — Bar chart of `plan_selected` grouped by `plan_name` property to see which plans attract the most interest.
4. **Churn signals** — Combined trend of `account_deleted` and `email_subscription_toggled` (where `unsubscribed = true`) to monitor disengagement.
5. **Contact form submissions** — Trend of `contact_form_submitted` events to measure inbound interest.

Create these in your PostHog project:
- **Dashboard**: https://us.posthog.com/project/2/dashboard
- **New insight**: https://us.posthog.com/project/2/insights/new

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-sveltekit/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
