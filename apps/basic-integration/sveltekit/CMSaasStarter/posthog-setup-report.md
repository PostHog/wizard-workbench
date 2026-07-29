# PostHog setup report

PostHog was added to the SvelteKit app with browser and server SDKs, authenticated-user identification, six server-side product events, global error tracking, and a starter dashboard.

## Installed and initialized

- Installed `posthog-js` (`^1.407.0`) and `posthog-node` (`^5.46.0`) with npm; both are recorded in `package.json` and `package-lock.json`.
- Browser initialization lives in `src/hooks.client.ts`, using `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` from SvelteKit public environment variables. Missing configuration is a development-time error and a production no-op.
- Server captures use the guarded singleton in `src/lib/server/posthog.ts`, configured with `flushAt: 1`, `flushInterval: 0`, and exception autocapture. Per-request server handlers flush before returning.
- The required `kit.paths.relative = false` setting is present in `svelte.config.js` for session replay compatibility.
- The variable names are documented in `.env.example` and configured locally through the environment tooling.

## Events instrumented

| Event | What it measures | File |
|---|---|---|
| `email_subscription_toggled` | An authenticated user changes their email subscription preference. | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_change_requested` | An authenticated user successfully requests an email-address change. | `src/routes/(admin)/account/api/+page.server.ts` |
| `password_updated` | An authenticated user successfully updates their password. | `src/routes/(admin)/account/api/+page.server.ts` |
| `account_deleted` | An authenticated user successfully deletes their account. | `src/routes/(admin)/account/api/+page.server.ts` |
| `profile_saved` | An authenticated user creates or updates their business profile. | `src/routes/(admin)/account/api/+page.server.ts` |
| `checkout_started` | An authenticated user starts a paid subscription checkout session. | `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` |

Captures are placed after the corresponding successful operation, use authenticated Supabase user IDs, avoid PII in event properties, preserve an incoming `x-posthog-session-id` when present, and flush before the server action returns.

## User identification

Identification is wired in `src/routes/(admin)/account/+layout.svelte`. The Supabase `user.id` is used as the stable PostHog distinct ID; email is sent only as a person property. Returning logged-in users are identified on mount, sign-ins identify, direct account switches reset before identifying, and sign-outs reset.

Server-side product events use the authenticated user ID directly because no request-scoped PostHog middleware was added. No stable identity was available for the unauthenticated contact-form path, so it was intentionally not instrumented.

## Error tracking

- `src/hooks.client.ts` captures uncaught browser errors with `posthog.captureException` when PostHog is configured.
- `src/hooks.server.ts` captures uncaught server errors through `posthog-node` and awaits `flush()`.
- `src/lib/server/posthog.ts` enables `enableExceptionAutocapture: true`.

No error event was observed arriving in PostHog during this run; the review verified configuration and code paths only.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1926654) contains four insight tiles: account activity trends, checkout starts, account changes, and the profile-save-to-checkout funnel. The dashboard and insight definitions were created successfully, but fresh insights may remain empty until events are generated. The run did not observe event ingestion.

## What the run verified—and did not

- Verified: npm installation completed; `npm run lint` passed; the integration files and event manifest were reviewed; PostHog dashboard creation succeeded.
- Not verified: a production build or typecheck. `npm run check` reported 12 missing pre-existing Supabase and Stripe static environment exports (`PUBLIC_SUPABASE_ANON_KEY`, `PUBLIC_SUPABASE_URL`, `PRIVATE_SUPABASE_SERVICE_ROLE`, and `PRIVATE_STRIPE_API_KEY`). `npm run build` stopped on missing `PUBLIC_SUPABASE_URL` in the unchanged `src/routes/(admin)/account/+layout.ts`. These missing values were not added or changed by this run.
- Not verified: events or exceptions arriving in PostHog. A passing lint/build check would not prove ingestion, and no event-flow test was run.

## Issues to follow up

1. **Build/typecheck environment remains unresolved.** The application cannot complete `npm run check` or `npm run build` without the pre-existing Supabase and Stripe static environment variables. If left unresolved, deployment validation remains blocked and PostHog integration compatibility cannot be fully typechecked or built.
2. **Unified browser/server session attribution remains unresolved.** Server captures forward `x-posthog-session-id` when supplied, but browser initialization does not configure tracing headers. If cross-surface session stitching is required, add and validate that configuration in `src/hooks.client.ts`; otherwise server and browser events may not share one session.
3. **Subscription completion is not tracked.** No Stripe webhook handler was found, so only `checkout_started` is captured. Without a webhook event, completed subscription conversion cannot be measured reliably in the dashboard.

## Before you merge

- [ ] Set `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` in every deploy environment, using the exact names documented in `.env.example`; do not rely only on local `.env`.
- [ ] Provide the existing Supabase and Stripe environment variables, then run the full production build and typecheck; the current blockers surface in `src/routes/(admin)/account/+layout.ts` and related pre-existing files.
- [ ] Run the test suite and update mocks or fixtures for the instrumented actions in `src/routes/(admin)/account/api/+page.server.ts` and `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts`.
- [ ] Log in, refresh while authenticated, switch accounts, and sign out to verify the identify/reset paths in `src/routes/(admin)/account/+layout.svelte`.
- [ ] Trigger each instrumented successful action and confirm the six named events arrive in PostHog with the expected authenticated distinct ID; also trigger a controlled client and server exception to confirm error ingestion.
- [ ] Decide whether unified browser/server session attribution is required, then review `src/hooks.client.ts` and the session-header handling in the two server action files.
- [ ] If subscription conversion reporting is required, add a Stripe webhook completion event before relying on the checkout funnel in the dashboard.
