<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CMSaasStarter SvelteKit application. Changes include: client-side PostHog initialization with error capture, a server-side PostHog singleton, a reverse proxy through `/ingest` to avoid ad blockers, user identification on sign-in and sign-up, and event capture across authentication, profile, billing, and contact flows.

| Event name | Description | File |
|---|---|---|
| `user_signed_in` | Fires when a user successfully signs in via Supabase auth | `src/routes/(marketing)/login/sign_in/+page.svelte` |
| `user_signed_up` | Fires when a user successfully creates a new account via Supabase auth | `src/routes/(marketing)/login/sign_up/+page.svelte` |
| `user_signed_out` | Fires when a user signs out of their account | `src/routes/(admin)/account/sign_out/+page.svelte` |
| `profile_created` | Fires on the server when a user creates their profile for the first time | `src/routes/(admin)/account/api/+page.server.ts` |
| `profile_updated` | Fires on the server when a user updates their existing profile | `src/routes/(admin)/account/api/+page.server.ts` |
| `subscription_checkout_started` | Fires on the server when a user initiates a Stripe checkout session | `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` |
| `contact_form_submitted` | Fires on the server when a user successfully submits the contact form | `src/routes/(marketing)/contact_us/+page.server.ts` |
| `password_changed` | Fires on the server when a user successfully changes their password | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_change_requested` | Fires on the server when a user requests an email address change | `src/routes/(admin)/account/api/+page.server.ts` |
| `account_deleted` | Fires on the server when a user deletes their account | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_subscription_toggled` | Fires on the server when a user toggles their email subscription preference | `src/routes/(admin)/account/api/+page.server.ts` |
| `billing_portal_accessed` | Fires on the server when a user opens the Stripe billing portal | `src/routes/(admin)/account/(menu)/billing/manage/+page.server.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1818284)
- [New signups & logins](https://us.posthog.com/project/483112/insights/oCZjCE8w)
- [Signup to subscription funnel](https://us.posthog.com/project/483112/insights/w3FMoBIU)
- [Subscription checkouts by plan](https://us.posthog.com/project/483112/insights/JeLawQyP)
- [Account deletions (churn)](https://us.posthog.com/project/483112/insights/DC1fTTtl)
- [User retention after signup](https://us.posthog.com/project/483112/insights/q7VLa4s3)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — currently `identify` is only called on fresh sign-in/sign-up events; returning users who are already logged in (e.g. after a page refresh) are not re-identified. Consider calling `posthog.identify` from the account layout server load when a session is present.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
