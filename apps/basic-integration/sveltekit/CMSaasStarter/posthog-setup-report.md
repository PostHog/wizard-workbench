# PostHog setup report

PostHog browser and server-side analytics were installed and initialized, authenticated identity and error tracking were wired, seven server events were instrumented, and a starter dashboard was created.

## Installed and initialized

- Installed `posthog-js` `^1.405.3` and `posthog-node` `^5.46.0` with npm; the dependencies are recorded in `package.json` and `package-lock.json.
- Browser initialization is centralized in `src/hooks.client.ts`, using `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` from SvelteKit's dynamic public environment. Initialization is guarded when configuration is absent, and development reports the missing variable.
- Server captures use the guarded `posthog-node` helper in `src/lib/server/posthog.ts`, configured from `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST`, with per-request flushing and exception autocapture.
- `svelte.config.js` sets `kit.paths.relative` to `false` for SSR session replay compatibility.
- The real PostHog environment values were confirmed present in `.env`; `.env.example` documents the required variable names. No CSP directives were found or changed.

## Events instrumented

These are instrumented events, not events observed arriving in PostHog during this run. The run did not perform a live event-flow verification.

| Event | What it measures | File |
|---|---|---|
| `contact_request_submitted` | An anonymous visitor successfully submits the contact form. | `src/routes/(marketing)/contact_us/+page.server.ts` |
| `email_subscription_updated` | An authenticated user changes their marketing email subscription preference. | `src/routes/(admin)/account/api/+page.server.ts` |
| `email_update_requested` | An authenticated user successfully requests an account email change. | `src/routes/(admin)/account/api/+page.server.ts` |
| `password_updated` | An authenticated user successfully updates their password. | `src/routes/(admin)/account/api/+page.server.ts` |
| `account_deleted` | An authenticated user successfully deletes their account. | `src/routes/(admin)/account/api/+page.server.ts` |
| `profile_saved` | An authenticated user creates or updates their profile. | `src/routes/(admin)/account/api/+page.server.ts` |
| `checkout_started` | An authenticated user is redirected to Stripe Checkout for a selected paid plan. | `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` |

Checkout measures checkout creation/redirect, not payment or subscription completion. No Stripe webhook route was present, so subscription completion is not instrumented.

## Identity and privacy

Client identification is wired in `src/routes/(admin)/account/+layout.svelte`: the stable Supabase `user.id` is used as the PostHog distinct ID, while email is sent as a person property. `src/routes/(admin)/account/sign_out/+page.svelte` resets PostHog only after successful sign-out. Server-side authenticated events use stable Supabase user IDs. The contact submission is intentionally personless and only sends bounded non-PII presence properties. No live capture was observed, so identity association remains unconfirmed in production.

## Error tracking

The global client error boundary in `src/hooks.client.ts` enables `capture_exceptions` during initialization and calls `posthog.captureException(error)` from `handleError` after successful initialization. No server-side error handler was added. This wiring was reviewed but not validated by triggering an error and observing it in PostHog.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1918367) was created with three tagged insights: business events over time, account-management activity, and a contact-to-checkout funnel. The insights may initially be empty; the run did not confirm event arrival.

## Verification and conflicts

- `npm install` completed successfully and dependencies were current.
- `npm run lint` passed, with no lint errors attributed to the integration.
- `npm run check` still reported 12 errors in seven pre-existing, non-PostHog files; none were in the integration files after the client-hook fix.
- `npm run build` fails first in the untouched `src/routes/(admin)/account/+layout.ts` because `PUBLIC_SUPABASE_URL` is absent. Build and typecheck remain blocked by pre-existing missing Supabase and Stripe environment configuration. The required PostHog variables are present. This is a build/configuration conflict, not evidence that PostHog events flow.

## Before you merge

- [ ] Run a full production build after providing the existing required Supabase and Stripe environment variables; specifically verify the failure in `src/routes/(admin)/account/+layout.ts` is resolved.
- [ ] Run the test suite and update mocks or fixtures for the instrumented server actions in `src/routes/(admin)/account/api/+page.server.ts`, `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts`, and `src/routes/(marketing)/contact_us/+page.server.ts` if needed.
- [ ] Set `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` in every deploy environment, not only `.env`; confirm the exact names documented in `.env.example`.
- [ ] Exercise each successful action and verify the seven named events arrive in PostHog with the expected stable identity; this run only verified code and configuration.
- [ ] If subscription completion matters, add and instrument a Stripe webhook route; checkout creation in `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` does not prove payment completion.
- [ ] For an authenticated returning visitor, revisit the account flow and confirm `posthog.identify(user.id, ...)` in `src/routes/(admin)/account/+layout.svelte` runs so sessions do not remain anonymous.
