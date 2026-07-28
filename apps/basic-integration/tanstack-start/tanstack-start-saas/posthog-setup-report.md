# PostHog setup report

PostHog was integrated into the TanStack Start app with client initialization, two invoice workflow events, global client error tracking, and a starter dashboard.

## Installed and initialized

- Installed `@posthog/react` 1.10.3 and `posthog-node` 5.46.1 with pnpm; `package.json` and `pnpm-lock.yaml` were updated.
- Added `PostHogProvider` in `src/routes/__root.tsx`, configured from `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`, with exception capture and same-origin tracing headers.
- Added the lazy server singleton in `src/utils/posthog-server.ts`, including environment validation, exception autocapture, and short-lived-process flush settings. It currently has no caller because the active invoice mutations use TanStack server functions and browser captures are the established contract.
- Documented the environment variable names in `.env.example`. The run confirmed both keys are present locally through wizard environment checks.
- No reverse proxy or CSP changes were made. The review reported no CSP in the project.

## Events instrumented

| Event | What it measures | File |
|---|---|---|
| `invoice_created` | A user successfully creates a new invoice from the invoice form. | `src/routes/posts.index.tsx` |
| `invoice_marked_paid` | A user successfully marks a pending invoice as paid. | `src/routes/posts.$postId.tsx` |

Both events are captured in the originating user handlers only after their mutation promises resolve. The recorded properties are non-PII: numeric `amount` for creation, and `invoice_id` plus `amount` for payment. The run did not observe events arriving in PostHog, so event delivery remains unconfirmed.

## User identification

Identification was skipped. The app has no authenticated current-user lifecycle, login or registration boundary, session state, or logout flow. The displayed team records are managed users from an external demo API, not the active application user, so identifying from them would misattribute activity and could expose PII. The invoice events are therefore intentionally personless and contain no placeholder distinct IDs.

If authentication is added later, identify once at successful login or registration using the stable authenticated user ID, place email or name only in person properties, identify returning authenticated sessions, and reset on logout or account switching.

## Error tracking

`src/components/DefaultCatchBoundary.tsx` now uses the shared `@posthog/react` client and calls `captureException(error)` once per distinct boundary error. This covers uncaught client route, render, and navigation errors handled by TanStack Router's global catch boundary. Server exception autocapture is enabled in the shared Node client. The run verified the instrumentation was added, but did not observe an error arriving in PostHog.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1919861)

The dashboard contains three saved insights: invoice creation trend, invoice payment trend, and an invoice creation-to-payment funnel. It is expected to remain empty until events are sent; the run did not verify incoming event data.

## Build and verification

The review ran `pnpm install` successfully with an up-to-date lockfile, then `pnpm build` successfully. The build included the Vite client build, SSR build, Nitro build, and `tsc --noEmit`. The only reported output concern was a non-failing Vite large-chunk warning. No lint script is defined in `package.json`.

This verifies compilation and build output only; it does not verify that analytics events or exceptions were delivered to PostHog. No build conflict was reported.

## Unresolved issues and costs

- **Analytics delivery is unconfirmed.** No run step observed either invoice event or an exception arrive in PostHog. Until confirmed, the dashboard may remain empty and downstream product analysis will lack data.
- **Stable user attribution is unavailable.** No authenticated identity exists, so invoice activity cannot currently be tied to a known person. Adding identity before a real auth boundary would misattribute records and risk PII exposure.
- **Server client is unused.** `src/utils/posthog-server.ts` is prepared for future API-route tracking, but using it now would duplicate or diverge from the active browser event contract.

## Before you merge

- [ ] Run a full production build and fix any lint or type errors introduced by the generated code; the run verified `pnpm build`, but the user should repeat this in the target environment.
- [ ] Run the test suite and update mocks or fixtures if the instrumented handlers require them; no test suite was run during this integration.
- [ ] Confirm `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` from `.env.example` are configured in every deployment environment, not only locally; inspect `.env.example` and the deployment/bootstrap configuration.
- [ ] Trigger successful invoice creation and payment, then confirm `invoice_created` and `invoice_marked_paid` arrive in PostHog; inspect the captures in `src/routes/posts.index.tsx` and `src/routes/posts.$postId.tsx`.
- [ ] Trigger a route/render error and confirm it appears in PostHog Error Tracking; inspect `src/components/DefaultCatchBoundary.tsx`.
- [ ] If authentication is introduced, add stable-user `identify` on login and returning sessions plus `reset` on logout; inspect the eventual auth boundary before associating events with people.
