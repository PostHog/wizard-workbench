<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your CMSaasStarter SvelteKit project. The integration covers client-side tracking, server-side event capture, user identification, error tracking, session replay, and a reverse proxy to avoid ad blockers.

**Files created or modified:**

- `src/hooks.client.ts` (new) — Initializes PostHog on the client via the `init` hook, routes events through `/ingest` reverse proxy, and captures client-side errors via `handleError`
- `src/lib/server/posthog.ts` (new) — Singleton PostHog Node.js client for server-side event capture
- `src/hooks.server.ts` — Added `/ingest` reverse proxy handler and `handleError` for server-side error tracking; extended `handle` sequence with `posthogProxy`
- `svelte.config.js` — Added `paths.relative: false` required for PostHog session replay to work correctly with SSR
- `.env` — Added `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST`

**Event tracking added:**

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signed in via Supabase Auth | `src/routes/(marketing)/login/sign_in/+page.svelte` |
| `user_signed_up` | User completed sign-up via Supabase Auth | `src/routes/(marketing)/login/sign_up/+page.svelte` |
| `user_signed_out` | User signed out from their account | `src/routes/(admin)/account/sign_out/+page.svelte` |
| `contact_form_submitted` | User submitted the contact form successfully | `src/routes/(marketing)/contact_us/+page.server.ts` |
| `subscription_checkout_initiated` | User initiated a Stripe checkout session for a paid plan | `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` |
| `billing_portal_accessed` | User opened the Stripe billing portal | `src/routes/(admin)/account/(menu)/billing/manage/+page.server.ts` |
| `profile_created` | User created their profile for the first time | `src/routes/(admin)/account/api/+page.server.ts` |
| `profile_updated` | User updated their existing profile information | `src/routes/(admin)/account/api/+page.server.ts` |
| `account_deleted` | User successfully deleted their account | `src/routes/(admin)/account/api/+page.server.ts` |
| `password_changed` | User successfully changed their password | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_subscription_toggled` | User toggled their email subscription preference | `src/routes/(admin)/account/api/+page.server.ts` |
| `pricing_plan_clicked` | User clicked the CTA button on a pricing plan card | `src/routes/(marketing)/pricing/pricing_module.svelte` |

**User identification:** Users are identified with `posthog.identify(userId, { email })` on sign-in and sign-up. Server-side events use the Supabase `user.id` as `distinctId` to correlate with client-side events. On sign-out, `posthog.reset()` clears the identity.

**Error tracking:** Client-side errors are captured automatically via `handleError` in `hooks.client.ts` using `posthog.captureException()`. Server-side errors are captured via `handleError` in `hooks.server.ts`.

## Next steps

To complete the setup, create an **Analytics basics** dashboard in PostHog with these recommended insights:

1. **Signup funnel** — Funnel from `pricing_plan_clicked` → `subscription_checkout_initiated` → `profile_created`
2. **Daily active signups** — Trend of `user_signed_up` over time
3. **Sign-in volume** — Trend of `user_signed_in` over time
4. **Churn signals** — Trend of `account_deleted` and `email_subscription_toggled` (unsubscribed=true) over time
5. **Subscription conversions** — Trend of `subscription_checkout_initiated` by `plan_price_id`

You can build these at: https://us.posthog.com/project/2/insights/new

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-sveltekit/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
