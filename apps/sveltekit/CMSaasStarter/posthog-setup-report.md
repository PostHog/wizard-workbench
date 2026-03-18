<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into CMSaasStarter. The integration includes:

- **Client-side initialization** via `src/hooks.client.ts` with session replay support, automatic exception capture, and a `/ingest` reverse proxy to avoid ad blockers
- **Server-side PostHog client** singleton at `src/lib/server/posthog.ts` using `posthog-node`
- **Reverse proxy** added to `src/hooks.server.ts` to route `/ingest` traffic through the SvelteKit server
- **Server-side error tracking** via `handleError` in `src/hooks.server.ts`
- **Client-side error tracking** via `handleError` in `src/hooks.client.ts`
- **User identification** on sign-in and sign-up using `posthog.identify()` with the Supabase user ID
- **10 business events** tracked across the conversion funnel (see table below)
- `svelte.config.js` updated with `paths.relative: false` for correct session replay with SSR

| Event | Description | File |
|-------|-------------|------|
| `user_signed_in` | User successfully signs in via Supabase Auth; also identifies the user | `src/routes/(marketing)/login/sign_in/+page.svelte` |
| `user_signed_up` | New user completes sign-up via Supabase Auth; also identifies the user | `src/routes/(marketing)/login/sign_up/+page.svelte` |
| `plan_selected` | User clicks a CTA button on a pricing plan card (top of subscription funnel) | `src/routes/(marketing)/pricing/pricing_module.svelte` |
| `checkout_initiated` | Stripe checkout session created for a subscription plan | `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` |
| `billing_portal_opened` | User is redirected to the Stripe billing management portal | `src/routes/(admin)/account/(menu)/billing/manage/+page.server.ts` |
| `profile_created` | User creates their profile for the first time | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_updated` | User requests an email address change | `src/routes/(admin)/account/api/+page.server.ts` |
| `password_updated` | User successfully updates their password | `src/routes/(admin)/account/api/+page.server.ts` |
| `account_deleted` | User deletes their account | `src/routes/(admin)/account/api/+page.server.ts` |
| `contact_form_submitted` | Contact form submitted and saved to the database | `src/routes/(marketing)/contact_us/+page.server.ts` |

## Next steps

We've set up the analytics infrastructure. To keep an eye on user behavior based on the events just instrumented, create an **"Analytics basics"** dashboard in PostHog with these suggested insights:

- **Signup → Subscription conversion funnel**: `user_signed_up` → `plan_selected` → `checkout_initiated`
- **Sign-ins over time**: Trend chart of `user_signed_in`
- **New profiles created**: Trend chart of `profile_created`
- **Churn signals**: Table of `account_deleted` events
- **Contact requests**: Trend chart of `contact_form_submitted`

Create a new dashboard at: https://us.posthog.com/project/2/dashboard/new

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
