<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this SvelteKit SaaS starter project. The following changes were made:

- **`src/hooks.client.ts`** (new): Initializes PostHog in the browser via the `init()` lifecycle hook, pointing to `/ingest` for the reverse proxy. Also wires up `handleError` to forward client-side exceptions to PostHog automatically.
- **`src/hooks.server.ts`** (updated): Added a `posthogProxy` SvelteKit handle that reverse-proxies `/ingest` requests to PostHog servers (bypassing ad blockers), imported and registered it first in the `sequence`. Added `handleError` to capture server-side errors.
- **`src/lib/server/posthog.ts`** (new): Singleton PostHog Node.js client used for all server-side event captures, configured with `flushAt: 1` and `flushInterval: 0` to flush immediately on serverless/SSR workloads.
- **`svelte.config.js`** (updated): Added `paths.relative: false` — required for PostHog session replay to work correctly with SSR.
- **`.env`** (updated): `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` set via wizard-tools (never committed to source).

## Tracked Events

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | User completed sign-up via email or OAuth and was redirected through the auth callback | `src/routes/(marketing)/auth/callback/+server.js` |
| `user_signed_in` | User successfully authenticated; PostHog `identify()` called with user ID and email | `src/routes/(marketing)/login/sign_in/+page.svelte` |
| `user_signed_out` | User signed out; PostHog `reset()` called to clear the session | `src/routes/(admin)/account/sign_out/+page.svelte` |
| `profile_created` | User created their profile for the first time | `src/routes/(admin)/account/api/+page.server.ts` |
| `profile_updated` | Existing user updated their profile (name, company, website) | `src/routes/(admin)/account/api/+page.server.ts` |
| `checkout_started` | User was redirected to Stripe Checkout to subscribe to a paid plan | `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` |
| `billing_portal_accessed` | User was redirected to the Stripe billing portal to manage their subscription | `src/routes/(admin)/account/(menu)/billing/manage/+page.server.ts` |
| `contact_form_submitted` | User successfully submitted the contact us form | `src/routes/(marketing)/contact_us/+page.server.ts` |
| `password_changed` | User successfully changed their password | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_change_requested` | User requested an email address change (requires verification) | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_subscription_toggled` | User toggled their email subscription preference on or off | `src/routes/(admin)/account/api/+page.server.ts` |
| `account_deleted` | User deleted their account after confirming with their password | `src/routes/(admin)/account/api/+page.server.ts` |
| `plan_selected` | User clicked on a plan CTA on the pricing page or plan selection screen | `src/routes/(marketing)/pricing/pricing_module.svelte` |

## Next steps

Visit your [PostHog project](https://us.posthog.com/project/2) to explore these events and build an "Analytics basics" dashboard. Recommended insights:

1. **Sign-up → Profile → Checkout funnel** — Conversion funnel using `user_signed_up` → `profile_created` → `checkout_started`
2. **Daily sign-ins trend** — Trends chart for `user_signed_in` over time
3. **Plan selection breakdown** — Trends chart for `plan_selected` broken down by `plan_name` property
4. **Contact form submissions** — Trends chart for `contact_form_submitted`
5. **Churn signals** — Trends chart combining `account_deleted` and `email_subscription_toggled` (unsubscribed = true)

You can build these at [PostHog Insights](https://us.posthog.com/project/2/insights).

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-sveltekit/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
