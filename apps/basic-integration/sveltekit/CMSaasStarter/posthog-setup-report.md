<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into CMSaasStarter, a SvelteKit SaaS boilerplate backed by Supabase and Stripe. The integration covers client-side initialization with session replay, a reverse proxy to avoid ad blockers, server-side error tracking, user identification on sign-in and sign-out, and event capture across all key business flows — authentication, billing, profile management, and contact.

**Files created:**
- `src/hooks.client.ts` — initializes `posthog-js` via the SvelteKit `init()` hook, wires up client-side `handleError` for exception capture
- `src/lib/server/posthog.ts` — singleton `getPostHogClient()` for the `posthog-node` server-side SDK

**Files modified:**
- `svelte.config.js` — added `paths.relative: false` required for session replay with SSR
- `src/hooks.server.ts` — added `posthogProxy` handle (reverse proxy at `/ingest`) and `handleError` for server-side exception capture; `posthogProxy` runs before Supabase in the handle sequence
- `src/routes/(marketing)/login/sign_in/+page.svelte` — calls `posthog.identify()` and captures `user_signed_in` on Supabase `SIGNED_IN` auth state change
- `src/routes/(admin)/account/sign_out/+page.svelte` — captures `user_signed_out` then calls `posthog.reset()` before redirecting
- `src/routes/(marketing)/pricing/pricing_module.svelte` — captures `plan_selected` with `plan_id` and `plan_name` when a plan CTA is clicked
- `src/routes/(admin)/account/api/+page.server.ts` — server-side capture for `profile_created`, `profile_updated`, `email_update_initiated`, `password_updated`, `account_deleted`, `email_subscription_toggled`
- `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` — captures `checkout_session_created` with `plan_price_id` after Stripe checkout session is created
- `src/routes/(admin)/account/(menu)/billing/manage/+page.server.ts` — captures `billing_portal_opened` after Stripe billing portal session is created
- `src/routes/(marketing)/contact_us/+page.server.ts` — captures `contact_form_submitted` with `has_company` and `has_phone` after successful form submission

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signed in via email/password or OAuth. | `src/routes/(marketing)/login/sign_in/+page.svelte` |
| `user_signed_out` | User successfully signed out of their account. | `src/routes/(admin)/account/sign_out/+page.svelte` |
| `profile_created` | User submitted their profile for the first time after signing up. | `src/routes/(admin)/account/api/+page.server.ts` |
| `profile_updated` | User updated their existing profile information. | `src/routes/(admin)/account/api/+page.server.ts` |
| `checkout_session_created` | User initiated a Stripe checkout session to subscribe to a paid plan. | `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` |
| `billing_portal_opened` | User opened the Stripe billing portal to manage their subscription. | `src/routes/(admin)/account/(menu)/billing/manage/+page.server.ts` |
| `plan_selected` | User clicked on a plan CTA button on the pricing module. | `src/routes/(marketing)/pricing/pricing_module.svelte` |
| `contact_form_submitted` | User successfully submitted the contact us form. | `src/routes/(marketing)/contact_us/+page.server.ts` |
| `password_updated` | User successfully changed their account password. | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_update_initiated` | User requested an email address change, triggering confirmation emails. | `src/routes/(admin)/account/api/+page.server.ts` |
| `account_deleted` | User permanently deleted their account. | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_subscription_toggled` | User toggled their email marketing subscription preference. | `src/routes/(admin)/account/api/+page.server.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1818349)
- [User sign-ins over time (wizard)](https://us.posthog.com/project/483112/insights/mtAnBwbQ)
- [Plan selection to checkout funnel (wizard)](https://us.posthog.com/project/483112/insights/PR4LEKKJ)
- [Account churn events (wizard)](https://us.posthog.com/project/483112/insights/ZXKFRetG)
- [New profiles created over time (wizard)](https://us.posthog.com/project/483112/insights/0Yrqnihu)
- [Billing engagement (wizard)](https://us.posthog.com/project/483112/insights/hRLfmDyM)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — currently `identify` is only called on fresh login via `SIGNED_IN`; add a call in the root layout's `onMount` when a Supabase session already exists on load so returning sessions are also identified.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-sveltekit/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
</wizard-report>
