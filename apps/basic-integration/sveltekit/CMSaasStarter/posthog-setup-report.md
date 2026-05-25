<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this SvelteKit SaaS Starter project. The implementation covers client-side initialization with a reverse proxy (to bypass ad blockers), server-side event capture via `posthog-node`, user identification on login, error tracking in both client and server hooks, and `paths.relative: false` in `svelte.config.js` for session replay compatibility.

## Files created

- `src/hooks.client.ts` — Client-side PostHog initialization (reverse proxy, `capture_exceptions: true`) and `handleError` for automatic client error capture
- `src/lib/server/posthog.ts` — Server-side PostHog singleton (`posthog-node`) with `flushAt: 1` for per-request flushing
- `src/hooks.server.ts` — Extended with a `/ingest` reverse proxy handle and `handleError` for server-side error capture

## Files modified

- `svelte.config.js` — Added `paths.relative: false` (required for session replay with SSR)
- `src/routes/(marketing)/auth/callback/+server.js` — Server-side `user_signed_in` event after OAuth code exchange
- `src/routes/(admin)/account/+layout.svelte` — Client-side `posthog.identify()` whenever an authenticated session is present
- `src/routes/(admin)/account/sign_out/+page.svelte` — `user_signed_out` event + `posthog.reset()`
- `src/routes/(marketing)/contact_us/+page.server.ts` — `contact_form_submitted` server event
- `src/routes/(marketing)/pricing/pricing_module.svelte` — `plan_selected` client event on CTA click
- `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` — `subscription_checkout_started` server event before Stripe redirect
- `src/routes/(admin)/account/(menu)/billing/manage/+page.server.ts` — `billing_portal_opened` server event before Stripe portal redirect
- `src/routes/(admin)/account/api/+page.server.ts` — Five server events: `profile_updated`, `email_update_requested`, `password_changed`, `email_subscription_toggled`, `account_deleted`

## Event tracking table

| Event | Description | File |
|-------|-------------|------|
| `user_signed_in` | Fired server-side after Supabase OAuth code exchange | `src/routes/(marketing)/auth/callback/+server.js` |
| `user_signed_out` | Fired client-side after successful Supabase signOut | `src/routes/(admin)/account/sign_out/+page.svelte` |
| `contact_form_submitted` | Fired server-side after contact request saved to database | `src/routes/(marketing)/contact_us/+page.server.ts` |
| `plan_selected` | Fired client-side when user clicks a pricing plan CTA | `src/routes/(marketing)/pricing/pricing_module.svelte` |
| `subscription_checkout_started` | Fired server-side when Stripe checkout session is created | `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` |
| `billing_portal_opened` | Fired server-side when Stripe billing portal session is created | `src/routes/(admin)/account/(menu)/billing/manage/+page.server.ts` |
| `profile_updated` | Fired server-side after profile (name, company, website) is saved | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_update_requested` | Fired server-side after user requests email address change | `src/routes/(admin)/account/api/+page.server.ts` |
| `password_changed` | Fired server-side after password update | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_subscription_toggled` | Fired server-side when marketing email preference changes | `src/routes/(admin)/account/api/+page.server.ts` |
| `account_deleted` | Fired server-side after user account is permanently deleted | `src/routes/(admin)/account/api/+page.server.ts` |
| `server_error` | Fired server-side for all unhandled server errors | `src/hooks.server.ts` |

## Next steps

We've prepared an "Analytics basics" dashboard for you to create in PostHog with five key insights. Create each insight below, then [create a new dashboard](https://us.posthog.com/project/2/dashboard) named **Analytics basics** and pin them to it.

### Recommended insights

1. **User Sign-ins** — [Create trends insight](https://us.posthog.com/project/2/insights/new) — Trends chart for `user_signed_in`, grouped by day, to monitor daily active authentication activity.

2. **Subscription Conversion Funnel** — [Create funnel insight](https://us.posthog.com/project/2/insights/new) — Funnel with two steps: `plan_selected` → `subscription_checkout_started`. Shows conversion rate from plan browse to checkout initiation.

3. **Account Deletions (Churn)** — [Create trends insight](https://us.posthog.com/project/2/insights/new) — Trends chart for `account_deleted` over the last 30 days. A critical churn signal to monitor closely.

4. **Contact Form Submissions** — [Create trends insight](https://us.posthog.com/project/2/insights/new) — Trends chart for `contact_form_submitted` grouped by day, with breakdown by `company` to identify inbound interest.

5. **Profile Completions (New Users)** — [Create trends insight](https://us.posthog.com/project/2/insights/new) — Trends chart for `profile_updated` filtered by `is_new_profile = true`. Tracks new user onboarding completion.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-sveltekit/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
