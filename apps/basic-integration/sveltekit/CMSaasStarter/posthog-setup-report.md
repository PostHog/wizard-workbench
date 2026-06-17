<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this SvelteKit SaaS starter. The integration covers client-side initialization with session replay support, a reverse proxy to avoid ad blockers, server-side event tracking via the Node.js SDK, user identification on sign-in and sign-up, and error tracking on both client and server. Twelve business-critical events are now tracked across the authentication funnel, onboarding, billing, and account management flows.

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signs in via email/password or OAuth | `src/routes/(marketing)/login/sign_in/+page.svelte` |
| `user_signed_up` | User completes sign-up flow | `src/routes/(marketing)/login/sign_up/+page.svelte` |
| `user_signed_out` | User signs out of their account | `src/routes/(admin)/account/sign_out/+page.svelte` |
| `profile_created` | User completes their profile for the first time (onboarding completion) | `src/routes/(admin)/account/api/+page.server.ts` |
| `profile_updated` | Existing user updates their profile | `src/routes/(admin)/account/api/+page.server.ts` |
| `subscription_checkout_started` | User is redirected to Stripe checkout | `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` |
| `subscription_management_opened` | User opens the Stripe billing portal (churn signal) | `src/routes/(admin)/account/(menu)/billing/manage/+page.server.ts` |
| `contact_form_submitted` | User submits the contact us form | `src/routes/(marketing)/contact_us/+page.server.ts` |
| `account_deleted` | User deletes their account (churn event) | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_updated` | User initiates an email address change | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_subscription_changed` | User toggles marketing email preference | `src/routes/(admin)/account/api/+page.server.ts` |
| `plan_selected` | User clicks a plan CTA on the pricing module | `src/routes/(marketing)/pricing/pricing_module.svelte` |

## Infrastructure changes

| File | Change |
|---|---|
| `src/hooks.client.ts` | New — PostHog browser init (`/ingest` proxy, session replay, error capture) |
| `src/hooks.server.ts` | Added reverse proxy for `/ingest`, `handleError` with server-side error capture |
| `src/lib/server/posthog.ts` | New — PostHog Node.js singleton for server-side event capture |
| `svelte.config.js` | Added `paths.relative: false` (required for session replay with SSR) |
| `.env` | Added `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` |

## Next steps

The API key used by the wizard lacked `dashboard:write` and `query:read` scopes, so the dashboard could not be created automatically. Create the following insights manually in PostHog and add them to a new dashboard named **"Analytics basics (wizard)"**:

1. **Sign-up → Subscription funnel** — [New funnel insight](https://us.posthog.com/project/2/insights/new) with steps: `user_signed_up` → `profile_created` → `plan_selected` → `subscription_checkout_started`
2. **Authentication trends** — [New trends insight](https://us.posthog.com/project/2/insights/new) showing `user_signed_in` and `user_signed_up` over time
3. **Churn indicators** — [New trends insight](https://us.posthog.com/project/2/insights/new) tracking `account_deleted` and `subscription_management_opened`
4. **Subscription activity** — [New trends insight](https://us.posthog.com/project/2/insights/new) for `subscription_checkout_started`
5. **Lead generation** — [New trends insight](https://us.posthog.com/project/2/insights/new) for `contact_form_submitted` and `plan_selected`

[View all dashboards](https://us.posthog.com/project/2/dashboard) · [Create new dashboard](https://us.posthog.com/project/2/dashboard)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — currently `identify` is called on the sign-in and sign-up pages via Supabase `onAuthStateChange`. Verify that users who return to an already-authenticated session (e.g., reloading the app while logged in) also get identified. Consider calling `posthog.identify` in the account layout's `onMount` using the session user ID from `data.user`.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
