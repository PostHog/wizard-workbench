<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this SvelteKit SaaS Starter project. Here is a summary of all changes made:

**New files created:**
- `src/hooks.client.ts` — Initializes PostHog (posthog-js) in the browser with a `/ingest` reverse proxy, sets `capture_exceptions: true` for automatic error tracking, and exports a `handleError` hook that sends client-side exceptions to PostHog.
- `src/lib/server/posthog.ts` — Singleton factory for the PostHog Node.js SDK (`posthog-node`) used for server-side event capture with `flushAt: 1` and `flushInterval: 0` to ensure events are sent immediately.

**Modified files:**
- `svelte.config.js` — Added `paths.relative: false` (required for PostHog session replay to work correctly with SSR).
- `src/hooks.server.ts` — Added a `posthogProxy` handle that reverse-proxies `/ingest/*` requests to PostHog servers (avoiding ad blockers), added a `handleError` hook that captures server-side errors to PostHog, and extended the `handle` sequence to include `posthogProxy`.
- `src/routes/(marketing)/login/sign_in/+page.svelte` — On `SIGNED_IN` auth state change, calls `posthog.identify()` with the user's Supabase ID and email, then captures `user_signed_in`.
- `src/routes/(admin)/account/sign_out/+page.svelte` — Calls `posthog.reset()` after successful sign-out to unlink the session from the user.
- `src/routes/(marketing)/pricing/+page.svelte` — Captures `pricing_page_viewed` on mount (top of the subscription conversion funnel).
- `src/routes/(marketing)/contact_us/+page.server.ts` — Captures `contact_form_submitted` server-side after the contact request is saved and the admin email is sent.
- `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` — Captures `subscription_checkout_started` server-side after a Stripe checkout session is successfully created.
- `src/routes/(admin)/account/api/+page.server.ts` — Captures the following server-side events: `email_subscription_toggled`, `email_updated`, `password_changed`, `account_deleted`, `profile_created`, `profile_updated`.

**Environment variables set** (in `.env`):
- `PUBLIC_POSTHOG_PROJECT_TOKEN`
- `PUBLIC_POSTHOG_HOST`

---

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signs in via Supabase auth | `src/routes/(marketing)/login/sign_in/+page.svelte` |
| `pricing_page_viewed` | Visitor views the pricing page (top of conversion funnel) | `src/routes/(marketing)/pricing/+page.svelte` |
| `contact_form_submitted` | Contact form successfully submitted and saved | `src/routes/(marketing)/contact_us/+page.server.ts` |
| `subscription_checkout_started` | User initiated Stripe checkout for a paid plan | `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` |
| `profile_created` | User completed their profile for the first time (activation event) | `src/routes/(admin)/account/api/+page.server.ts` |
| `profile_updated` | Existing user updated their profile details | `src/routes/(admin)/account/api/+page.server.ts` |
| `password_changed` | User successfully changed their password | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_updated` | User requested an email address change | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_subscription_toggled` | User toggled their marketing email subscription | `src/routes/(admin)/account/api/+page.server.ts` |
| `account_deleted` | User deleted their account (churn signal) | `src/routes/(admin)/account/api/+page.server.ts` |
| `server_error` | Unhandled server-side error (automatic) | `src/hooks.server.ts` |

---

## Next steps

To monitor user behavior, create an **"Analytics basics"** dashboard in PostHog with the following suggested insights:

1. **Sign-in trend** — Trends chart of `user_signed_in` over time, to track daily/weekly active authentication.
2. **Pricing → Checkout conversion funnel** — Funnel from `pricing_page_viewed` → `subscription_checkout_started` to measure how many visitors reach the checkout.
3. **Activation funnel** — Funnel from `user_signed_in` → `profile_created` to track new user activation rate.
4. **Churn signal** — Trends chart of `account_deleted` over time.
5. **Contact form submissions** — Trends chart of `contact_form_submitted` over time.

You can build these at: [PostHog Insights](/insights)

> **Note:** Dashboard creation via the MCP was not possible because the current API key is missing `dashboard:write` and `insight:write` scopes. You can add these scopes in [PostHog → Project Settings → Personal API Keys](/settings/user-api-keys) and re-run the wizard, or create the dashboard manually using the links above.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-sveltekit/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
