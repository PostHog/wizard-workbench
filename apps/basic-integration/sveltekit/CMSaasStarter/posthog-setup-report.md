<wizard-report>
# PostHog post-wizard report

The wizard completed a PostHog integration for this SvelteKit app across both browser and server paths. It installed `posthog-js` and `posthog-node`, added client initialization in a shared helper and the root layout, added a SvelteKit `/ingest` reverse proxy plus server-side exception capture in `src/hooks.server.ts`, created a reusable server PostHog client, instrumented authentication, onboarding, contact, billing, and search flows, and configured `PUBLIC_POSTHOG_PROJECT_TOKEN` / `PUBLIC_POSTHOG_HOST` in `.env`. It also updated `svelte.config.js` to set `paths.relative = false` for replay compatibility and created a PostHog dashboard with five insights.

| Event name | Description | File |
| --- | --- | --- |
| `auth_sign_in_succeeded` | Captures successful sign-in completion from the hosted auth flow. | `src/routes/(marketing)/login/sign_in/+page.svelte` |
| `auth_sign_up_viewed` | Captures when the sign-up experience is shown as a top-of-funnel conversion step. | `src/routes/(marketing)/login/sign_up/+page.svelte` |
| `auth_callback_completed` | Captures successful auth callback exchanges on the server after session creation. | `src/routes/(marketing)/auth/callback/+server.js` |
| `auth_signed_out` | Captures sign-out actions from authenticated account navigation and auth state changes. | `src/routes/(admin)/account/(menu)/+layout.svelte`, `src/routes/(admin)/account/+layout.svelte` |
| `contact_request_submitted` | Captures successful contact form submissions after validation and persistence complete. | `src/routes/(marketing)/contact_us/+page.server.ts` |
| `profile_created` | Captures first-time profile completion during onboarding. | `src/routes/(admin)/account/api/+page.server.ts` |
| `profile_updated` | Captures subsequent profile updates from account settings. | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_subscription_toggled` | Captures when a signed-in user changes email subscription status. | `src/routes/(admin)/account/api/+page.server.ts` |
| `checkout_started` | Captures when a signed-in user starts a Stripe checkout flow for a plan. | `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` |
| `billing_portal_opened` | Captures when a signed-in customer opens the Stripe billing portal. | `src/routes/(admin)/account/(menu)/billing/manage/+page.server.ts` |
| `search_used` | Captures when a visitor performs a search and sees matching results. | `src/routes/(marketing)/search/+page.svelte` |
| `$exception` | Captures server-side exceptions through the global SvelteKit error handler. | `src/hooks.server.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: https://us.posthog.com/project/483112/dashboard/1825446
- Insight: Auth sign-ins (wizard) — https://us.posthog.com/project/483112/insights/xPuynETH
- Insight: Onboarding conversion (wizard) — https://us.posthog.com/project/483112/insights/POPtLm49
- Insight: Billing flow starts (wizard) — https://us.posthog.com/project/483112/insights/LVAgvJVF
- Insight: Contact requests (wizard) — https://us.posthog.com/project/483112/insights/N7CJmXEX
- Insight: Search engagement (wizard) — https://us.posthog.com/project/483112/insights/IQovQKA2

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
