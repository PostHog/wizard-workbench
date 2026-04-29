# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into CMSaasStarter. The integration covers client-side initialization with session replay, a reverse proxy to avoid ad blockers, client-side error tracking via `handleError`, server-side error tracking, user identification on login and signup, and 10 business events spanning the full user lifecycle from signup to account deletion.

## Files created or modified

| File | Change |
|---|---|
| `src/hooks.client.ts` | Created — initializes posthog-js with reverse proxy and captures client-side exceptions |
| `src/lib/server/posthog.ts` | Created — singleton posthog-node client for server-side event capture |
| `src/hooks.server.ts` | Modified — added `/ingest` reverse proxy handle and server-side `handleError` |
| `svelte.config.js` | Modified — added `paths.relative: false` for session replay SSR compatibility |
| `.env` | Created — added `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` |

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signed in via email/password or OAuth | `src/routes/(marketing)/login/sign_in/+page.svelte` |
| `user_signed_up` | User successfully created a new account | `src/routes/(marketing)/login/sign_up/+page.svelte` |
| `plan_cta_clicked` | User clicked a plan CTA button on the pricing module | `src/routes/(marketing)/pricing/pricing_module.svelte` |
| `checkout_started` | User was redirected to Stripe checkout to subscribe | `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` |
| `profile_created` | User completed their profile for the first time | `src/routes/(admin)/account/api/+page.server.ts` |
| `profile_updated` | User updated their existing profile information | `src/routes/(admin)/account/api/+page.server.ts` |
| `password_changed` | User successfully changed their password | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_subscription_toggled` | User toggled their email subscription preference | `src/routes/(admin)/account/api/+page.server.ts` |
| `account_deleted` | User successfully deleted their account | `src/routes/(admin)/account/api/+page.server.ts` |
| `contact_form_submitted` | User submitted the contact us form | `src/routes/(marketing)/contact_us/+page.server.ts` |

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog with the following insights to monitor key business metrics:

1. **Signup to Checkout Funnel** — Funnel insight: `user_signed_up` → `profile_created` → `plan_cta_clicked` → `checkout_started`
2. **Daily Sign-ins** — Trends insight: `user_signed_in` over time
3. **New Signups Over Time** — Trends insight: `user_signed_up` over time
4. **Contact Form Submissions** — Trends insight: `contact_form_submitted` over time
5. **Account Churn** — Trends insight: `account_deleted` over time

Create them here:
- **PostHog Dashboards**: https://us.posthog.com/project/2/dashboards
- **New Insight**: https://us.posthog.com/project/2/insights/new

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-sveltekit/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
