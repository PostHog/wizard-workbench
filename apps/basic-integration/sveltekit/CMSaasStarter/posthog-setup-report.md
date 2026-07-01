# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this SvelteKit SaaS starter. The integration covers client-side initialization with a reverse proxy (to avoid ad-blockers), server-side event tracking via `posthog-node`, user identification at sign-in, client-side error capture, and server-side error capture. Business-critical events span the full user lifecycle: authentication, subscription/billing, profile management, and churn.

## Changes made

### New files
| File | Purpose |
|------|---------|
| `src/hooks.client.ts` | Initializes PostHog on the client, sets up reverse proxy via `/ingest`, enables `capture_exceptions` |
| `src/lib/server/posthog.ts` | Singleton `posthog-node` client used by all server-side code |

### Modified files
| File | Changes |
|------|---------|
| `src/hooks.server.ts` | Added `/ingest` reverse proxy handler, added `handleError` for server-side error capture, added `getPostHogClient` import |
| `svelte.config.js` | Added `paths.relative: false` required for session replay with SSR |
| `src/routes/(marketing)/login/sign_in/+page.svelte` | `posthog.identify()` + `sign_in` capture on `SIGNED_IN` auth state change |
| `src/routes/(admin)/account/sign_out/+page.svelte` | `sign_out` capture + `posthog.reset()` on successful sign-out |
| `src/routes/(marketing)/pricing/+page.svelte` | `pricing_viewed` capture in `onMount` |
| `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` | `checkout_started` server-side capture before Stripe redirect |
| `src/routes/(admin)/account/(menu)/billing/manage/+page.server.ts` | `billing_portal_opened` server-side capture before portal redirect |
| `src/routes/(marketing)/contact_us/+page.server.ts` | `contact_form_submitted` server-side capture after successful save |
| `src/routes/(admin)/account/api/+page.server.ts` | `profile_created`, `profile_updated`, `email_subscription_toggled`, `password_changed`, `email_changed`, `account_deleted` server-side captures |

## Events instrumented

| Event name | Description | File |
|-----------|-------------|------|
| `sign_in` | User successfully signs in via the sign-in page | `src/routes/(marketing)/login/sign_in/+page.svelte` |
| `sign_out` | User initiates sign-out from the account sign-out page | `src/routes/(admin)/account/sign_out/+page.svelte` |
| `checkout_started` | User is redirected to Stripe checkout to subscribe to a plan | `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` |
| `billing_portal_opened` | User is redirected to the Stripe billing portal to manage their subscription | `src/routes/(admin)/account/(menu)/billing/manage/+page.server.ts` |
| `contact_form_submitted` | User successfully submits the contact-us form | `src/routes/(marketing)/contact_us/+page.server.ts` |
| `profile_created` | User creates their profile for the first time after signing up | `src/routes/(admin)/account/api/+page.server.ts` |
| `profile_updated` | User updates their existing profile details | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_subscription_toggled` | User subscribes or unsubscribes from marketing emails | `src/routes/(admin)/account/api/+page.server.ts` |
| `password_changed` | User successfully changes their account password | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_changed` | User initiates an email address change on their account | `src/routes/(admin)/account/api/+page.server.ts` |
| `account_deleted` | User successfully deletes their account | `src/routes/(admin)/account/api/+page.server.ts` |
| `pricing_viewed` | User views the public pricing page, the top of the conversion funnel | `src/routes/(marketing)/pricing/+page.svelte` |
| `server_error` | Server-side unhandled error captured | `src/hooks.server.ts` |

## Next steps

We've built a dashboard and five insights to monitor user behaviour based on the instrumented events:

- **Dashboard**: [Analytics basics (wizard)](https://us.i.posthog.com/project/483112/dashboard/1787536)
  - Conversion funnel: Pricing to Checkout
  - Sign ins over time
  - Subscriptions started
  - Account churn
  - Contact form submissions

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the current implementation only identifies on fresh login; returning sessions loaded from `localStorage` or cookies will be anonymous until the user signs in again.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-sveltekit/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
