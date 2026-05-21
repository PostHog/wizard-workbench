<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this SvelteKit SaaS starter project. Here is a summary of all changes made:

**New files created:**
- `src/hooks.client.ts` — Initializes PostHog client-side via the SvelteKit `init` hook, configures the `/ingest` reverse proxy, and registers a `handleError` hook to capture client-side exceptions automatically.
- `src/lib/server/posthog.ts` — Server-side PostHog singleton using `posthog-node`, with `flushAt: 1` and `flushInterval: 0` for immediate event delivery in serverless contexts.

**Modified files:**
- `src/hooks.server.ts` — Added a `posthogProxy` handle to reverse-proxy all `/ingest/*` requests to PostHog's ingestion servers (avoids ad blockers), and a `handleError` hook to capture server-side exceptions.
- `svelte.config.js` — Added `paths.relative: false` (required for PostHog session replay to work correctly with SSR).
- `src/routes/(marketing)/login/sign_in/+page.svelte` — Identifies the user in PostHog (`posthog.identify`) and captures `sign_in_completed` on successful auth state change.
- `src/routes/(admin)/account/sign_out/+page.svelte` — Captures `sign_out` and calls `posthog.reset()` to disassociate the session after sign-out.
- `src/routes/(marketing)/contact_us/+page.svelte` — Captures `contact_us_submitted` on successful form submission.
- `src/routes/(marketing)/pricing/pricing_module.svelte` — Captures `plan_selected` with plan details when a user clicks a pricing CTA.
- `src/routes/(admin)/account/api/+page.server.ts` — Server-side: captures `profile_created`, `profile_updated`, `password_changed`, and `account_deleted` keyed to the user's Supabase ID.
- `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` — Server-side: captures `subscription_checkout_started` before redirecting to Stripe checkout.
- `src/routes/(admin)/account/(menu)/billing/manage/+page.server.ts` — Server-side: captures `billing_portal_accessed` before redirecting to the Stripe billing portal.

## Events

| Event | Description | File |
|---|---|---|
| `sign_in_completed` | User successfully signs in | `src/routes/(marketing)/login/sign_in/+page.svelte` |
| `sign_out` | User signs out of their account | `src/routes/(admin)/account/sign_out/+page.svelte` |
| `contact_us_submitted` | User submits the contact form | `src/routes/(marketing)/contact_us/+page.svelte` |
| `plan_selected` | User clicks to select a pricing plan | `src/routes/(marketing)/pricing/pricing_module.svelte` |
| `profile_created` | User creates their profile for the first time | `src/routes/(admin)/account/api/+page.server.ts` |
| `profile_updated` | User updates their existing profile | `src/routes/(admin)/account/api/+page.server.ts` |
| `password_changed` | User successfully changes their password | `src/routes/(admin)/account/api/+page.server.ts` |
| `account_deleted` | User deletes their account | `src/routes/(admin)/account/api/+page.server.ts` |
| `subscription_checkout_started` | User is redirected to Stripe checkout | `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` |
| `billing_portal_accessed` | User accesses the Stripe billing portal | `src/routes/(admin)/account/(menu)/billing/manage/+page.server.ts` |

## Next steps

Create an **"Analytics basics"** dashboard in PostHog with these recommended insights. Visit each link to build the insight, then save it to your dashboard:

1. **Sign-ins over time** — Trend of `sign_in_completed` to monitor daily/weekly active sign-ins.
   → [Build insight](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"sign_in_completed","name":"sign_in_completed","type":"events","order":0}]})

2. **Subscription conversion funnel** — Funnel from `sign_in_completed` → `plan_selected` → `subscription_checkout_started` to measure signup-to-paid conversion.
   → [Build insight](https://us.posthog.com/project/2/insights/new#{"insight":"FUNNELS","events":[{"id":"sign_in_completed","name":"sign_in_completed","type":"events","order":0},{"id":"plan_selected","name":"plan_selected","type":"events","order":1},{"id":"subscription_checkout_started","name":"subscription_checkout_started","type":"events","order":2}]})

3. **Account deletions (churn)** — Trend of `account_deleted` to monitor churn over time.
   → [Build insight](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"account_deleted","name":"account_deleted","type":"events","order":0}]})

4. **Contact form submissions** — Trend of `contact_us_submitted` to track sales lead activity.
   → [Build insight](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"contact_us_submitted","name":"contact_us_submitted","type":"events","order":0}]})

5. **New profile creations** — Trend of `profile_created` to track new user onboarding completions.
   → [Build insight](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"profile_created","name":"profile_created","type":"events","order":0}]})

→ [Go to PostHog Dashboards](https://us.posthog.com/project/2/dashboards)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-sveltekit/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
