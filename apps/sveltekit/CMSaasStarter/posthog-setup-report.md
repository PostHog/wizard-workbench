# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the SvelteKit SaaS starter. The integration covers client-side and server-side event tracking, user identification, session replay support, and error monitoring. A reverse proxy is configured to avoid ad blockers. All 13 business-critical events across the user lifecycle are instrumented — from sign-up through profile creation, subscription checkout, settings changes, and account deletion.

**Files created:**

| File | Purpose |
|------|---------|
| `src/hooks.client.ts` | PostHog client init with `/ingest` proxy, `HandleClientError` for exception capture |
| `src/lib/server/posthog.ts` | Server-side PostHog singleton (`posthog-node`) with `flushAt: 1` for immediate sends |

**Files modified:**

| File | Change |
|------|--------|
| `src/hooks.server.ts` | Added PostHog reverse proxy handler (`/ingest` → `us.i.posthog.com`), `HandleServerError` for server exceptions |
| `svelte.config.js` | Added `paths: { relative: false }` for session replay compatibility |
| `.env` | Added `PUBLIC_POSTHOG_KEY` and `PUBLIC_POSTHOG_HOST` |

---

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `user_signed_in` | User successfully signs in via Supabase auth (`SIGNED_IN` event). Used to identify users and track login. | `src/routes/(marketing)/login/sign_in/+page.svelte` |
| `user_signed_up` | New user completes sign-up. Top of the activation funnel. | `src/routes/(marketing)/login/sign_up/+page.svelte` |
| `user_signed_out` | User signs out. `posthog.reset()` called after to clear identity. | `src/routes/(admin)/account/sign_out/+page.svelte` |
| `profile_created` | User submits Create Profile form successfully. Key activation milestone. | `src/routes/(admin)/account/create_profile/+page.svelte` |
| `profile_updated` | User updates profile (name, company, website) in settings. | `src/routes/(admin)/account/(menu)/settings/edit_profile/+page.svelte` |
| `subscription_checkout_started` | User clicks a plan CTA and is redirected to Stripe checkout. Tracks plan selection intent. | `src/routes/(marketing)/pricing/pricing_module.svelte` |
| `contact_form_submitted` | User successfully submits the contact form (server-side, after DB insert confirms). | `src/routes/(marketing)/contact_us/+page.server.ts` |
| `password_reset_requested` | User submits the forgot password form. | `src/routes/(marketing)/login/forgot_password/+page.svelte` |
| `password_changed` | User successfully changes password in account settings. | `src/routes/(admin)/account/(menu)/settings/change_password/+page.svelte` |
| `email_changed` | User initiates an email change (server sends verification to both addresses). | `src/routes/(admin)/account/(menu)/settings/change_email/+page.svelte` |
| `account_deleted` | User successfully deletes their account. Critical churn signal. | `src/routes/(admin)/account/api/+page.server.ts` |
| `billing_portal_opened` | User is redirected to the Stripe billing portal. | `src/routes/(admin)/account/(menu)/billing/manage/+page.server.ts` |
| `email_subscription_toggled` | User opts in or out of marketing emails. | `src/routes/(admin)/account/api/+page.server.ts` |

---

## Next steps

We've built an "Analytics basics" dashboard for you to keep an eye on user behavior. To view it, search for **"Analytics basics"** in your PostHog dashboards, or create the following five insights directly:

### Recommended insights

1. **User acquisition funnel** — Funnel: `user_signed_up` → `profile_created` → `subscription_checkout_started`
   - Tracks sign-up to paid conversion in one view
   - [Create in PostHog](https://us.posthog.com/project/2/insights/new#{"insight":"FUNNELS","events":[{"id":"user_signed_up","type":"events"},{"id":"profile_created","type":"events"},{"id":"subscription_checkout_started","type":"events"}]})

2. **Daily sign-ins (trend)** — Trend: `user_signed_in` over time
   - Monitors active user engagement day over day
   - [Create in PostHog](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"user_signed_in","type":"events"}]})

3. **New sign-ups (trend)** — Trend: `user_signed_up` over time
   - Tracks user acquisition growth
   - [Create in PostHog](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"user_signed_up","type":"events"}]})

4. **Churn signals** — Trend: `account_deleted` over time
   - Critical churn indicator — monitor spikes immediately
   - [Create in PostHog](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"account_deleted","type":"events"}]})

5. **Checkout intent by plan** — Trend: `subscription_checkout_started` broken down by `plan_name`
   - See which pricing plans drive the most checkout attempts
   - [Create in PostHog](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"subscription_checkout_started","type":"events","properties":[]}],"breakdown":"plan_name","breakdown_type":"event"})

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-sveltekit/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
