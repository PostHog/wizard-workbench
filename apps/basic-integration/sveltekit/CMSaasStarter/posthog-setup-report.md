<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this SvelteKit SaaS starter. PostHog is initialized client-side in `src/hooks.client.ts` using the `init()` hook, which runs once on app start. A reverse proxy through `/ingest` is wired up in `src/hooks.server.ts` to route PostHog traffic and avoid ad blockers. A server-side PostHog singleton lives in `src/lib/server/posthog.ts` for use in SvelteKit server actions and load functions. `svelte.config.js` was updated with `paths.relative: false` to ensure session replay works correctly with SSR. Client-side error tracking is enabled via `capture_exceptions: true` and the `handleError` hook. Server-side errors are captured via the `handleError` export in `hooks.server.ts`. User identification is performed at sign-in using `posthog.identify()` with the Supabase user ID.

| Event | Description | File |
|---|---|---|
| `user_signed_in` | Fired on the client when a user successfully signs in via Supabase auth state change. | `src/routes/(marketing)/login/sign_in/+page.svelte` |
| `profile_created` | Fired server-side when a user creates their profile for the first time after registration. | `src/routes/(admin)/account/api/+page.server.ts` |
| `profile_updated` | Fired server-side when a user updates their existing profile information. | `src/routes/(admin)/account/api/+page.server.ts` |
| `checkout_initiated` | Fired server-side when a Stripe checkout session is created for a subscription plan. | `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` |
| `contact_us_submitted` | Fired server-side when a visitor successfully submits the contact form. | `src/routes/(marketing)/contact_us/+page.server.ts` |
| `account_deleted` | Fired server-side when a user permanently deletes their account. | `src/routes/(admin)/account/api/+page.server.ts` |
| `password_updated` | Fired server-side when a user successfully updates their account password. | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_update_requested` | Fired server-side when a user requests an email address change. | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_subscription_toggled` | Fired server-side when a user subscribes or unsubscribes from marketing emails. | `src/routes/(admin)/account/api/+page.server.ts` |
| `pricing_plan_viewed` | Fired client-side when an authenticated user without an active subscription views the plan selection page. | `src/routes/(admin)/account/(menu)/billing/+page.svelte` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1775182)
- [Subscription Conversion Funnel](https://us.posthog.com/project/483112/insights/p2SsayEl)
- [User Sign-ins Over Time](https://us.posthog.com/project/483112/insights/hcvI1lps)
- [New User Signups Over Time](https://us.posthog.com/project/483112/insights/gYLp8TKi)
- [Account Deletions Over Time (Churn)](https://us.posthog.com/project/483112/insights/PZKEQLvd)
- [Checkout Initiated by Plan](https://us.posthog.com/project/483112/insights/JhjmcPN0)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
