<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this SvelteKit SaaS starter application. The integration includes:

- **Client-side initialization** via `src/hooks.client.ts` — PostHog JS is bootstrapped on app load with session replay support, and client-side errors are automatically captured via `handleError`.
- **Server-side singleton** at `src/lib/server/posthog.ts` — a `posthog-node` client is shared across all server-side routes with immediate flushing (`flushAt: 1`, `flushInterval: 0`).
- **Reverse proxy** added to `src/hooks.server.ts` — all PostHog traffic is routed through `/ingest` to avoid ad blockers. Server-side errors are also captured.
- **Session replay** enabled by setting `paths.relative: false` in `svelte.config.js`.
- **User identification** — users are identified with their Supabase user ID and email on sign-in and sign-up, and their profile properties are kept in sync on every profile update.
- **12 custom events** tracked across authentication, billing, profile management, and contact flows.

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signs in | `src/routes/(marketing)/login/sign_in/+page.svelte` |
| `user_signed_up` | New user completes sign up | `src/routes/(marketing)/login/sign_up/+page.svelte` |
| `profile_created` | User creates their profile for the first time | `src/routes/(admin)/account/api/+page.server.ts` |
| `profile_updated` | User updates their existing profile | `src/routes/(admin)/account/api/+page.server.ts` |
| `contact_us_submitted` | Visitor submits the contact form | `src/routes/(marketing)/contact_us/+page.server.ts` |
| `subscription_checkout_started` | User is redirected to Stripe checkout | `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` |
| `subscription_management_opened` | User opens the Stripe billing portal | `src/routes/(admin)/account/(menu)/billing/manage/+page.server.ts` |
| `account_deleted` | User deletes their account | `src/routes/(admin)/account/api/+page.server.ts` |
| `password_changed` | User successfully changes password | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_changed` | User requests an email address change | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_subscription_toggled` | User changes email subscription preference | `src/routes/(admin)/account/api/+page.server.ts` |
| `plan_selected` | User clicks a pricing plan CTA button | `src/routes/(marketing)/pricing/pricing_module.svelte` |

## Next steps

We've prepared an "Analytics basics" dashboard for you to create in PostHog. Go to **[PostHog → Dashboards → New dashboard](https://us.posthog.com/project/2/dashboards)** and add the following insights:

1. **Signup-to-Profile Conversion Funnel** — Funnel: `user_signed_up` → `profile_created` → `plan_selected` → `subscription_checkout_started`. Shows where users drop off in the onboarding flow.

2. **Daily Sign-ins and Sign-ups Trend** — Trends: `user_signed_in` and `user_signed_up` over time. Reveals user acquisition and engagement patterns.

3. **Subscription Checkout Conversion** — Funnel: `plan_selected` → `subscription_checkout_started`. Measures how many users who clicked a plan actually started checkout.

4. **Churn Signals** — Trends: `account_deleted` and `email_subscription_toggled` (where `unsubscribed = true`) over time. Early warning system for churn.

5. **Contact Form Submissions** — Trends: `contact_us_submitted` over time. Tracks inbound interest and support demand.

To build these insights, navigate to **[PostHog Insights](https://us.posthog.com/project/2/insights/new)** and select the appropriate insight type (Funnel or Trends).

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-sveltekit/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
