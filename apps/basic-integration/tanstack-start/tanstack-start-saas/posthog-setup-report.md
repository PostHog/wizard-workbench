# PostHog setup report

PostHog product analytics and error tracking were added to the TanStack Start invoice demo, with two invoice events and a starter dashboard.

## What was installed and initialized

- Installed `posthog-js` 1.407.5 with pnpm. `posthog-node` was initially installed but removed during review because no server-side routes were instrumented; `@posthog/react` was added for the required root provider.
- Added `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to the local environment through the wizard, and documented both names in `.env.example`.
- Client initialization is provided by `PostHogProvider` in `src/routes/__root.tsx`, using the shared configuration/export in `src/utils/posthog.ts`. Exception autocapture remains enabled.
- The configured environment values were confirmed present locally. Runtime delivery of events was not exercised, so event arrival in PostHog remains unconfirmed.

## Events instrumented

| Event | What it measures | File |
|---|---|---|
| `invoice_created` | A user successfully creates a new invoice from the invoice form. | `src/routes/posts.index.tsx` |
| `invoice_marked_paid` | A user successfully marks a pending invoice as paid. | `src/routes/posts.$postId.tsx` |

Both captures occur after the corresponding successful mutation and use non-PII invoice context. The event plan is recorded in `.posthog-wizard-cache/.posthog-events.json`.

## User identification

Identification was skipped. The app has no authentication, session, login, registration, logout, or current-user state, and the displayed directory records are external demo data rather than an app-owned identity boundary. Events therefore use the browser SDK's anonymous identity. No `identify()` or `reset()` lifecycle was added.

## Error tracking

`src/components/DefaultCatchBoundary.tsx` now calls `posthog.captureException(error)` from the global/default TanStack Router error boundary. Browser-level uncaught errors and unhandled rejections remain covered by `capture_exceptions: true` in the PostHog initialization. Error arrival was not observed at runtime.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1918368) contains the invoice-created volume, invoice activity over time, and invoice-payment conversion insights. The dashboard and insights were created successfully, but may currently have no event data; no captured event was observed during this run.

## Verification and unresolved points

- `pnpm install` completed successfully with the lockfile current.
- `pnpm build` completed successfully: Vite client, SSR, and Nitro builds passed, followed by `tsc --noEmit`.
- The only build output was a non-failing Vite large-chunk advisory; there was no build conflict reported.
- The run did not start the app, exercise invoice actions, trigger an error, or observe events arriving in PostHog. A passing build proves compilation only, not event delivery.
- No unresolved attribution or stable-ID placeholder was reported. The absence of authenticated identity remains intentional; adding auth later requires identifying with the authenticated user's stable primary key and resetting on logout.

## Next steps

1. Set `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` in every deployment environment, not only the local `.env`.
2. Run the app in a real browser, create an invoice, mark one paid, and trigger a representative error; verify `invoice_created`, `invoice_marked_paid`, and exception data arrive in project 483112.
3. Review the starter dashboard after data arrives and adjust its date range or breakdowns as needed.
4. If authentication is added, wire `identify()` at the successful login/registration and returning-session boundaries using an app-owned stable ID, and call `reset()` on logout.

## Before you merge

- [ ] Run the full production build and fix any lint or type errors introduced by the integration; the verified command was `pnpm build`, covering `vite build && tsc --noEmit`.
- [ ] Run the test suite and update mocks or fixtures for the captures in `src/routes/posts.index.tsx` and `src/routes/posts.$postId.tsx` if needed.
- [ ] Confirm `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` from `.env.example` are configured in each deploy environment.
- [ ] Load the app and exercise the successful invoice handlers in `src/routes/posts.index.tsx` and `src/routes/posts.$postId.tsx`, then verify both events arrive in PostHog.
- [ ] Trigger the global error boundary and verify the exception from `src/components/DefaultCatchBoundary.tsx` arrives in PostHog.
