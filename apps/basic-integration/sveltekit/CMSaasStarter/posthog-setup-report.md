<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this SvelteKit SaaS starter. The integration includes client-side initialization with session replay, a reverse proxy to avoid ad blockers, server-side event tracking for all critical business flows (auth, billing, profile management, and contact), user identification on sign-in, and error tracking on both the client and server.

**Files created:**
- `src/hooks.client.ts` — PostHog client init (`posthog.init`) with `/ingest` reverse proxy host, `defaults: '2026-01-30'`, `capture_exceptions: true`, and `handleError` for client-side error tracking
- `src/lib/server/posthog.ts` — Server-side PostHog singleton using `posthog-node`

**Files modified:**
- `src/hooks.server.ts` — Added `posthogProxy` handler for `/ingest` reverse proxy, `handleError` for server-side error capture, and wired both into the `sequence`
- `svelte.config.js` — Added `paths: { relative: false }` required for session replay with SSR
- `src/routes/(marketing)/login/sign_in/+page.svelte` — `posthog.identify()` + `user_signed_in` capture on Supabase `SIGNED_IN` auth state change
- `src/routes/(marketing)/pricing/pricing_module.svelte` — `pricing_plan_selected` capture on plan CTA click
- `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` — Server-side `subscription_checkout_started` after Stripe checkout session creation
- `src/routes/(admin)/account/(menu)/billing/manage/+page.server.ts` — Server-side `billing_portal_opened` after Stripe portal session creation
- `src/routes/(marketing)/contact_us/+page.server.ts` — Server-side `contact_us_submitted` after successful form save
- `src/routes/(admin)/account/api/+page.server.ts` — Server-side events for `profile_created`, `profile_updated`, `email_subscription_toggled`, `email_updated`, `password_updated`, `account_deleted`, and `user_signed_out`

| Event name | Description | File |
|---|---|---|
| `user_signed_in` | Fires when a user successfully authenticates and is redirected to their account. | `src/routes/(marketing)/login/sign_in/+page.svelte` |
| `pricing_plan_selected` | Fires when a user clicks the call-to-action button on a pricing plan card. | `src/routes/(marketing)/pricing/pricing_module.svelte` |
| `subscription_checkout_started` | Fires on the server when a Stripe checkout session is successfully created for a subscription. | `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` |
| `billing_portal_opened` | Fires on the server when a user is redirected to the Stripe billing portal. | `src/routes/(admin)/account/(menu)/billing/manage/+page.server.ts` |
| `contact_us_submitted` | Fires on the server when a contact form is successfully submitted and saved. | `src/routes/(marketing)/contact_us/+page.server.ts` |
| `profile_created` | Fires on the server when a user creates their profile for the first time. | `src/routes/(admin)/account/api/+page.server.ts` |
| `profile_updated` | Fires on the server when a user updates their existing profile information. | `src/routes/(admin)/account/api/+page.server.ts` |
| `account_deleted` | Fires on the server when a user successfully deletes their account. | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_updated` | Fires on the server when a user successfully initiates an email address change. | `src/routes/(admin)/account/api/+page.server.ts` |
| `password_updated` | Fires on the server when a user successfully changes their password. | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_subscription_toggled` | Fires on the server when a user toggles their email marketing subscription status. | `src/routes/(admin)/account/api/+page.server.ts` |
| `user_signed_out` | Fires on the server when a user signs out of their account. | `src/routes/(admin)/account/api/+page.server.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard:** [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1777470)
- [Pricing to Checkout Conversion Funnel](https://us.posthog.com/project/483112/insights/GoW6bGzS)
- [Sign-in and Sign-out Activity](https://us.posthog.com/project/483112/insights/FZhYdykw)
- [Profile Creation Rate](https://us.posthog.com/project/483112/insights/ZzD8RIx4)
- [Contact Form Submissions](https://us.posthog.com/project/483112/insights/Bhs9NLxb)
- [Account Deletion (Churn Signal)](https://us.posthog.com/project/483112/insights/DlsRvETI)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the current `identify` call fires on `SIGNED_IN` from the sign-in page, but a user navigating directly to `/account` on a returning session bypasses this. Consider adding `identify` in the root layout's `onMount` when a session is already present.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
