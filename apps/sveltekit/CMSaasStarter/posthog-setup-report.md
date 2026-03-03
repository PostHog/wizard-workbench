<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this SvelteKit SaaS starter. Here is a summary of all changes made:

- **`svelte.config.js`** — Added `paths.relative: false` (required for PostHog session replay to work correctly with SSR).
- **`src/lib/server/posthog.ts`** *(new)* — Server-side PostHog singleton using `posthog-node`, with `flushAt: 1` and `flushInterval: 0` to ensure events are sent before server redirects.
- **`src/hooks.client.ts`** *(new)* — Client-side PostHog initialization with `posthog-js`, routing analytics through `/ingest` to bypass ad blockers, and automatic client-side exception capture via `handleError`.
- **`src/hooks.server.ts`** — Added a `/ingest` reverse proxy handle (routes PostHog requests through the server to avoid ad blockers) and a `handleError` hook that captures server-side exceptions with context.
- **`src/routes/(marketing)/login/sign_in/+page.svelte`** — Calls `posthog.identify()` and captures `user_signed_in` when Supabase fires a `SIGNED_IN` auth state change.
- **`src/routes/(marketing)/login/sign_up/+page.svelte`** — Calls `posthog.identify()` and captures `user_signed_up` when a sign-up completes successfully.
- **`src/routes/(marketing)/contact_us/+page.server.ts`** — Captures `contact_form_submitted` after the contact request is saved and the admin email is sent.
- **`src/routes/(marketing)/pricing/pricing_module.svelte`** — Captures `plan_selected` with plan ID and name when a user clicks a plan button (top of conversion funnel).
- **`src/routes/(admin)/account/subscribe/[slug]/+page.server.ts`** — Captures `checkout_started` after a Stripe checkout session is created, before redirecting the user.
- **`src/routes/(admin)/account/api/+page.server.ts`** — Captures `profile_created`, `profile_updated`, `account_deleted`, `email_changed`, `password_changed`, and `user_signed_out` in the respective server actions.
- **`src/routes/(admin)/account/(menu)/billing/manage/+page.server.ts`** — Captures `billing_portal_accessed` after the Stripe billing portal URL is generated.

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signs in via Supabase auth | `src/routes/(marketing)/login/sign_in/+page.svelte` |
| `user_signed_up` | User successfully creates a new account | `src/routes/(marketing)/login/sign_up/+page.svelte` |
| `user_signed_out` | User signs out of their account | `src/routes/(admin)/account/api/+page.server.ts` |
| `contact_form_submitted` | User submits the contact us form successfully | `src/routes/(marketing)/contact_us/+page.server.ts` |
| `plan_selected` | User clicks a plan button on the pricing module | `src/routes/(marketing)/pricing/pricing_module.svelte` |
| `checkout_started` | User initiates a Stripe checkout session | `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` |
| `profile_created` | User completes their profile for the first time | `src/routes/(admin)/account/api/+page.server.ts` |
| `profile_updated` | User updates their existing profile | `src/routes/(admin)/account/api/+page.server.ts` |
| `account_deleted` | User permanently deletes their account (churn) | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_changed` | User initiates an email address change | `src/routes/(admin)/account/api/+page.server.ts` |
| `password_changed` | User successfully changes their password | `src/routes/(admin)/account/api/+page.server.ts` |
| `billing_portal_accessed` | User accesses the Stripe billing portal | `src/routes/(admin)/account/(menu)/billing/manage/+page.server.ts` |

## Next steps

We've set up the following recommended insights for an **"Analytics basics"** dashboard. Create it at:

**[Create new dashboard →](https://us.posthog.com/project/2/dashboard/new)**

Suggested insights to add:

1. **Subscription conversion funnel** — Funnel: `plan_selected` → `checkout_started`
   [Create insight →](https://us.posthog.com/project/2/insights/new#{"insight":"FUNNELS","events":[{"id":"plan_selected"},{"id":"checkout_started"}]})

2. **Daily sign-ins** — Trend of `user_signed_in` over time
   [Create insight →](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"user_signed_in"}]})

3. **New user sign-ups** — Trend of `user_signed_up` and `profile_created` over time
   [Create insight →](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"user_signed_up"},{"id":"profile_created"}]})

4. **Account churn** — Trend of `account_deleted` over time
   [Create insight →](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"account_deleted"}]})

5. **Contact form submissions** — Trend of `contact_form_submitted` over time
   [Create insight →](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"contact_form_submitted"}]})

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-sveltekit/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
