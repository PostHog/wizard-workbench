# PostHog setup report

PostHog browser and server analytics were installed and initialized for the Next.js Pages Router app, with identity, ten product events, exception autocapture, and a starter dashboard configured.

## What was installed and initialized

- Installed `posthog-js` 1.409.5 and `posthog-node` 5.47.2 using pnpm; `package.json` and `pnpm-lock.yaml` were updated.
- Browser initialization lives in `instrumentation-client.ts` and uses the `posthog-js` singleton. It reads `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`, enables the documented defaults, exception capture, and same-origin tracing headers. The real values were configured in `.env`; placeholder key names are documented in `.env.example`.
- Server events use the shared `captureServerEvent` helper in `lib/posthog-server.ts`, configured from the same environment variables and flushed per request.

## Events instrumented

These are instrumented call sites verified by code review. The run did **not** observe events arriving in PostHog, so arrival and dashboard population remain unconfirmed.

| Event | What it measures | File |
|---|---|---|
| `user_signed_in` | An authenticated user successfully signs in. | `pages/api/auth/sign-in.ts` |
| `user_signed_up` | A new account is created successfully. | `pages/api/auth/sign-up.ts` |
| `team_created` | A newly registered owner receives a new team. | `pages/api/auth/sign-up.ts` |
| `checkout_started` | An authenticated user successfully creates a subscription checkout session. | `pages/api/stripe/create-checkout.ts` |
| `customer_portal_opened` | A user successfully opens the subscription management portal. | `pages/api/stripe/customer-portal.ts` |
| `checkout_completed` | A Stripe checkout confirmation successfully persists the team subscription. | `pages/api/stripe/checkout.ts` |
| `account_updated` | An authenticated user successfully updates account details. | `pages/api/account/update.ts` |
| `team_member_invited` | An authenticated user successfully sends a team invitation. | `pages/api/team/invite.ts` |
| `team_member_removed` | An authenticated user successfully removes a team member. | `pages/api/team/remove-member.ts` |
| `user_signed_out` | An identified user initiates sign-out from the application header. | `components/header.tsx` |

Server events use the authenticated database user ID as `distinctId`; event properties contain contextual identifiers and business metadata rather than user-entered PII. The Stripe webhook subscription-change path was not instrumented because it has no resolved acting-user identity.

## User identification

Identification is wired in `pages/_app.tsx`: the existing `/api/user` SWR state supplies the stable numeric user ID to `posthog.identify`, with email, name, and role sent as person properties. `components/header.tsx` captures `user_signed_out` and resets the identity after a successful sign-out. Returning authenticated sessions are intended to identify again when `/api/user` resolves; this was verified from the code path, not from a live event.

## Error tracking

`instrumentation-client.ts` enables `capture_exceptions: true`, allowing global browser exception and unhandled-rejection autocapture. No individual error boundaries or server-side error handling were added. The run verified the configuration was present, but did not observe an exception event in PostHog.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1935647) was created with four wizard-tagged insights covering daily sign-ins, account/team activity, subscription checkout activity, and signup-to-checkout conversion. The insights may be empty until traffic arrives; this run did not verify event delivery.

## Build and verification

- pnpm installation completed successfully, including both PostHog SDKs.
- `pnpm build` completed Next.js compilation plus linting/type validation successfully.
- The production build did not complete page-data collection because pre-existing required application variables were missing: `POSTGRES_URL`, `AUTH_SECRET`, and `BASE_URL`. The exact failure was: `POSTGRES_URL environment variable is not set` while collecting page data for `/`.
- No standalone lint or typecheck script exists. No test suite or live event-flow verification was run.

## Issues to follow up

- The webhook subscription-change path remains unattributed because the existing handler cannot resolve an acting user identity. If subscription changes must be analyzed by user, leaving this unresolved loses attribution for those lifecycle events.
- Event delivery was not observed. Until a deployed or locally runnable environment triggers the paths and the events are checked in PostHog, capture remains an implementation claim rather than verified telemetry.
- The build conflict is unrelated to PostHog: deployment or local build configuration must provide `POSTGRES_URL`, `AUTH_SECRET`, and `BASE_URL`.

## Before you merge

- [ ] Run a full production build and fix any lint or type errors introduced by the integration; the recorded build was blocked at page-data collection by missing `POSTGRES_URL`, `AUTH_SECRET`, and `BASE_URL`.
- [ ] Run the test suite and update mocks or fixtures for the instrumented API routes and header sign-out path.
- [ ] Set `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` in every deploy environment, not only `.env`; confirm the exact names documented in `.env.example`.
- [ ] Trigger sign-in, sign-up, team creation, checkout, account/team actions, and sign-out in a configured environment, then confirm the corresponding events arrive in PostHog and populate the dashboard.
- [ ] Confirm the returning-authenticated-user path identifies again in `pages/_app.tsx` and verify sign-out resets identity in `components/header.tsx`.
- [ ] Decide whether the Stripe webhook needs user attribution and, if so, resolve an acting user identity before adding capture to that handler.
