<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this SvelteKit SaaS starter project. The integration covers client-side initialization with session replay, a reverse proxy to avoid ad blockers, server-side event tracking via `posthog-node`, user identification on sign-in, and automatic client-side error capture. Thirteen business events are now tracked across authentication, billing, account management, and lead generation flows.

**New files created:**
- `src/hooks.client.ts` — initializes PostHog on the browser, captures client-side errors
- `src/lib/server/posthog.ts` — server-side PostHog singleton

**Files modified:**
- `src/hooks.server.ts` — added `/ingest` reverse proxy handler and `handleError` for server-side error tracking
- `svelte.config.js` — added `paths.relative: false` (required for session replay)
- `src/routes/(marketing)/login/sign_in/+page.svelte` — identifies user and captures `user_signed_in` on auth state change
- `src/routes/(marketing)/login/sign_up/+page.svelte` — captures `sign_up_page_viewed`
- `src/routes/(marketing)/pricing/+page.svelte` — captures `pricing_page_viewed`
- `src/routes/(marketing)/contact_us/+page.server.ts` — captures `contact_form_submitted`
- `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` — captures `subscription_checkout_started`
- `src/routes/(admin)/account/(menu)/billing/manage/+page.server.ts` — captures `billing_portal_accessed`
- `src/routes/(admin)/account/api/+page.server.ts` — captures `user_signed_out`, `account_deleted`, `profile_completed`, `profile_updated`, `password_changed`, `email_changed`, `email_subscription_toggled`

| Event Name | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signs in and is identified in PostHog | `src/routes/(marketing)/login/sign_in/+page.svelte` |
| `sign_up_page_viewed` | User visits the sign-up page (top of registration funnel) | `src/routes/(marketing)/login/sign_up/+page.svelte` |
| `pricing_page_viewed` | User views the pricing page (top of subscription funnel) | `src/routes/(marketing)/pricing/+page.svelte` |
| `contact_form_submitted` | User submits the contact form successfully | `src/routes/(marketing)/contact_us/+page.server.ts` |
| `subscription_checkout_started` | User initiates a Stripe checkout session | `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` |
| `billing_portal_accessed` | User is redirected to the Stripe billing portal | `src/routes/(admin)/account/(menu)/billing/manage/+page.server.ts` |
| `user_signed_out` | User signs out of their account | `src/routes/(admin)/account/api/+page.server.ts` |
| `account_deleted` | User permanently deletes their account | `src/routes/(admin)/account/api/+page.server.ts` |
| `profile_completed` | User creates their profile for the first time | `src/routes/(admin)/account/api/+page.server.ts` |
| `profile_updated` | User updates their existing profile | `src/routes/(admin)/account/api/+page.server.ts` |
| `password_changed` | User successfully changes their password | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_changed` | User requests an email address change | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_subscription_toggled` | User toggles their email marketing subscription | `src/routes/(admin)/account/api/+page.server.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard:** https://us.posthog.com/project/483112/dashboard/1751155
- **Sign Up Funnel** (`sign_up_page_viewed` → `user_signed_in`): https://us.posthog.com/project/483112/insights/qH9ZDOeg
- **Subscription Conversion Funnel** (`pricing_page_viewed` → `subscription_checkout_started`): https://us.posthog.com/project/483112/insights/TyRRtR2H
- **Daily Active Users (Sign-ins):** https://us.posthog.com/project/483112/insights/NPuU9b5Z
- **Churn Events** (`account_deleted` + `user_signed_out`): https://us.posthog.com/project/483112/insights/bt6Oouzm
- **Contact Form Submissions:** https://us.posthog.com/project/483112/insights/AYuOqtio

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the current `identify` call runs on `SIGNED_IN` auth state change, which fires on every page load when a session cookie is present, so returning sessions should be covered; verify this holds in your Supabase auth configuration.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
