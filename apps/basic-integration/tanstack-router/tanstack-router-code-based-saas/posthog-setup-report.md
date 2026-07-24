# PostHog setup report

PostHog browser analytics was installed and initialized for the TanStack Router app, with four anonymous product events, global exception capture, and a starter dashboard.

## What was installed and initialized

- Added `@posthog/react` version `1.10.3` with pnpm; `package.json` and `pnpm-lock.yaml` were updated.
- Added a guarded `PostHogProvider` in `src/main.tsx` (the code-based root route). It reads `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`, initializes only when both are present, and wraps the application. Development throws the required actionable missing-variable error; production renders the app without analytics when configuration is absent.
- Added the required environment variable names to `.env.example` and configured the real values in the local `.env` using the wizard environment tooling. The real values are not reproduced in this report.
- Added Vite client ambient types in `tsconfig.json` so `import.meta.env` typechecks.

## Events instrumented

These capture calls were added to `src/main.tsx`. The run did not exercise the application or observe any event arriving in PostHog, so these are instrumented events, not verified deliveries.

| Event | What it measures | File |
|---|---|---|
| `user_logged_in` | A visitor submits the demo sign-in flow successfully. | `src/main.tsx` (line 1141) |
| `user_logged_out` | A signed-in visitor explicitly signs out. | `src/main.tsx` (lines 1103 and 1177) |
| `invoice_created` | A new invoice mutation completes successfully. | `src/main.tsx` (line 462) |
| `invoice_updated` | An existing invoice mutation completes successfully. | `src/main.tsx` (line 551) |

Invoice events include only the non-PII numeric `invoice_id` property. Usernames, emails, invoice titles, descriptions, notes, and other user-entered content are not sent as event properties.

## Identification status

User identification was **skipped**. The demo auth model contains only a mutable `username`; the run could not establish a stable backend-issued, non-PII user identifier. The username and derived email therefore were not used as PostHog distinct IDs. Events currently use the SDK's anonymous browser identity. If authentication later exposes a stable user ID, wire `identify()` once on successful login and for a persisted authenticated session, and call `reset()` on logout.

### Unresolved issue

Attribution remains unresolved because no stable authenticated identifier reaches the login/logout boundary in the current demo. If left unchanged, the four events cannot reliably be attributed to backend users across sessions or devices. The affected auth and capture call sites are in `src/main.tsx` (login capture around line 1141 and logout captures around lines 1103 and 1177); these currently have no placeholder distinct ID, but need revisiting when a real user ID is available.

## Error tracking

Global browser exception tracking was enabled with `capture_exceptions: true` on the root `PostHogProvider` in `src/main.tsx` (line 153). This configures SDK-level capture for uncaught exceptions and unhandled promise rejections. The run did not trigger an exception or observe an error event in PostHog, so delivery is unconfirmed.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1902696)

The dashboard contains four saved insights: authentication activity, invoice creation volume, invoice editing broken down by `invoice_id`, and a login-to-invoice-creation funnel. The definitions use the exact event names above and were created before event delivery was observed.

## Verification and limitations

- `pnpm install` completed successfully and dependencies were synchronized with the lockfile.
- `pnpm build` completed successfully after the TypeScript configuration fix. This verifies compilation and typechecking only; it does **not** verify that PostHog initializes in a browser or that events reach PostHog.
- No event delivery, exception delivery, browser startup, or end-to-end interaction was observed during the run.
- No lint script is defined in `package.json`, so linting was not run.
- The final build emitted only a pre-existing, non-failing Vite chunk-size warning.

## Build conflict

The first `pnpm build` reached successful Vite compilation but failed TypeScript because `import.meta.env` lacked Vite's `ImportMeta` ambient types at the PostHog initialization lines. The review step resolved this integration-caused conflict by adding `types: ["vite/client"]` to `tsconfig.json`. A subsequent `pnpm build` completed successfully (`vite build && tsc --noEmit`). No other build conflict was reported. The ignored pnpm dependency build-script warning was an environment/package-manager policy notice and did not prevent installation or the successful build.

## Next steps

1. Set `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` in every deployment environment, not only the local `.env`; keep the names aligned with `.env.example`.
2. Add a stable backend-issued user ID to the auth model, then wire `identify()` on login and persisted-session restoration and `reset()` on logout in `src/main.tsx`.
3. Run the app in a real browser, complete login/logout and invoice create/update flows, and confirm the four event names arrive in PostHog. Also trigger a representative uncaught exception to confirm error delivery.
4. Review the dashboard after events arrive; until then, its charts and funnel are configured but unpopulated or unverified.

## Before you merge

- [ ] Run the full production build and fix any lint or type errors introduced by the integration; the run verified `pnpm build` successfully, but no lint script exists.
- [ ] Run the test suite; instrumented call sites may require updated mocks or fixtures. No test command was run during this integration.
- [ ] Confirm `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` from `.env.example` are configured in each deployment environment, not just `.env`.
- [ ] Because the app ships minified browser bundles, wire source-map upload into CI if production stack traces need de-minification; see [PostHog source maps documentation](https://posthog.com/docs/error-tracking sourcemaps).
- [ ] Exercise login, logout, invoice creation, invoice editing, and an uncaught exception in a browser, then confirm the corresponding events/errors arrive in PostHog; the build alone cannot prove delivery.
