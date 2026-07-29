# PostHog setup report

PostHog was added to the client-side TanStack Router app with anonymous product-event capture, global exception capture, and a starter analytics dashboard.

## Installed and initialized

- Installed `@posthog/react` 1.10.3 with pnpm; `package.json` and `pnpm-lock.yaml` were updated.
- `src/main.tsx:150-155` mounts the existing app under `PostHogProvider`, using `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` from the Vite environment.
- The provider enables `capture_exceptions: true` for uncaught browser errors and promise exceptions.
- `.env.example` documents both required configuration names. The real values are present in the local `.env`; their values were not read back into the run record.
- No CSP changes were needed because no Content-Security-Policy was present in the reviewed changeset.

## Events instrumented

These five events were added to `src/main.tsx`. The run verified that the capture calls and event plan exist in source; it did **not** run the app or observe events arriving in PostHog.

| Event | What it measures | File |
|---|---|---|
| `invoice_created` | A new invoice is successfully created from the invoices workspace. | `src/main.tsx:462` |
| `invoice_updated` | An existing invoice is successfully saved after edits. | `src/main.tsx:550` |
| `user_signed_in` | A visitor submits the demo sign-in form successfully. | `src/main.tsx:1142` |
| `user_signed_out` | A signed-in visitor explicitly signs out from the account interface. | `src/main.tsx:1104` and `src/main.tsx:1178` |
| `subscription_upgrade_started` | A visitor starts the subscription upgrade flow from account settings. | `src/main.tsx:1084` |

Invoice events include only non-PII invoice identifiers. No user-entered usernames, names, contact information, or invoice content is sent as event properties.

## Identification status

User identification was **skipped**. The demo authentication flow only stores a mutable, user-entered username in process memory and provides no stable, non-PII authenticated identifier, persisted session identity, or user record for the signed-in actor. Captures therefore use the anonymous browser distinct ID. `identify()` and logout `reset()` should be added only when a stable authenticated ID exists.

### Follow-up issue: unresolved attribution

Attribution remains unresolved for every event in `src/main.tsx:462`, `550`, `1084`, `1104`, `1142`, and `1178`: no stable authenticated actor ID is available. Leaving this unresolved means events cannot reliably be tied to a user across anonymous sessions or authenticated activity. The displayed username must not be substituted for that ID because it is mutable user-entered data.

## Error tracking

No additional source change was needed. The root provider in `src/main.tsx:150-153` already sets `capture_exceptions: true`, enabling the SDK's global uncaught-error and unhandled-promise-exception mechanism. The run confirmed this configuration in source, but did not trigger an exception or observe an error event in PostHog.

## Dashboard

[DASHBOARD_URL] https://us.posthog.com/project/483112/dashboard/1926655

`Analytics basics (wizard)` contains four tagged insights for invoice activity, sign-in-to-upgrade conversion, subscription upgrades, and authentication activity. The dashboard was created successfully, but is expected to remain empty until the application emits events; ingestion was not verified during this run.

## Verification and build conflict

- `pnpm install` completed successfully and confirmed the lockfile was current.
- `pnpm build` completed successfully: Vite built 143 modules and TypeScript `--noEmit` passed after adding `vite/client` to `tsconfig.json`.
- The successful build emitted a non-blocking Vite warning that the generated main chunk exceeds 500 kB. This is the only reported build conflict; it did not fail the build.
- No separate lint or test script was run or available in `package.json`.
- A passing build proves the code compiles; it does not prove that PostHog events flow. No event arrival, exception arrival, or end-to-end browser verification was observed.

## Before you merge

- [ ] Run the full production build again and fix any lint or type errors introduced by the integration; the last recorded build passed, with only the non-blocking chunk-size warning (`tsconfig.json:10`, `src/main.tsx:150-155`).
- [ ] Run the test suite (or add/run one if the project has no test script), including the instrumented invoice, sign-in, sign-out, and upgrade paths in `src/main.tsx:462`, `550`, `1084`, `1104`, `1142`, and `1178`.
- [ ] Confirm `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` from `.env.example:1-2` are configured in every deployment environment, not only in the local `.env`.
- [ ] Load the deployed app and trigger each instrumented path, then confirm the five named events appear in PostHog and populate the dashboard; this was not verified by the run.
- [ ] Provide a stable, non-PII authenticated user ID at the auth boundary before adding `identify()` and `reset()`; until then, review the anonymous call sites at `src/main.tsx:462`, `550`, `1084`, `1104`, `1142`, and `1178`.
