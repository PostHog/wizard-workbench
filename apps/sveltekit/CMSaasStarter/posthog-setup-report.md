<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this SvelteKit SaaS Starter project. The integration includes client-side initialization with session replay, a server-side reverse proxy to avoid ad blockers, user identification tied to Supabase auth events, and 10 custom business events covering the full user lifecycle from sign-up through subscription and churn.

## New files created

| File | Purpose |
|---|---|
| `src/hooks.client.ts` | Initializes PostHog JS in the browser, handles client-side error tracking |
| `src/lib/server/posthog.ts` | Server-side PostHog singleton (posthog-node) |

## Files modified

| File | Changes |
|---|---|
| `svelte.config.js` | Added `paths.relative: false` for session replay SSR compatibility |
| `src/hooks.server.ts` | Added `/ingest` reverse proxy handler and `handleError` server error tracking |

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signs in via Supabase Auth UI | `src/routes/(marketing)/login/sign_in/+page.svelte` |
| `user_signed_up` | User successfully signs up via Supabase Auth UI | `src/routes/(marketing)/login/sign_up/+page.svelte` |
| `plan_selected` | User clicks a pricing plan CTA on the pricing module | `src/routes/(marketing)/pricing/pricing_module.svelte` |
| `checkout_started` | Stripe checkout session created for a subscription plan | `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` |
| `contact_form_submitted` | Contact form successfully saved to the database | `src/routes/(marketing)/contact_us/+page.server.ts` |
| `profile_created` | User creates their profile for the first time (onboarding) | `src/routes/(admin)/account/api/+page.server.ts` |
| `profile_updated` | User updates their existing profile | `src/routes/(admin)/account/api/+page.server.ts` |
| `password_changed` | User successfully changes their password | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_subscription_toggled` | User toggles their email subscription preference | `src/routes/(admin)/account/api/+page.server.ts` |
| `account_deleted` | User successfully deletes their account (churn) | `src/routes/(admin)/account/api/+page.server.ts` |
| `server_error` | Unhandled server-side error captured automatically | `src/hooks.server.ts` |

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog with the following insights to monitor business-critical user behavior:

1. **Sign-up to Checkout Funnel** — Funnel: `user_signed_up` → `plan_selected` → `checkout_started`
2. **New User Signups** — Trend: `user_signed_up` over time
3. **Subscription Conversion Rate** — Trend: `checkout_started` volume
4. **Account Churn** — Trend: `account_deleted` over time
5. **Contact Form Submissions** — Trend: `contact_form_submitted` over time

Create your dashboard at: https://us.posthog.com/project/2/dashboard

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
