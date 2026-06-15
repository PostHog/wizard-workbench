# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this SvelteKit SaaS starter. The following changes were made:

- **`src/hooks.client.ts`** (new) — initializes `posthog-js` via the `init()` hook with a reverse proxy at `/ingest`, and captures client-side exceptions via `handleError`.
- **`src/hooks.server.ts`** — added a `posthogProxy` handle that proxies `/ingest` and `/ingest/static|array` requests to PostHog's ingestion servers (ad-blocker bypass), and added `handleError` to capture server-side errors with PostHog.
- **`src/lib/server/posthog.ts`** (new) — singleton `getPostHogClient()` for server-side event capture via `posthog-node`.
- **`svelte.config.js`** — added `paths.relative: false` required for session replay to work correctly with SSR.
- **`src/routes/(marketing)/login/sign_in/+page.svelte`** — calls `posthog.identify()` and captures `user_signed_in` when Supabase fires `SIGNED_IN`.
- **`src/routes/(admin)/account/sign_out/+page.svelte`** — captures `user_signed_out` and calls `posthog.reset()` on sign-out.
- **`src/routes/(admin)/account/api/+page.server.ts`** — server-side capture of `profile_updated`, `account_deleted`, `password_changed`, `email_change_requested`, `email_subscription_toggled`.
- **`src/routes/(admin)/account/subscribe/[slug]/+page.server.ts`** — server-side capture of `subscription_checkout_started` when a Stripe checkout session is created.
- **`src/routes/(admin)/account/(menu)/billing/manage/+page.server.ts`** — server-side capture of `billing_portal_opened` when the Stripe billing portal session is created.
- **`src/routes/(marketing)/contact_us/+page.server.ts`** — server-side capture of `contact_form_submitted` on successful contact form submission.

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signs in; also calls `posthog.identify()` | `src/routes/(marketing)/login/sign_in/+page.svelte` |
| `user_signed_out` | User signs out; also calls `posthog.reset()` | `src/routes/(admin)/account/sign_out/+page.svelte` |
| `subscription_checkout_started` | Stripe checkout session created for a subscription plan | `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` |
| `contact_form_submitted` | Contact form saved and admin notified | `src/routes/(marketing)/contact_us/+page.server.ts` |
| `profile_updated` | User updates their profile (name, company, website) | `src/routes/(admin)/account/api/+page.server.ts` |
| `account_deleted` | User deletes their account | `src/routes/(admin)/account/api/+page.server.ts` |
| `password_changed` | User successfully changes their password | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_change_requested` | User requests an email address change | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_subscription_toggled` | User toggles marketing email subscription on/off | `src/routes/(admin)/account/api/+page.server.ts` |
| `billing_portal_opened` | User is redirected to the Stripe billing portal | `src/routes/(admin)/account/(menu)/billing/manage/+page.server.ts` |

## Next steps

The PostHog MCP API key lacked the scopes required to auto-create the dashboard (`dashboard:write`, `insight:write`, `query:read`). Create the **"Analytics basics (wizard)"** dashboard manually at:

[PostHog Dashboards → New dashboard](https://us.posthog.com/project/2/dashboard)

Recommended insights to add (use "Trends" chart type for each unless noted):

1. **Sign-ins over time** — trend of `user_signed_in` events
2. **Subscription checkout funnel** — funnel: `user_signed_in` → `subscription_checkout_started` (conversion funnel insight)
3. **Churn signals** — trend of `account_deleted` + `email_subscription_toggled` (unsubscribed=true) on same chart
4. **Contact form submissions** — trend of `contact_form_submitted`
5. **Profile & account activity** — trend of `profile_updated`, `password_changed`, `email_change_requested` on same chart

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` (and any monorepo bootstrap scripts) so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the current implementation identifies on `SIGNED_IN` (fresh login). If users return with an active Supabase session, add a matching `posthog.identify()` call in the auth layout or session restore path so returning sessions aren't left on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-sveltekit/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
