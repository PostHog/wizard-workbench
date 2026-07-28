# PostHog setup report

CloudFlow now has a build-validated browser PostHog integration with two invoice events, centralized client exception capture, and a starter analytics dashboard.

## What was installed and initialized

- Installed `@posthog/react` 1.10.3 and `posthog-node` 5.46.1 with pnpm; both are recorded in `package.json` and `pnpm-lock.yaml`.
- Added `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to the local `.env` through the wizard tools, and documented the names in `.env.example`.
- Updated `src/routes/__root.tsx` so the root document wraps application children in `PostHogProvider`. It reads the Vite environment variables, fails loudly in development when either is missing, remains a production no-op when configuration is absent, enables exception capture, and adds tracing headers for same-origin requests.
- No CSP directives were present or changed.

## Events instrumented

| Event | What it measures | File |
|---|---|---|
| `invoice_created` | A visitor successfully creates a new invoice. | `src/routes/posts.index.tsx` |
| `invoice_marked_paid` | A visitor marks a pending invoice as paid. | `src/routes/posts.$postId.tsx` |

The event handlers capture only after the corresponding operation succeeds. `invoice_created` includes the numeric amount; `invoice_marked_paid` includes the invoice ID and amount. The events are personless because the application has no authenticated actor or identity boundary. No browser run observed these events arriving in PostHog, so delivery remains unconfirmed.

## User identification

Identification was skipped. Review found no authentication, login, registration, session, logout, or current-user state. The external JSONPlaceholder team records are demonstration data and are not a valid application identity. No `DISTINCT_ID` placeholder was introduced. If authentication is added later, identify once after successful login or registration using the authenticated user's stable primary key, send email or name only as person properties, and reset on logout.

## Error tracking

`src/components/DefaultCatchBoundary.tsx` now uses `usePostHog()` and calls `posthog.captureException(error)` from the global TanStack Router catch boundary. This centralizes uncaught route/render exception reporting. The run verified that this path compiles; it did not trigger an application error or observe an exception arriving in PostHog.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1914327) contains three `(wizard)` insights: daily invoice creation, daily payments, and a 14-day ordered `invoice_created`-to-`invoice_marked_paid` conversion funnel. The dashboard was created without waiting for event data, so its charts may initially be empty.

## Verification and limits

- `pnpm install` completed successfully and the lockfile was current.
- `pnpm build` completed successfully: Vite built the client, SSR, and Nitro outputs, and `tsc --noEmit` passed.
- Review found no required fixes. No lint or standalone typecheck scripts are defined, and tests were not run.
- The build proves the integration compiles; it does not prove that events or exceptions were captured by PostHog. No browser/app run exercised network delivery.
- The install emitted warnings that build scripts for `core-js` and `esbuild` were ignored; this did not prevent the successful build. Vite also emitted a non-failing chunk-size advisory.
- Server-side API mutation instrumentation was intentionally not added. `posthog-node` is installed for a later task, but no server-side capture or flush behavior was implemented in this run.

## Unresolved issues to follow up

- **Event delivery is unresolved:** no browser observation established that `invoice_created` in `src/routes/posts.index.tsx` or `invoice_marked_paid` in `src/routes/posts.$postId.tsx` reaches PostHog. If left unresolved, the dashboard and funnel can remain empty despite successful builds.
- **Server-side attribution is unresolved:** the API routes remain uninstrumented, so server-authoritative mutations do not independently record events. If left unresolved, server activity cannot be audited separately from the client success handlers.
- **Identity attribution is unresolved by design:** no authenticated identity exists. If authentication is later introduced without adding identify/reset lifecycle wiring, activity will remain anonymous or fragmented across distinct IDs.

## Before you merge

- [ ] Run a full production build and fix any lint or type errors introduced by the generated integration; the wizard verified `pnpm build`, but no lint script exists and this remains a merge check.
- [ ] Run the test suite and update mocks or fixtures for the new PostHog provider and capture calls; tests were not run during this integration.
- [ ] Confirm `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` match the exact names in `.env.example`, and set them in every deployment environment rather than only in local `.env`.
- [ ] Exercise successful invoice creation at `src/routes/posts.index.tsx` and payment marking at `src/routes/posts.$postId.tsx`, then confirm `invoice_created` and `invoice_marked_paid` arrive in PostHog.
- [ ] Trigger an uncaught route/render error through `src/components/DefaultCatchBoundary.tsx` and confirm the exception appears in PostHog Error Tracking.
- [ ] If authentication is added, wire identify after login/registration and reset on logout using the stable authenticated user ID; do not identify from the external team records.
