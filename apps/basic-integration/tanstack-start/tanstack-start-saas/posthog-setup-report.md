# PostHog setup report

PostHog was added to the TanStack Start invoicing app with browser capture, exception tracking, two invoice lifecycle events, and a starter dashboard.

## Installed and initialized

- Installed `@posthog/react` 1.10.3 and `posthog-node` 5.46.1 with pnpm; both are recorded in `package.json` and `pnpm-lock.yaml`.
- Initialized the browser SDK once in `src/routes/__root.tsx` with `PostHogProvider`.
- The provider reads `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`; the real values were configured in `.env`, and the variable names are documented in `.env.example`.
- Exception capture, development debug logging, and tracing headers are enabled. A development-time guard reports missing configuration; production renders without the provider if configuration is absent.
- `posthog-node` is installed but unused: the implemented instrumentation uses browser-side successful UI actions rather than server API events.

## Events instrumented

| Event | What it measures | File |
|---|---|---|
| `invoice_created` | A user successfully creates a new invoice from the invoice form; includes non-PII `invoice_id` and `amount`. | `src/routes/posts.index.tsx` |
| `invoice_marked_paid` | A user successfully marks an invoice as paid from its detail page; includes non-PII `invoice_id` and `amount`. | `src/routes/posts.$postId.tsx` |

Both captures occur after their corresponding server function succeeds. The run did not observe either event arriving in PostHog, so delivery and event volume remain unconfirmed.

## User identification

Identification was skipped. The app has no authentication, session, login, registration, logout, or app-owned current-user state; its user screens consume JSONPlaceholder directory data. Events therefore remain personless and use PostHog's anonymous browser identity. Do not identify those directory records. When real authentication exists, identify after successful login or registration with the authenticated primary key and reset on logout.

## Error tracking

- `src/routes/__root.tsx` enables SDK exception capture.
- `src/components/DefaultCatchBoundary.tsx` calls `posthog.captureException(error)` from an effect in the global TanStack Router error boundary, centralizing route/component error reporting.
- No server-side API error handler was instrumented.
- Error delivery was not browser-exercised, so arrival in PostHog Error Tracking is unconfirmed.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1924818) contains invoice creation and paid-invoice trends plus an invoice creation-to-payment funnel. The dashboard and insight definitions were created successfully, but the run did not require the underlying events to have been observed.

## Verification and unresolved issues

- `pnpm install` completed and reported the lockfile current.
- `pnpm build` passed, including Vite client/SSR/Nitro builds and `tsc --noEmit`.
- The only build output noted was Vite's non-failing advisory about a chunk larger than 500 kB. No build conflict was reported.
- No lint script exists in `package.json`, and no test suite or browser flow was run.
- Attribution remains unresolved: there is no stable authenticated user ID. If left unresolved, invoice events and exceptions cannot be tied to a known account across anonymous sessions.

## Next steps

1. Set `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` in every deployment environment, not only local `.env`.
2. Exercise invoice creation, marking an invoice paid, and an error boundary in a deployed or local browser session; confirm the corresponding events and exception arrive in PostHog.
3. Add identify/reset at the future authentication boundary using the app's stable account key; do not use JSONPlaceholder records.
4. Run the test suite and address any mocks or fixtures affected by the new capture calls.
5. Consider source-map upload in CI if production browser bundles are minified and de-minified stack traces are required.

## Before you merge

- [ ] Run a full production build and fix any lint or type errors introduced by the integration; the recorded build passed, but no lint script exists.
- [ ] Run the test suite and update mocks or fixtures for the instrumented invoice handlers.
- [ ] Confirm `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` from `.env.example` are set in deployment environments, not just local `.env` (`src/routes/__root.tsx:50-51`).
- [ ] Trigger invoice creation and payment in a browser and confirm `invoice_created` and `invoice_marked_paid` arrive in PostHog (`src/routes/posts.index.tsx` and `src/routes/posts.$postId.tsx`).
- [ ] If production browser bundles are minified, wire source-map upload into CI so error stack traces de-minify; see https://posthog.com/docs/error-tracking/upload-source-maps.
- [ ] When authentication is added, verify returning sessions call identify with the stable authenticated key and logout resets the identity; the current app has no auth boundary (`src/routes/__root.tsx`).
