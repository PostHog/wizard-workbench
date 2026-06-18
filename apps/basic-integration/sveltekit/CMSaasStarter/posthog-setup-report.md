# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this SvelteKit SaaS starter project. The integration covers client-side initialization with session replay and error tracking, a server-side singleton for backend event capture, a reverse proxy to avoid ad blockers, user identification on sign-in, and 12 business-critical events across the entire user journey — from pricing page views through subscription checkout to account deletion.

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `pricing_page_viewed` | User views the pricing page, marking the top of the subscription conversion funnel. | `src/routes/(marketing)/pricing/+page.svelte` |
| `plan_selected` | User clicks a call-to-action button to select a pricing plan. | `src/routes/(marketing)/pricing/pricing_module.svelte` |
| `contact_form_submitted` | User successfully submits the contact us form, indicating a lead. | `src/routes/(marketing)/contact_us/+page.server.ts` |
| `user_signed_in` | User successfully signs in and PostHog identity is linked to their account. | `src/routes/(marketing)/login/sign_in/+page.svelte` |
| `profile_created` | User completes onboarding by creating their profile for the first time. | `src/routes/(admin)/account/api/+page.server.ts` |
| `profile_updated` | User updates their existing profile information. | `src/routes/(admin)/account/api/+page.server.ts` |
| `subscription_checkout_started` | User initiates a Stripe checkout session to subscribe to a paid plan. | `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` |
| `billing_portal_opened` | User opens the Stripe billing portal to manage or cancel their subscription. | `src/routes/(admin)/account/(menu)/billing/manage/+page.server.ts` |
| `account_deleted` | User successfully deletes their account, representing churn. | `src/routes/(admin)/account/api/+page.server.ts` |
| `password_changed` | User successfully changes their account password. | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_changed` | User successfully requests an email address change. | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_subscription_toggled` | User changes their email marketing subscription preference. | `src/routes/(admin)/account/api/+page.server.ts` |

## Files created or modified

- **Created** `src/hooks.client.ts` — PostHog initialization, `capture_exceptions: true`, client-side `handleError`
- **Created** `src/lib/server/posthog.ts` — server-side PostHog singleton
- **Modified** `src/hooks.server.ts` — added `/ingest` reverse proxy handler and server-side `handleError`
- **Modified** `svelte.config.js` — set `paths.relative: false` for session replay compatibility
- **Modified** `src/routes/(marketing)/login/sign_in/+page.svelte` — `posthog.identify()` + `user_signed_in` on auth state change
- **Modified** `src/routes/(marketing)/pricing/+page.svelte` — `pricing_page_viewed` on mount
- **Modified** `src/routes/(marketing)/pricing/pricing_module.svelte` — `plan_selected` on CTA click
- **Modified** `src/routes/(marketing)/contact_us/+page.server.ts` — `contact_form_submitted` after successful insert
- **Modified** `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` — `subscription_checkout_started` before Stripe redirect
- **Modified** `src/routes/(admin)/account/(menu)/billing/manage/+page.server.ts` — `billing_portal_opened` before portal redirect
- **Modified** `src/routes/(admin)/account/api/+page.server.ts` — `profile_created`, `profile_updated`, `account_deleted`, `password_changed`, `email_changed`, `email_subscription_toggled`

## Next steps

Create a dashboard named **"Analytics basics (wizard)"** in PostHog to monitor key metrics. Suggested insights:

1. **Subscription conversion funnel** — `pricing_page_viewed` → `plan_selected` → `subscription_checkout_started`
2. **Sign-ins over time** — trend of `user_signed_in`
3. **Profile creation rate** — trend of `profile_created` (onboarding completion)
4. **Billing portal opens** — trend of `billing_portal_opened` (churn signal)
5. **Account deletions** — trend of `account_deleted`

[Create the dashboard here](https://us.posthog.com/project/2/dashboard)
[Create a new insight](https://us.posthog.com/project/2/insights/new)

## Verify before merging

- [ ] Run a full production build (`npm run build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — currently `identify` only fires on fresh sign-in via `onAuthStateChange`. Consider adding an `identify` call in the admin layout when a session already exists on page load.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-sveltekit/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
