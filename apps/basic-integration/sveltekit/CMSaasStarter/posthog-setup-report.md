# PostHog setup report

PostHog was added to the SvelteKit app for browser initialization, authenticated server-side product events, user identification, client exception tracking, and a starter analytics dashboard.

## Installed and initialized

- Installed `posthog-js` (`^1.406.2`) and `posthog-node` (`^5.46.0`) with npm; `package.json` and `package-lock.json` were updated.
- Browser initialization lives in `src/hooks.client.ts`, using the optional `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` environment variables. Development reports missing configuration; production remains a no-op when unconfigured. Exception autocapture is enabled.
- Server capture uses the singleton in `src/lib/server/posthog.ts`, with `flushAt: 1`, `flushInterval: 0`, and an awaited flush after request-scoped captures.
- `svelte.config.js` sets `kit.paths.relative: false` for replay-compatible SSR paths.
- The exact environment variable names are documented in `.env.example` and were configured locally by the setup run. No CSP or reverse proxy was added.

## Events instrumented

The event plan also contains `contact_request_submitted`, but the capture step intentionally did not instrument it: the server action could not access the browser PostHog session context and must not fabricate an identity.

| Event | What it measures | Instrumented file |
|---|---|---|
| `subscription_checkout_started` | An authenticated customer starts a Stripe subscription checkout. | `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` |
| `billing_portal_opened` | An authenticated customer opens the Stripe billing portal. | `src/routes/(admin)/account/(menu)/billing/manage/+page.server.ts` |
| `email_subscription_updated` | An authenticated customer changes email subscription status. | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_change_requested` | An authenticated customer requests an email address change. | `src/routes/(admin)/account/api/+page.server.ts` |
| `password_updated` | An authenticated customer successfully changes a password. | `src/routes/(admin)/account/api/+page.server.ts` |
| `account_deleted` | An authenticated customer successfully deletes an account. | `src/routes/(admin)/account/api/+page.server.ts` |
| `profile_created` | An authenticated customer completes initial profile creation. | `src/routes/(admin)/account/api/+page.server.ts` |
| `profile_updated` | An authenticated customer successfully updates an existing profile. | `src/routes/(admin)/account/api/+page.server.ts` |

These captures use the authenticated Supabase `user.id` and exclude PII from event properties. The run verified that the calls are present after successful actions and that server captures flush; it did **not** observe events arriving in PostHog.

## Identification

Identification is wired in `src/routes/(admin)/account/+layout.svelte`. Authenticated users are identified with the stable Supabase `user.id` on account-layout mount and on `SIGNED_IN`; email is sent as a person property. `SIGNED_OUT` resets PostHog, and direct account switches reset before identifying the next account. The returning-session path is intended to identify on account-layout mount. The run verified these code paths, not their live PostHog attribution.

## Error tracking

`src/hooks.client.ts` enables posthog-js exception capture and uses SvelteKit's global `handleError` hook to call `posthog.captureException(error)` while preserving the existing status/message response. No server-side error handler was added. The run verified the wiring, not receipt of exception events.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1924765) was created with five tagged insights covering subscription checkout starts, billing portal activity, profile updates and creation, account security changes, and email preference changes. The insights are valid 30-day daily definitions; the run did not verify that they contain observed event data.

## Validation and build conflict

- `npm install` completed successfully with dependencies already resolved.
- `npm run lint` passed.
- `npm run check` still reports 12 pre-existing missing Supabase/Stripe static-environment export errors in seven non-PostHog files; PostHog dynamic-environment errors were resolved.
- `npm run build` still fails first on the pre-existing missing `PUBLIC_SUPABASE_URL` static export in `src/routes/(admin)/account/+layout.ts`. The original build also emitted pre-existing Svelte/Kit export warnings.
- No tests were run.

The build and typecheck conflict is therefore unresolved but was attributed by the review step to absent Supabase/Stripe environment configuration, not to the PostHog changes. A passing lint run and the reviewed code do not prove that events flow to PostHog.

## Follow-up issues

1. `contact_request_submitted` remains unresolved in `src/routes/(marketing)/contact_us/+page.server.ts`: the plan calls for a public contact-form event, but the server action could not establish browser-session attribution without fabricating an identity. Leaving it unresolved means contact submissions are absent from the planned analytics coverage.
2. The run did not verify live event delivery or authenticated attribution. Before relying on the dashboard, exercise each successful action and confirm the corresponding events and person IDs in PostHog.

## Before you merge

- [ ] Run a full production build and resolve the existing missing Supabase/Stripe environment configuration, including `PUBLIC_SUPABASE_URL` reported from `src/routes/(admin)/account/+layout.ts`; confirm no PostHog-generated type or build errors remain.
- [ ] Run the test suite; the instrumented server actions in `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts`, `src/routes/(admin)/account/(menu)/billing/manage/+page.server.ts`, and `src/routes/(admin)/account/api/+page.server.ts` may require updated mocks or fixtures.
- [ ] Set `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` in every deployment environment, using the names documented in `.env.example`, not only in the local `.env`.
- [ ] Verify the client initialization and global error boundary in `src/hooks.client.ts` in a deployed browser, and confirm exception events arrive in PostHog.
- [ ] Verify the login, refresh, logout, and account-switch paths in `src/routes/(admin)/account/+layout.svelte`, confirming events are attributed to the stable Supabase user ID and logout resets identity.
- [ ] Decide how to instrument `contact_request_submitted` in `src/routes/(marketing)/contact_us/+page.server.ts` while preserving browser-session attribution and avoiding fabricated identities.
