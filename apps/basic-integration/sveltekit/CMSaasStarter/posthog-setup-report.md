# PostHog setup report

PostHog analytics was installed and initialized for this SvelteKit app, with authenticated product-event tracking, client error tracking, and a starter dashboard.

## Installed and initialized

- Added `posthog-js` (`^1.404.1`) and `posthog-node` (`^5.45.2`) with npm; `package.json` and `package-lock.json` were updated.
- Client initialization lives in `src/hooks.client.ts`, using SvelteKit's client `init()` hook and the environment variables `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST`. Missing configuration is guarded so production remains a no-op while development reports the missing variable. Exception capture is enabled.
- Server capture uses the guarded singleton in `src/lib/server/posthog.ts`, with environment-based credentials, exception autocapture, `flushAt: 1`, and `flushInterval: 0`; request handlers flush before returning.
- `svelte.config.js` sets `kit.paths.relative` to `false` for session replay compatibility. No CSP was found in the inspected source, so no CSP change was made.
- The real PostHog environment values were configured in `.env` through the environment tooling, and the variable names are documented in `.env.example`.

## Instrumented events

These are the events recorded in the run's event plan and confirmed by the capture-step handoff. The run verified that the capture calls are present in source; it did **not** observe events arriving in PostHog.

| Event | What it measures | File |
|---|---|---|
| `contact_request_submitted` | A visitor successfully submits the contact form. | `src/routes/(marketing)/contact_us/+page.svelte` |
| `subscription_checkout_started` | An authenticated user successfully starts a Stripe subscription checkout session. | `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` |
| `billing_portal_opened` | An authenticated subscriber opens the Stripe billing portal. | `src/routes/(admin)/account/(menu)/billing/manage/+page.server.ts` |
| `email_subscription_changed` | An authenticated user changes their email subscription preference. | `src/routes/(admin)/account/api/+page.server.ts` |
| `account_email_change_requested` | An authenticated user successfully requests an account email change. | `src/routes/(admin)/account/api/+page.server.ts` |
| `account_password_changed` | An authenticated user successfully changes their password. | `src/routes/(admin)/account/api/+page.server.ts` |
| `account_deleted` | An authenticated user successfully deletes their account. | `src/routes/(admin)/account/api/+page.server.ts` |
| `profile_created` | An authenticated user creates their account profile. | `src/routes/(admin)/account/api/+page.server.ts` |
| `profile_updated` | An authenticated user updates their account profile. | `src/routes/(admin)/account/api/+page.server.ts` |

The public contact event is intentionally personless because no stable user ID reaches that call site. The authenticated server events use the Supabase stable user ID and exclude PII and sensitive inputs.

## Identification

Identification is wired for authenticated browser sessions in `src/routes/(admin)/account/+layout.svelte`. It uses the stable Supabase `user.id`, sends email and optional full name as person properties, identifies on account-layout mount and `SIGNED_IN`, and resets on `SIGNED_OUT`. This covers returning authenticated sessions as well as sign-in transitions. Client identity is only established inside the authenticated account area; the public contact flow remains anonymous.

## Error tracking

`src/hooks.client.ts` exports SvelteKit's global `handleError` hook and calls `posthog.captureException(error)`, while preserving the existing `message` and `status`. `posthog.init()` also enables exception capture. Server-side error handling was not added; the error-tracking step explicitly left it outside scope.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1902699)

The dashboard contains five insights covering contact requests, subscription checkout starts, account/profile changes, a contact-to-subscription funnel, and billing/preferences activity. The insights were created successfully, but may be empty until events are ingested. No runtime delivery test was performed.

## Verification and unresolved issues

- `npm install` completed successfully and dependencies were current.
- `npm run lint` passed.
- `npm run check` still reports 12 errors, all in seven untouched files that import unavailable Supabase/Stripe static environment variables. PostHog-specific type errors and the account-layout type error were corrected.
- `npm run build` fails on the same pre-existing missing `PUBLIC_SUPABASE_URL` export in untouched code. This is the full build conflict reported by the review step; it is not caused by the PostHog integration.
- The run verified source presence and lint/build/check outcomes only. It did not verify that any event or exception reached PostHog.

## Before you merge

- [ ] Run a full production build and resolve the pre-existing missing Supabase/Stripe environment exports in the seven untouched files; also confirm the PostHog files remain clean (`src/hooks.client.ts`, `src/lib/server/posthog.ts`, and `src/routes/(admin)/account/+layout.svelte`, at the relevant initialization, capture, and identity lines).
- [ ] Run the test suite and update mocks or fixtures for the instrumented call sites in `src/routes/(marketing)/contact_us/+page.svelte`, `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts`, `src/routes/(admin)/account/(menu)/billing/manage/+page.server.ts`, and `src/routes/(admin)/account/api/+page.server.ts` if needed.
- [ ] Set `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` in every deploy environment, not only local `.env`; verify the names against `.env.example` and the reads in `src/hooks.client.ts` and `src/lib/server/posthog.ts`.
- [ ] Exercise an authenticated returning-session path and confirm `src/routes/(admin)/account/+layout.svelte` calls `identify` on refresh, so returning sessions do not fragment onto anonymous distinct IDs.
- [ ] Trigger representative contact, account, billing, subscription, and profile actions and confirm the corresponding events arrive in PostHog; the run itself did not perform this runtime delivery check.
