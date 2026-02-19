<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this SvelteKit SaaS starter project. The integration includes:

- **Client-side initialization** via `src/hooks.client.ts` with a reverse proxy (`/ingest`) to avoid ad blockers, plus automatic client-side error tracking via `captureException`
- **Server-side tracking** via `src/lib/server/posthog.ts` (PostHog Node.js singleton) used across server actions and load functions
- **Reverse proxy** added to `src/hooks.server.ts` so PostHog requests route through `/ingest/*` on your own domain, bypassing ad blockers
- **Server-side error capture** via `handleError` in `src/hooks.server.ts`
- **User identification** on sign-in and sign-up using `posthog.identify()` with Supabase user ID and email
- **Session reset** on sign-out via `posthog.reset()`
- **`paths.relative: false`** added to `svelte.config.js` — required for PostHog session replay to work correctly with SSR
- **Environment variables** written to `.env` — keys are `PUBLIC_POSTHOG_KEY` and `PUBLIC_POSTHOG_HOST`
- **14 events** instrumented across client and server code

## Events instrumented

| Event Name | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signs in (client-side, with `identify`) | `src/routes/(marketing)/login/sign_in/+page.svelte` |
| `user_signed_up` | User successfully signs up (client-side, with `identify`) | `src/routes/(marketing)/login/sign_up/+page.svelte` |
| `user_signed_out` | User signs out; calls `posthog.reset()` | `src/routes/(admin)/account/sign_out/+page.svelte` |
| `forgot_password_submitted` | User submits forgot password form | `src/routes/(marketing)/login/forgot_password/+page.svelte` |
| `pricing_page_viewed` | User visits the pricing page (top of conversion funnel) | `src/routes/(marketing)/pricing/+page.svelte` |
| `plan_selected` | User clicks a pricing plan CTA button | `src/routes/(marketing)/pricing/pricing_module.svelte` |
| `checkout_initiated` | Stripe checkout session successfully created (server-side) | `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` |
| `contact_form_submitted` | User successfully submits the contact us form | `src/routes/(marketing)/contact_us/+page.svelte` |
| `profile_created` | User creates their profile for the first time (server-side) | `src/routes/(admin)/account/api/+page.server.ts` |
| `profile_updated` | User updates their existing profile (server-side) | `src/routes/(admin)/account/api/+page.server.ts` |
| `account_deleted` | User deletes their account — churn event (server-side) | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_updated` | User updates their email address (server-side) | `src/routes/(admin)/account/api/+page.server.ts` |
| `password_updated` | User successfully updates their password (server-side) | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_subscription_toggled` | User toggles their email subscription status (server-side) | `src/routes/(admin)/account/api/+page.server.ts` |

## New files created

| File | Purpose |
|---|---|
| `src/hooks.client.ts` | PostHog client init, reverse proxy, client error tracking |
| `src/lib/server/posthog.ts` | Server-side PostHog singleton (posthog-node) |

## Modified files

| File | Change |
|---|---|
| `src/hooks.server.ts` | Added reverse proxy handle + `handleError` server error capture |
| `svelte.config.js` | Added `paths.relative: false` for session replay |
| `src/routes/(marketing)/login/sign_in/+page.svelte` | `identify` + `user_signed_in` |
| `src/routes/(marketing)/login/sign_up/+page.svelte` | `identify` + `user_signed_up` |
| `src/routes/(admin)/account/sign_out/+page.svelte` | `user_signed_out` + `posthog.reset()` |
| `src/routes/(marketing)/login/forgot_password/+page.svelte` | `forgot_password_submitted` |
| `src/routes/(marketing)/pricing/+page.svelte` | `pricing_page_viewed` |
| `src/routes/(marketing)/pricing/pricing_module.svelte` | `plan_selected` |
| `src/routes/(marketing)/contact_us/+page.svelte` | `contact_form_submitted` |
| `src/routes/(admin)/account/api/+page.server.ts` | 6 server-side events |
| `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` | `checkout_initiated` |

## Next steps

We recommend building the following insights and a dashboard in PostHog to keep an eye on user behavior:

### Suggested "Analytics basics" Dashboard

Create this dashboard at [https://us.posthog.com](https://us.posthog.com) with the following 5 insights:

1. **User Signups & Sign-ins** — Trends insight showing `user_signed_up` and `user_signed_in` over time
2. **Pricing to Checkout Funnel** — Funnel insight: `pricing_page_viewed` → `plan_selected` → `checkout_initiated`
3. **Account Deletions (Churn)** — Trends insight showing `account_deleted` over time
4. **Profile Activity** — Trends insight showing `profile_created` and `profile_updated`
5. **Contact Form Submissions** — Trends insight showing `contact_form_submitted` over time

Visit your PostHog project: [https://us.posthog.com](https://us.posthog.com)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-sveltekit/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
