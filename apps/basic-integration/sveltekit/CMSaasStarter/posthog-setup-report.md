<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this SvelteKit SaaS starter project. The integration covers client-side initialization, a reverse proxy (to bypass ad blockers), server-side event tracking, user identification, and error tracking.

**Key changes made:**

- **`src/hooks.client.ts`** (new): Initializes PostHog in the browser via the `init` hook, routing events through `/ingest` reverse proxy. Also attaches a `handleError` hook to automatically capture client-side exceptions.
- **`src/hooks.server.ts`**: Added a `posthogProxy` handle to proxy `/ingest/*` and `/ingest/array/*` requests to PostHog's servers (bypassing ad blockers). Added `handleError` to capture server-side errors with context.
- **`src/lib/server/posthog.ts`** (new): Singleton server-side PostHog client using `posthog-node`, configured for immediate flushing (`flushAt: 1`, `flushInterval: 0`).
- **`svelte.config.js`**: Added `paths: { relative: false }` (required for session replay with SSR).
- **`src/routes/(marketing)/login/sign_in/+page.svelte`**: Calls `posthog.identify()` and captures `user_signed_in` on the `SIGNED_IN` auth state change.
- **`src/routes/(admin)/account/sign_out/+page.svelte`**: Captures `user_signed_out` and calls `posthog.reset()` after successful sign-out.
- **`src/routes/(marketing)/pricing/+page.svelte`**: Captures `pricing_page_viewed` on mount (top of conversion funnel).
- **`src/routes/(admin)/account/subscribe/[slug]/+page.server.ts`**: Server-side capture of `subscription_checkout_started` with `plan_id` property when a Stripe checkout session is created.
- **`src/routes/(marketing)/contact_us/+page.server.ts`**: Server-side capture of `contact_form_submitted` using the submitter's email as distinct ID.
- **`src/routes/(admin)/account/api/+page.server.ts`**: Server-side captures for `profile_created`, `profile_updated`, `account_deleted`, `password_changed`, and `email_update_requested`.

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User authenticates successfully (client-side, with identify) | `src/routes/(marketing)/login/sign_in/+page.svelte` |
| `user_signed_out` | User signs out; PostHog session reset | `src/routes/(admin)/account/sign_out/+page.svelte` |
| `pricing_page_viewed` | Visitor views the pricing page (top of conversion funnel) | `src/routes/(marketing)/pricing/+page.svelte` |
| `subscription_checkout_started` | Stripe checkout session created for a plan; includes `plan_id` | `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` |
| `contact_form_submitted` | Contact-us form successfully saved | `src/routes/(marketing)/contact_us/+page.server.ts` |
| `profile_created` | First-time profile save (activation milestone) | `src/routes/(admin)/account/api/+page.server.ts` |
| `profile_updated` | User updates existing profile info | `src/routes/(admin)/account/api/+page.server.ts` |
| `account_deleted` | Account successfully deleted (churn event) | `src/routes/(admin)/account/api/+page.server.ts` |
| `password_changed` | Password successfully changed | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_update_requested` | User requests an email change (verification sent) | `src/routes/(admin)/account/api/+page.server.ts` |

## Next steps

To create the recommended "Analytics basics" dashboard, visit your PostHog project and create insights for:

1. **Subscription funnel** — Funnel insight from `pricing_page_viewed` → `subscription_checkout_started`: [Create funnel](/insights/new?insight=FUNNELS)
2. **Daily active sign-ins** — Trends insight for `user_signed_in` over time: [Create trend](/insights/new?insight=TRENDS)
3. **Activation (profile creation)** — Trends insight for `profile_created`: [Create trend](/insights/new?insight=TRENDS)
4. **Churn (account deletions)** — Trends insight for `account_deleted`: [Create trend](/insights/new?insight=TRENDS)
5. **Contact form submissions** — Trends insight for `contact_form_submitted`: [Create trend](/insights/new?insight=TRENDS)

Then add all five to a new [Analytics basics dashboard](/dashboard).

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
