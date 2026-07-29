# PostHog setup report

PostHog client analytics, authenticated identity, exception autocapture, seven product events, and a starter dashboard were added to this Next.js Pages Router app.

## Installed and initialized

- Installed `posthog-js` with `pnpm`; the final review removed the unused `posthog-node` dependency because no server-side PostHog instrumentation was added.
- Initialized the browser singleton in `instrumentation-client.ts`, the Next.js 15.5.7 initialization point, using `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`.
- Added the PostHog variable names to `.env.example` and configured the real values in `.env` during the run.
- Missing configuration is loud in development and a no-op in production, so PostHog configuration does not break the app.
- Autocapture remains enabled by default. Exception autocapture is enabled with `capture_exceptions: true`.

## Events instrumented

| Event | What it measures | File |
|---|---|---|
| `user_signed_in` | An authenticated user successfully signs in. | `components/login.tsx` |
| `user_signed_up` | A new account is successfully created. | `components/login.tsx` |
| `checkout_started` | A user starts checkout for a selected subscription plan. | `pages/pricing.tsx` |
| `account_updated` | An authenticated user successfully updates account settings. | `pages/dashboard/general.tsx` |
| `team_member_invited` | An authenticated user successfully invites a team member. | `pages/dashboard/index.tsx` |
| `team_member_removed` | An authenticated user successfully removes a team member. | `pages/dashboard/index.tsx` |
| `billing_portal_opened` | An authenticated user opens the subscription management portal. | `pages/dashboard/index.tsx` |

The capture step verified that calls occur after successful action outcomes, except checkout which is intentionally captured at checkout initiation. Event delivery was not exercised, so this report does not claim that any event was received by PostHog.

## User identification

Identification was wired. Successful sign-in and sign-up identify the user with the stable database primary-key ID; email, name, and role are sent as person properties rather than event properties. A SWR-backed boundary re-identifies an already authenticated user after refresh, and logout resets PostHog only after the sign-out API succeeds.

## Error tracking

`instrumentation-client.ts` enables global posthog-js exception autocapture with `capture_exceptions: true`. The run verified the configuration was present, but did not trigger an exception or observe an error event arriving in PostHog.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1926617)

The dashboard contains four tagged insights: a signup-to-account-update funnel, signups by plan, checkout starts over time, and team-management activity. The dashboard and insight metadata were created successfully; tiles may remain empty until events arrive.

## What the run verified

- The dependency installation completed and the lockfile was current.
- The integration review passed minimality, unrelated-change, local-pattern, and framework-shape checks.
- `pnpm build` compiled successfully and passed Next.js lint and TypeScript validation.
- The PostHog dashboard was created with four insights using the instrumented event names.
- No event delivery, exception delivery, or end-to-end browser flow was observed.

## Build conflict and unconfirmed areas

The full `pnpm build` did not complete. Static page-data collection failed for `/dashboard` because the pre-existing `POSTGRES_URL` environment variable was not set: `Error: POSTGRES_URL environment variable is not set`. Repeating the build after removing the unused server SDK produced the identical failure. This is an application environment prerequisite, not a PostHog compilation or type-check failure.

The test suite was not run. The configured production environment is assumed to provide `POSTGRES_URL`, but that was not available to this run.

## Before you merge

- [ ] Set `POSTGRES_URL` in the local/deployment environment and run the full production build; inspect the `/dashboard` page-data failure before merging (`pages/dashboard` and the existing database configuration).
- [ ] Run the test suite and update any mocks or fixtures affected by the auth response and analytics calls (`pages/api/auth/sign-in.ts`, `pages/api/auth/sign-up.ts`, `components/login.tsx`, `pages/_app.tsx`, and `components/header.tsx`).
- [ ] Confirm `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` from `.env.example` are configured in every deployment environment, not only `.env`.
- [ ] Exercise sign-in, sign-up, checkout, account update, team invite/removal, and billing-portal flows, then confirm the seven named events arrive in PostHog; the run itself did not verify delivery (`components/login.tsx`, `pages/pricing.tsx`, `pages/dashboard/general.tsx`, and `pages/dashboard/index.tsx`).
- [ ] Verify the returning authenticated-user path calls identify after refresh (`pages/_app.tsx`) and that logout reset follows a confirmed successful sign-out (`components/header.tsx`).
- [ ] Trigger a representative browser exception and confirm Error Tracking receives it; the configuration is in place but delivery was not observed (`instrumentation-client.ts`).
