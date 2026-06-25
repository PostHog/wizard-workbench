<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this SvelteKit SaaS starter. The integration includes client-side initialization with session replay support, a reverse proxy to avoid ad blockers, server-side event tracking for critical business actions, user identification on sign-in, and error tracking on both client and server.

**Files created:**
- `src/hooks.client.ts` — PostHog client-side init (`posthog.init`) with error capture (`handleError`)
- `src/lib/server/posthog.ts` — Server-side PostHog singleton using `posthog-node`

**Files modified:**
- `src/hooks.server.ts` — Added `/ingest` reverse proxy handler and server-side `handleError` for error tracking
- `svelte.config.js` — Added `paths.relative: false` (required for session replay with SSR)
- `src/routes/(marketing)/login/sign_in/+page.svelte` — Identify user and capture `user_signed_in` on auth state change
- `src/routes/(admin)/account/sign_out/+page.svelte` — Capture `user_signed_out` and call `posthog.reset()`
- `src/routes/(marketing)/pricing/+page.svelte` — Capture `pricing_page_viewed` on mount (top of conversion funnel)
- `src/routes/(marketing)/contact_us/+page.svelte` — Capture `contact_form_submitted` on successful form submission
- `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` — Capture `subscription_checkout_started` server-side before Stripe redirect
- `src/routes/(admin)/account/(menu)/billing/manage/+page.server.ts` — Capture `billing_portal_opened` server-side
- `src/routes/(admin)/account/api/+page.server.ts` — Capture `profile_created`, `profile_updated`, `account_deleted`, `email_changed`, `password_changed`, and `email_subscription_toggled` server-side

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signs in via Supabase auth | `src/routes/(marketing)/login/sign_in/+page.svelte` |
| `user_signed_out` | User signs out of their account | `src/routes/(admin)/account/sign_out/+page.svelte` |
| `pricing_page_viewed` | User views the marketing pricing page (top of conversion funnel) | `src/routes/(marketing)/pricing/+page.svelte` |
| `contact_form_submitted` | User submits the contact us form successfully | `src/routes/(marketing)/contact_us/+page.svelte` |
| `subscription_checkout_started` | User initiates a Stripe checkout session to subscribe to a plan | `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` |
| `billing_portal_opened` | User opens the Stripe billing portal to manage their subscription | `src/routes/(admin)/account/(menu)/billing/manage/+page.server.ts` |
| `profile_created` | User creates their profile for the first time after signing up | `src/routes/(admin)/account/api/+page.server.ts` |
| `profile_updated` | User updates their existing profile information | `src/routes/(admin)/account/api/+page.server.ts` |
| `account_deleted` | User permanently deletes their account | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_changed` | User initiates an email address change | `src/routes/(admin)/account/api/+page.server.ts` |
| `password_changed` | User successfully changes their account password | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_subscription_toggled` | User toggles their email marketing subscription status | `src/routes/(admin)/account/api/+page.server.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.i.posthog.com/project/483112/dashboard/1760790)
  - Daily Active Users (sign-ins over time)
  - Conversion Funnel: Pricing → Checkout → Sign-in
  - Subscription Checkout Started (Revenue Interest)
  - Account Deletions (Churn Signal)
  - Contact Form Submissions (Lead Generation)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
