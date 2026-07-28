# PostHog setup report

PostHog product analytics, user identification, server-side event capture, browser exception tracking, and a starter dashboard were added to this Next.js Pages Router application.

## Set up

- Installed `posthog-js` 1.407.5 and `posthog-node` 5.46.1 with pnpm; both are recorded in `package.json` and `pnpm-lock.yaml`.
- Initialized the browser SDK once in `instrumentation-client.ts` using `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`. The integration uses the documented defaults, development debugging, same-origin tracing headers, and production-safe no-op behavior when configuration is absent; development reports missing configuration.
- Added the real environment values to local `.env` and documented the public variable names in `.env.example`. The environment keys were verified as present locally; deployment configuration was not verified.
- Added a guarded `posthog-node` singleton in `lib/posthog-server.ts` with exception autocapture and awaited flushing for short-lived API handlers.

## Events instrumented

These events were added to real authenticated success or logout paths. The run did **not** execute the application or observe any event arriving in PostHog, so delivery remains unconfirmed.

| Event | What it measures | File |
|---|---|---|
| `user_signed_out` | An authenticated user successfully signs out. | `components/header.tsx` |
| `user_signed_in` | An authenticated user successfully signs in. | `pages/api/auth/sign-in.ts` |
| `user_signed_up` | A newly created user completes account registration. | `pages/api/auth/sign-up.ts` |
| `team_created` | A new workspace is created during account registration. | `pages/api/auth/sign-up.ts` |
| `team_invitation_accepted` | A newly registered user accepts a pending workspace invitation. | `pages/api/auth/sign-up.ts` |
| `account_updated` | An authenticated user saves changes to account details. | `pages/api/account/update.ts` |
| `team_member_invited` | An authenticated team member sends a workspace invitation. | `pages/api/team/invite.ts` |
| `team_member_removed` | An authenticated team member removes a workspace member. | `pages/api/team/remove-member.ts` |
| `checkout_started` | An authenticated user begins a subscription checkout session. | `pages/api/stripe/create-checkout.ts` |
| `checkout_completed` | A completed Stripe checkout updates the workspace subscription. | `pages/api/stripe/checkout.ts` |
| `customer_portal_opened` | An authenticated user opens Stripe subscription management. | `pages/api/stripe/customer-portal.ts` |

Server events use the trusted database user ID as `distinctId`; logout is captured in the browser before reset. The Stripe webhook itself was not instrumented because it lacks a direct user identity at its handler boundary. Sign-in and sign-up events fire on the standard dashboard response path, while checkout-started represents the direct checkout path.

## Identification

Identification was wired. `components/login.tsx` identifies successful sign-in/sign-up with `String(result.user.id)` and sends email and role as person properties, not event properties. `components/header.tsx` restores identity on refresh when needed and calls `posthog.reset()` after successful logout. No stable-ID placeholder was reported by the run.

## Error tracking

Browser exception autocapture is enabled centrally with `capture_exceptions: true` in `instrumentation-client.ts`. The server helper enables exception autocapture as well. No server application error-handler instrumentation was added. Error delivery was not exercised or observed.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1918299)

The dashboard contains four saved insights: signup-to-checkout conversion funnel, user sign-ins over time, workspace activity, and subscription checkout activity. The insights are configured from the instrumented event names, but may remain empty until events arrive.

## What verification established

- Dependency installation completed with pnpm, and the lockfile was current.
- The review build passed lint/type validation and production compilation (`✓ Compiled successfully`) after fixing the nullable `teamId` property in `pages/api/account/update.ts`.
- The PostHog integration type-compiles according to the review handoff.
- The dashboard and four insights were created successfully in PostHog.

## What remains unconfirmed or unresolved

- No automated browser session, API exercise, or PostHog ingestion check ran. No event capture or exception delivery can therefore be claimed as observed.
- The full `pnpm build` did not finish page-data collection because this environment lacks `POSTGRES_URL`; this is unrelated to the PostHog changes. The exact conflict was: `Error: POSTGRES_URL environment variable is not set`.
- Deployment availability of the PostHog environment variables was assumed, not verified.
- No CSP was identified, so no CSP changes or runtime CSP verification were performed.
- The Stripe webhook remains without direct event instrumentation because user attribution was unavailable at that handler boundary; leaving it unchanged means webhook-only subscription changes are not independently tracked.

## Before you merge

- [ ] Run `pnpm build` in an environment with `POSTGRES_URL` configured and resolve any remaining application errors; this run only reached successful compilation before page-data collection failed.
- [ ] Run the test suite and update mocks or fixtures for the instrumented API success paths in `pages/api/auth/sign-in.ts`, `pages/api/auth/sign-up.ts`, `pages/api/account/update.ts`, `pages/api/team/invite.ts`, `pages/api/team/remove-member.ts`, `pages/api/stripe/create-checkout.ts`, `pages/api/stripe/checkout.ts`, `pages/api/stripe/customer-portal.ts`, and the logout handler in `components/header.tsx`.
- [ ] Confirm `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` from `.env.example` are set in every deployment environment, not only local `.env`; initialization reads them in `instrumentation-client.ts` lines 3–4.
- [ ] Exercise sign-in, sign-up, workspace/member actions, checkout, customer portal, and logout in a deployed or local app with its database configured, then confirm the eleven event names appear in PostHog and are attributed to the expected user IDs.
- [ ] If the deployed app adds a Content-Security-Policy, load it and check the browser console for blocked PostHog requests; no CSP was present for this run.
- [ ] If the app ships minified browser bundles, add source-map upload to CI so exception stack traces de-minify in PostHog.
- [ ] Confirm the returning-session path in `components/header.tsx` (identify around line 28) keeps refreshed authenticated sessions on the stable user ID.
