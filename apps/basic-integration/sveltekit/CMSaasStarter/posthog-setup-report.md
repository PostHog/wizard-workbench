# PostHog setup report

PostHog was installed and integrated into the SvelteKit application with browser initialization, server-side event capture, authenticated-user identification, client error tracking, and a starter dashboard.

## Installed and initialized

- Installed `posthog-js` and `posthog-node` with npm; `package.json` and `package-lock.json` were updated.
- Browser PostHog is initialized once from `src/hooks.client.ts` using `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` from SvelteKit public environment variables. Missing configuration is a development error and a production no-op.
- Server capture uses an environment-backed singleton in `src/lib/server/posthog.ts`, configured for short-lived SvelteKit requests with `flushAt: 1`, `flushInterval: 0`, and exception autocapture. Instrumented handlers await `flush()` before returning or redirecting.
- `svelte.config.js` sets `kit.paths.relative = false` for SSR-compatible session replay.
- `.env.example` documents `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST`; the real values were configured locally in `.env` during the run.
- No Content-Security-Policy was present, so no CSP changes were required.

## Events instrumented

These events are emitted after the corresponding server-side action succeeds. The run did not observe any of these events arriving in PostHog, so their delivery and dashboard population remain unconfirmed.

| Event | What it measures | File |
|---|---|---|
| `contact_request_submitted` | A visitor successfully submits the contact form. | `src/routes/(marketing)/contact_us/+page.server.ts` |
| `email_subscription_toggled` | An authenticated user changes their email subscription preference. | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_change_requested` | An authenticated user successfully requests an email-address change. | `src/routes/(admin)/account/api/+page.server.ts` |
| `password_updated` | An authenticated user successfully updates their password. | `src/routes/(admin)/account/api/+page.server.ts` |
| `account_deleted` | An authenticated user successfully deletes their account. | `src/routes/(admin)/account/api/+page.server.ts` |
| `profile_saved` | An authenticated user creates or updates their profile. | `src/routes/(admin)/account/api/+page.server.ts` |
| `checkout_started` | An authenticated user successfully begins a paid subscription checkout. | `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` |
| `billing_portal_opened` | An authenticated user successfully opens the Stripe billing portal. | `src/routes/(admin)/account/(menu)/billing/manage/+page.server.ts` |

A confirmed Stripe subscription-completion event was not added; the capture handoff recommends a verified Stripe webhook rather than inferring completion from a checkout redirect.

## User identification

Identification was wired in `src/routes/(admin)/account/+layout.svelte`. The stable Supabase `user.id` is used as the PostHog distinct ID for an already-authenticated user and for newly signed-in users. Email is sent only as a person property, not as an event property. `posthog.reset()` runs on `SIGNED_OUT` so subsequent activity is not attributed to the previous account. Server-side events bind the authenticated request's Supabase user ID independently; the contact event is intentionally personless.

## Error tracking

`src/hooks.client.ts` enables `capture_exceptions: true` and exports SvelteKit's global `handleError` hook, which calls `posthog.captureException(error)` when PostHog configuration exists while preserving the SvelteKit status and message response. No server-side `handleError` was added, so server exception tracking is not confirmed as wired.

## Dashboard

Starter dashboard: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1919869)

It contains three successfully created, tagged insights covering contact requests, billing engagement, and account activity. Two additional insight-creation attempts failed because of PostHog MCP command JSON quoting, but the dashboard and three insights were created successfully. The insights may be empty because no event arrival was observed during this run.

## Verification and conflicts

- `npm install` completed successfully; PostHog dependencies were already current.
- `npm run lint` passed.
- The full typecheck and production build were not successful. `npm run check` reported 12 existing missing static environment-export errors across seven non-PostHog Supabase/Stripe files. `npm run build` failed first on missing `PUBLIC_SUPABASE_URL` in `src/routes/(admin)/account/+layout.ts`.
- These build and typecheck failures were attributed by the review handoff to absent Supabase and Stripe environment variables, not to the PostHog changes. They remain unresolved in this run.
- The run did not execute the app or observe events arriving in PostHog. Therefore, compilation/lint evidence must not be treated as proof that events flow.

## Next steps

1. Configure the existing Supabase and Stripe environment variables in the deployment environment, then run the full typecheck and production build.
2. Exercise each successful action in a non-production environment and confirm the eight event names arrive in PostHog with the expected distinct IDs.
3. Confirm returning authenticated sessions identify with the existing Supabase user ID and that signing out resets attribution.
4. Decide whether server-side exception tracking is required; if so, add a SvelteKit server `handleError` with the existing short-lived client and awaited flush behavior.
5. Add a verified Stripe webhook event for completed subscriptions if subscription completion analytics are needed.
6. Revisit the dashboard after events arrive and confirm its three views contain data.

## Before you merge

- [ ] Run a full production build after configuring the missing Supabase and Stripe environment variables; confirm no type or build errors were introduced by the PostHog changes.
- [ ] Run the test suite and update any mocks or fixtures affected by the instrumented route handlers.
- [ ] Set `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` in every deploy environment, using the exact names documented in `.env.example`, rather than relying on the local `.env`.
- [ ] Exercise the instrumented handlers and verify all eight event names arrive in PostHog; inspect the capture calls in the listed `+page.server.ts` files if any event is missing.
- [ ] Verify the returning-user identify path in `src/routes/(admin)/account/+layout.svelte` and the logout reset path before merging authenticated analytics.
