<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this CMSaasStarter SvelteKit project. The integration includes:

- **Client-side initialization** (`src/hooks.client.ts`) — PostHog is initialized once when the app boots via SvelteKit's `init()` hook, routing events through `/ingest` to avoid ad blockers. Client-side exceptions are automatically captured via `handleError`.
- **Server-side singleton** (`src/lib/server/posthog.ts`) — A `posthog-node` singleton ensures a single server-side PostHog client with immediate flushing (`flushAt: 1`, `flushInterval: 0`) for reliable event delivery.
- **Reverse proxy** (`src/hooks.server.ts`) — The `/ingest` route proxies PostHog requests server-side to bypass ad blockers. Server-side errors are captured via `handleError`.
- **User identification** — `posthog.identify()` is called with the Supabase user ID and email on sign-in and sign-up, correlating client and server events to the same user.
- **Session replay support** — `svelte.config.js` updated with `paths.relative: false` for correct session replay behavior.
- **10 business events** tracked across authentication, subscription, and contact flows.

| Event | Description | File |
|-------|-------------|------|
| `user_signed_in` | User signs in via Supabase auth (client-side, with identify) | `src/routes/(marketing)/login/sign_in/+page.svelte` |
| `user_signed_up` | User signs up via Supabase auth (client-side, with identify) | `src/routes/(marketing)/login/sign_up/+page.svelte` |
| `user_signed_out` | User signs out (client-side, followed by posthog.reset()) | `src/routes/(admin)/account/sign_out/+page.svelte` |
| `profile_created` | User creates their profile for the first time (server-side) | `src/routes/(admin)/account/api/+page.server.ts` |
| `profile_updated` | User updates their existing profile (server-side) | `src/routes/(admin)/account/api/+page.server.ts` |
| `account_deleted` | User deletes their account (server-side) | `src/routes/(admin)/account/api/+page.server.ts` |
| `password_updated` | User changes their password (server-side) | `src/routes/(admin)/account/api/+page.server.ts` |
| `subscription_checkout_started` | User initiates a Stripe subscription checkout (server-side) | `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` |
| `billing_portal_accessed` | User opens the Stripe billing portal to manage subscription (server-side) | `src/routes/(admin)/account/(menu)/billing/manage/+page.server.ts` |
| `contact_us_submitted` | User submits the contact us form (server-side) | `src/routes/(marketing)/contact_us/+page.server.ts` |

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog with the following insights based on the events we instrumented:

1. **Signup → Profile Created funnel** — Track conversion from `user_signed_up` → `profile_created` to measure onboarding completion rate.
2. **Signup → Subscription funnel** — Track `user_signed_up` → `subscription_checkout_started` to see how many new users convert to paying customers.
3. **Active users trend** — Trend of `user_signed_in` over time to track daily/weekly active users.
4. **Churn risk: account deletions** — Trend of `account_deleted` events to monitor churn signals early.
5. **Contact form conversions** — Count of `contact_us_submitted` to measure marketing-to-lead conversion.

You can create these insights at: [https://us.posthog.com/project/2/insights](https://us.posthog.com/project/2/insights)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
