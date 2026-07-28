# PostHog setup report

PostHog product analytics, exception autocapture, five event call sites, and a starter dashboard were added to the client-side TanStack Router app.

## Installed and initialized

- Installed `@posthog/react` 1.10.3 with pnpm; `package.json` and `pnpm-lock.yaml` were updated.
- PostHog is initialized once through `PostHogRoot` in `src/posthog.tsx`, using `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`.
- The wrapper is mounted around the code-based root route in `src/main.tsx`. Development reports missing configuration; production remains a no-op when configuration is unavailable.
- The configured environment keys were confirmed present in `.env`; their names are documented in `.env.example`.

## Events instrumented

These are event call sites recorded by the run. The run did not observe events arriving in PostHog, so they are **not confirmed captured**.

| Event | What it measures | File |
|---|---|---|
| `user_logged_in` | A visitor completes the demo sign-in flow. | `src/main.tsx` |
| `user_logged_out` | A signed-in visitor signs out. | `src/main.tsx` |
| `invoice_created` | An invoice is created successfully. | `src/main.tsx` |
| `invoice_updated` | An invoice update is saved successfully. | `src/main.tsx` |
| `subscription_upgrade_clicked` | A visitor expresses intent to upgrade from the free plan. | `src/main.tsx` |

Capture properties were limited to operational context (`invoice_id` and `current_plan`); no user-entered PII was added to event properties.

## Identification

User identification was skipped. The demo authentication state exposes only a mutable username, not a stable account ID, UUID, or resource identifier. No placeholder distinct ID was introduced. If a stable identifier becomes client-visible, wire `identify(stableId, ...)` after login and `reset()` on logout; until then, the instrumented events remain personless.

## Error tracking

Global exception autocapture is enabled with `capture_exceptions: true` in the shared PostHog initialization in `src/posthog.tsx`. No per-route exception wrappers were added.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1919858)

The dashboard contains four wizard-tagged insights: authentication activity, billing activity, upgrade intent, and sign-in-to-upgrade conversion. Definitions exist, but fresh insight results may be empty because the run did not observe live events.

## Verification and conflicts

The review step ran `pnpm install` successfully with an up-to-date lockfile and ran the production build (`vite build && tsc --noEmit`) successfully after adding `types: ["vite/client"]` to `tsconfig.json` for `import.meta.env` typing. Vite emitted only its existing non-failing chunk-size advisory. No lint script is defined.

The full build-related conflict/warning was that pnpm reported `core-js` and `esbuild` build scripts were ignored by the package-manager approval policy. The build nevertheless completed successfully. The earlier build attempt failed only because `import.meta.env` lacked Vite client declarations; adding `vite/client` to `tsconfig.json` resolved those TypeScript errors.

No CSP was present in the inspected app files, so no CSP changes were made. No event delivery, exception delivery, or runtime PostHog behavior was observed during this run.

## Before you merge

- [ ] Run the full production build (`pnpm build`) and fix any lint or type errors introduced by the integration; review `src/posthog.tsx`, `src/main.tsx`, and `tsconfig.json`.
- [ ] Run the test suite, if one is added or available in CI, and update mocks or fixtures for the capture call sites in `src/main.tsx`.
- [ ] Set `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` in every deployment environment, not only local `.env`; verify the exact names in `.env.example`.
- [ ] Exercise sign-in, sign-out, invoice creation, invoice update, and upgrade intent in a deployed build, then confirm the five event names arrive in PostHog and populate the dashboard.
- [ ] If authentication gains a stable account identifier, add `identify` on successful login and `reset` on logout in the authentication handlers in `src/main.tsx`; do not use the mutable username as the distinct ID.
