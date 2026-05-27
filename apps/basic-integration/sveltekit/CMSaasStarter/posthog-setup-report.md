<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this SvelteKit SaaS starter project. The integration includes:

- **Client-side initialization** (`src/hooks.client.ts`): PostHog is initialized on app startup with a reverse-proxy API host (`/ingest`), session replay, and automatic exception capture. Client-side errors are forwarded to PostHog via `handleError`.
- **Server-side singleton** (`src/lib/server/posthog.ts`): A `posthog-node` singleton with `flushAt: 1` ensures every server event is sent immediately.
- **Reverse proxy** (`src/hooks.server.ts`): All `/ingest/*` requests are proxied to PostHog's ingestion servers to avoid ad-blockers. Both `/ingest/static/*` and `/ingest/array/*` route to the assets origin. Server-side errors are captured via `handleError`.
- **Session replay fix** (`svelte.config.js`): `paths.relative: false` is set so PostHog session replay works correctly with SSR.
- **User identification**: Users are identified with their Supabase user ID and email on both sign-in and sign-up via `posthog.identify()` + `posthog.capture()`.
- **12 custom events** placed across the conversion funnel, authentication, billing, and account management flows.

| Event | Description | File |
|-------|-------------|------|
| `user_signed_in` | User successfully signs in via Supabase Auth UI | `src/routes/(marketing)/login/sign_in/+page.svelte` |
| `user_signed_up` | User completes sign up via Supabase Auth UI | `src/routes/(marketing)/login/sign_up/+page.svelte` |
| `pricing_plan_clicked` | User clicks a call-to-action button on a pricing plan card | `src/routes/(marketing)/pricing/pricing_module.svelte` |
| `checkout_started` | User is redirected to Stripe checkout to subscribe to a plan | `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` |
| `billing_portal_opened` | User is redirected to Stripe billing portal to manage subscription | `src/routes/(admin)/account/(menu)/billing/manage/+page.server.ts` |
| `profile_created` | User creates their profile for the first time after signup | `src/routes/(admin)/account/api/+page.server.ts` |
| `profile_updated` | User updates their existing profile information | `src/routes/(admin)/account/api/+page.server.ts` |
| `account_deleted` | User successfully deletes their account (churn signal) | `src/routes/(admin)/account/api/+page.server.ts` |
| `password_updated` | User successfully changes their password | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_updated` | User requests an email address change | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_subscription_toggled` | User toggles their email subscription preference | `src/routes/(admin)/account/api/+page.server.ts` |
| `contact_form_submitted` | User successfully submits the contact form | `src/routes/(marketing)/contact_us/+page.server.ts` |

## Next steps

To build a dashboard for these events, visit your [PostHog project](https://us.posthog.com/project/2) and create a new dashboard named **"Analytics basics"** with these recommended insights:

1. **Signup-to-checkout funnel** — Funnel with steps: `user_signed_up` → `profile_created` → `pricing_plan_clicked` → `checkout_started`
2. **Daily sign-ins & sign-ups** — Trends showing `user_signed_in` and `user_signed_up` over time
3. **Account churn** — Trend of `account_deleted` events over time
4. **Contact form submissions** — Trend of `contact_form_submitted` events
5. **Billing portal usage** — Trend of `billing_portal_opened` events

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-sveltekit/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
