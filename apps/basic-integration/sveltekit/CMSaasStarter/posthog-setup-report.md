<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this SvelteKit SaaS starter. The integration covers client-side initialization with a reverse proxy (to bypass ad blockers), server-side event tracking via the PostHog Node SDK, user identification on login and signup, automatic error capture on both client and server, and 12 business-critical events across the authentication, billing, and user-management flows.

| Event name | Description | File |
|---|---|---|
| `user_signed_in` | Fires when a user successfully signs in via the Supabase auth UI. | `src/routes/(marketing)/login/sign_in/+page.svelte` |
| `user_signed_up` | Fires when a user successfully completes sign-up via the Supabase auth UI. | `src/routes/(marketing)/login/sign_up/+page.svelte` |
| `user_signed_out` | Fires when a user successfully signs out. | `src/routes/(admin)/account/sign_out/+page.svelte` |
| `profile_created` | Fires on the server when a user submits their profile for the first time. | `src/routes/(admin)/account/api/+page.server.ts` |
| `profile_updated` | Fires on the server when a user updates their existing profile. | `src/routes/(admin)/account/api/+page.server.ts` |
| `account_deleted` | Fires on the server when a user successfully deletes their account. | `src/routes/(admin)/account/api/+page.server.ts` |
| `subscription_checkout_started` | Fires on the server when a user is redirected to the Stripe checkout session for a plan. | `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` |
| `billing_portal_opened` | Fires on the server when a user is redirected to the Stripe billing portal to manage their subscription. | `src/routes/(admin)/account/(menu)/billing/manage/+page.server.ts` |
| `pricing_plan_selected` | Fires client-side when a user clicks on a pricing plan call-to-action button. | `src/routes/(marketing)/pricing/pricing_module.svelte` |
| `contact_form_submitted` | Fires on the server when a user successfully submits the contact form. | `src/routes/(marketing)/contact_us/+page.server.ts` |
| `password_changed` | Fires on the server when a user successfully changes their password. | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_change_requested` | Fires on the server when a user requests an email address change. | `src/routes/(admin)/account/api/+page.server.ts` |

Additional files created or modified:
- **`src/hooks.client.ts`** (new) — PostHog client-side initialization (`posthog.init`) with `/ingest` reverse proxy and `handleError` for automatic client error capture.
- **`src/hooks.server.ts`** (modified) — Added `/ingest` reverse proxy handler and `handleError` for server-side error capture via `posthog-node`.
- **`src/lib/server/posthog.ts`** (new) — Singleton `getPostHogClient()` for the server-side PostHog Node SDK.
- **`svelte.config.js`** (modified) — Added `paths.relative: false` required for PostHog session replay with SSR.

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1793566)
- [New sign-ups over time](https://us.posthog.com/project/483112/insights/MSTco85M)
- [Sign-in vs Sign-up trend](https://us.posthog.com/project/483112/insights/cqiPz7Fu)
- [Signup to subscription conversion funnel](https://us.posthog.com/project/483112/insights/XnrUpXvv)
- [Account deletions (churn)](https://us.posthog.com/project/483112/insights/9mVDaJm0)
- [Subscription & billing activity](https://us.posthog.com/project/483112/insights/e4I4luUd)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the current implementation identifies on sign-in and sign-up SIGNED_IN events, but a user who has an active Supabase session and navigates directly to `/account` without triggering `onAuthStateChange` will remain on an anonymous distinct ID until they sign in again.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
