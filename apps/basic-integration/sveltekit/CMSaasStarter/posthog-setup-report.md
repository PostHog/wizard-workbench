<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this SvelteKit CMSaasStarter project. Here is a summary of all changes made:

**New files created:**
- `src/hooks.client.ts` — Initializes PostHog JS on the client side via SvelteKit's `init()` hook. Configures a reverse proxy at `/ingest`, enables `capture_exceptions`, and sets up `handleError` for automatic client-side error tracking.
- `src/lib/server/posthog.ts` — Singleton factory for the PostHog Node.js client, used for all server-side event captures.

**Existing files modified:**
- `src/hooks.server.ts` — Added a `posthogProxy` handle to route `/ingest/*` and `/ingest/array/*` requests to PostHog servers (ad-blocker bypass). Also added `handleError` for automatic server-side error capture.
- `svelte.config.js` — Set `paths.relative: false` (required for PostHog session replay to work correctly with SSR).
- `src/routes/(marketing)/login/sign_in/+page.svelte` — Calls `posthog.identify()` and captures `user_signed_in` on successful Supabase auth state change.
- `src/routes/(marketing)/login/sign_up/+page.svelte` — Calls `posthog.identify()` and captures `user_signed_up` on successful Supabase auth state change.
- `src/routes/(marketing)/contact_us/+page.svelte` — Captures `contact_form_submitted` on successful form submission.
- `src/routes/(marketing)/pricing/pricing_module.svelte` — Captures `plan_selected` with plan name and price when a user clicks a plan CTA.
- `src/routes/(admin)/account/api/+page.server.ts` — Added server-side captures for `profile_created`, `profile_updated`, `password_changed`, `email_subscription_toggled`, `account_deleted`, and `user_signed_out`.
- `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` — Captures `checkout_initiated` with the Stripe price ID before redirecting to Stripe.
- `src/routes/(admin)/account/(menu)/billing/manage/+page.server.ts` — Captures `billing_portal_opened` before redirecting to the Stripe billing portal.

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signed in (client-side, via Supabase auth state change) | `src/routes/(marketing)/login/sign_in/+page.svelte` |
| `user_signed_up` | User successfully signed up (client-side, via Supabase auth state change) | `src/routes/(marketing)/login/sign_up/+page.svelte` |
| `contact_form_submitted` | User successfully submitted the contact us form | `src/routes/(marketing)/contact_us/+page.svelte` |
| `plan_selected` | User clicked a plan CTA on the pricing module | `src/routes/(marketing)/pricing/pricing_module.svelte` |
| `profile_created` | User created their profile for the first time (server-side) | `src/routes/(admin)/account/api/+page.server.ts` |
| `profile_updated` | User updated their existing profile (server-side) | `src/routes/(admin)/account/api/+page.server.ts` |
| `checkout_initiated` | User initiated a Stripe checkout session (server-side) | `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` |
| `billing_portal_opened` | User opened the Stripe billing portal (server-side) | `src/routes/(admin)/account/(menu)/billing/manage/+page.server.ts` |
| `account_deleted` | User successfully deleted their account (server-side) | `src/routes/(admin)/account/api/+page.server.ts` |
| `password_changed` | User successfully changed their password (server-side) | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_subscription_toggled` | User toggled their email marketing subscription (server-side) | `src/routes/(admin)/account/api/+page.server.ts` |
| `user_signed_out` | User successfully signed out (server-side) | `src/routes/(admin)/account/api/+page.server.ts` |

## Next steps

We've prepared an "Analytics basics" dashboard for you to create in PostHog with the following key insights based on the events we just instrumented:

1. **Signup → Checkout Funnel** (Funnel insight): Steps: `user_signed_up` → `profile_created` → `plan_selected` → `checkout_initiated`. Tracks your primary conversion path from signup to paid subscription.

2. **New signups over time** (Trend insight): Event: `user_signed_up`. Shows daily/weekly signup volume to track growth.

3. **Plan selections by plan name** (Trend insight with breakdown): Event: `plan_selected`, broken down by `plan_name` property. Shows which pricing tiers attract the most interest.

4. **Churn events** (Trend insight): Events: `account_deleted`. Tracks account deletions as a churn signal. Compare against signups to see retention health.

5. **Contact form submissions** (Trend insight): Event: `contact_form_submitted`. Tracks inbound lead interest over time.

Create this dashboard at: https://us.posthog.com/project/2/dashboards

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-sveltekit/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
