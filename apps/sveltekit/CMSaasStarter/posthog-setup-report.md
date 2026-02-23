<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this SvelteKit SaaS starter project. Here is a summary of all changes made:

## Changes summary

- **`src/hooks.client.ts`** *(new)* — Initializes PostHog client-side using the `init()` hook with a reverse proxy (`/ingest`) to avoid ad blockers. Also adds a `handleError` hook to automatically capture client-side exceptions.
- **`src/hooks.server.ts`** *(edited)* — Adds a `posthogProxy` handle to reverse-proxy `/ingest` requests to PostHog's servers. Adds a `handleError` hook to capture server-side errors. Integrates both into the existing `sequence()`.
- **`src/lib/server/posthog.ts`** *(new)* — Server-side PostHog singleton using `posthog-node`. Used by all server-side event captures.
- **`svelte.config.js`** *(edited)* — Adds `paths: { relative: false }` required for PostHog session replay to work correctly with SSR.
- **`src/routes/(marketing)/login/sign_in/+page.svelte`** *(edited)* — Identifies the user and captures `user_signed_in` after Supabase `SIGNED_IN` event.
- **`src/routes/(marketing)/login/sign_up/+page.svelte`** *(edited)* — Identifies the user and captures `user_signed_up` after Supabase `SIGNED_UP` event.
- **`src/routes/(admin)/account/sign_out/+page.svelte`** *(edited)* — Captures `user_signed_out` and calls `posthog.reset()` on successful sign-out.
- **`src/routes/(admin)/account/api/+page.server.ts`** *(edited)* — Server-side capture of `profile_created`, `profile_updated`, `password_changed`, `account_deleted`, and `email_subscription_toggled`.
- **`src/routes/(admin)/account/subscribe/[slug]/+page.server.ts`** *(edited)* — Server-side capture of `checkout_initiated` when a Stripe checkout session is created.
- **`src/routes/(admin)/account/(menu)/billing/manage/+page.server.ts`** *(edited)* — Server-side capture of `billing_portal_opened` when a Stripe billing portal session is created.
- **`src/routes/(marketing)/contact_us/+page.server.ts`** *(edited)* — Server-side capture of `contact_us_submitted` after a contact form is saved.
- **`src/routes/(marketing)/pricing/pricing_module.svelte`** *(edited)* — Client-side capture of `pricing_page_viewed` on mount, and `plan_selected` when a plan CTA is clicked.

## Instrumented events

| Event | Description | File |
|-------|-------------|------|
| `user_signed_in` | User successfully signs in via Supabase Auth (email/password or OAuth) | `src/routes/(marketing)/login/sign_in/+page.svelte` |
| `user_signed_up` | User successfully registers a new account via Supabase Auth | `src/routes/(marketing)/login/sign_up/+page.svelte` |
| `user_signed_out` | User signs out from the account area | `src/routes/(admin)/account/sign_out/+page.svelte` |
| `profile_created` | User creates their profile for the first time (full name, company, website) | `src/routes/(admin)/account/api/+page.server.ts` |
| `profile_updated` | User updates their existing profile information | `src/routes/(admin)/account/api/+page.server.ts` |
| `checkout_initiated` | User initiates a Stripe checkout session to subscribe to a paid plan | `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` |
| `billing_portal_opened` | User opens the Stripe billing portal to manage their subscription | `src/routes/(admin)/account/(menu)/billing/manage/+page.server.ts` |
| `contact_us_submitted` | User submits the contact form | `src/routes/(marketing)/contact_us/+page.server.ts` |
| `account_deleted` | User permanently deletes their account | `src/routes/(admin)/account/api/+page.server.ts` |
| `password_changed` | User successfully changes their password | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_subscription_toggled` | User toggles their email subscription (opt-in or opt-out) | `src/routes/(admin)/account/api/+page.server.ts` |
| `pricing_page_viewed` | User views the pricing page (top of conversion funnel) | `src/routes/(marketing)/pricing/pricing_module.svelte` |
| `plan_selected` | User clicks a plan CTA on the pricing or billing page | `src/routes/(marketing)/pricing/pricing_module.svelte` |

## Next steps

To create your analytics dashboard and insights, open [PostHog](https://us.posthog.com) and create a new **"Analytics basics"** dashboard with the following suggested insights:

1. **Signup → Profile → Checkout conversion funnel** — Funnel from `user_signed_up` → `profile_created` → `checkout_initiated`
2. **New signups over time** — Trend of `user_signed_up` events per day/week
3. **Checkout initiated over time** — Trend of `checkout_initiated` events, broken down by `plan_id`
4. **Churn: account deletions over time** — Trend of `account_deleted` events per week
5. **Pricing page → Plan selected → Checkout funnel** — Funnel from `pricing_page_viewed` → `plan_selected` → `checkout_initiated`

These will give you visibility into your core conversion funnel, signup growth, and churn.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-sveltekit/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
