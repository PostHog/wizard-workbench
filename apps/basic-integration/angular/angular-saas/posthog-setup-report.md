# PostHog setup report

PostHog product analytics, authenticated user identity, browser exception tracking, ten application events, and a starter dashboard were added to the Angular app.

## What was installed and initialized

- Installed `posthog-js` at `^1.407.2` with npm; `package.json` and `package-lock.json` were updated.
- Added the singleton `PosthogService` in `src/app/@core/services/posthog.service.ts`. It browser-guards the SDK, initializes PostHog once from the Angular environment mappings, uses `NG_APP_POSTHOG_PROJECT_TOKEN` and `NG_APP_POSTHOG_HOST`, and enables `capture_exceptions: true`.
- Added the environment mappings in `src/environments/environment.ts` and `src/environments/environment.prod.ts`, documented the keys in `.env.example`, and configured the real local values in `.env` through the wizard tools. The environment keys were confirmed present; their values are intentionally not reproduced here.
- Initialized the singleton from `src/app/app.component.ts`. No CSP policy was found in the inspected project files, so no CSP change was needed.

## Instrumented events

These are planned and instrumented events. The run did **not** observe any event arriving in PostHog, so capture should be treated as unconfirmed until the app is exercised and the events are checked in PostHog.

| Event | What it measures | File |
|---|---|---|
| `user_logged_in` | An authenticated user completes the login flow. | `src/app/auth/services/authentication.service.ts` |
| `user_logged_out` | An authenticated user completes logout before analytics identity is reset. | `src/app/auth/logout/logout.component.ts` |
| `project_created` | An authenticated user creates a project, segmented by selected status. | `src/app/shared/components/create-project-modal/create-project-modal.component.ts` |
| `team_member_added` | An authenticated user adds a team member, segmented by assigned role. | `src/app/shared/components/add-member-modal/add-member-modal.component.ts` |
| `account_settings_saved` | An authenticated user saves account settings. | `src/app/pages/settings/components/account-settings/account-settings.component.ts` |
| `notification_preferences_saved` | An authenticated user saves notification preferences. | `src/app/pages/settings/components/notification-settings/notification-settings.component.ts` |
| `preferences_saved` | An authenticated user saves display and application preferences. | `src/app/pages/settings/components/preferences-settings/preferences-settings.component.ts` |
| `two_factor_authentication_toggled` | An authenticated user enables or disables two-factor authentication, including enabled state. | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `security_session_revoked` | An authenticated user revokes an individual active session. | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `other_security_sessions_revoked` | An authenticated user revokes all other active sessions. | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |

## User identification

Identification is wired. Successful login and persisted-session restoration call `identify()` with `credentials.id`; person properties include email, full name, and primary role. Logout captures `user_logged_out`, then calls `reset()` before credentials are cleared.

The demo authentication currently generates a new `crypto.randomUUID()` on each login. This means identity is stable for that login/session but is not a persistent account identifier across separate logins. Replace it with the persistent backend account primary key before relying on cross-session user analysis.

## Error tracking

A global Angular `PosthogErrorHandler` was added and registered in `src/app/app.config.ts`. Uncaught Angular errors are routed through `client.captureException()`. Browser exception capture is enabled during singleton initialization. The run verified the source wiring but did not trigger an error or observe an exception event in PostHog.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1902574)

The dashboard contains four saved 30-day trend insights: Authentication activity, Product activation, Settings adoption, and Security controls usage. The dashboard and insight definitions were created successfully, but their data population was not observed during this run.

## Verification and unresolved issues

- `npm install` completed successfully with the dependency graph up to date.
- `npm run build` completed successfully and generated the Angular production bundle. This verifies compilation only; it does not prove that events flow over the network.
- `npm run lint` could not initialize because the existing ESLint configuration imports an undeclared `prettier` module. This is a pre-existing tooling conflict, not an integration-source failure; lint did not reach source analysis.
- Existing npm audit findings (59 vulnerabilities reported during installation) and pending allow-scripts warnings were not changed.
- No runtime event delivery, identity attribution, or exception delivery was observed. Leaving that unverified costs confidence that the dashboard will populate and that events will be attributed to the intended users.
- Billing, quick-action upload/report entries, and account deletion remain intentionally uninstrumented because the inspected UI did not expose implemented user-action handlers.

## Next steps

1. Configure `NG_APP_POSTHOG_PROJECT_TOKEN` and `NG_APP_POSTHOG_HOST` in every deployment environment, not only the local `.env`; keep the exact names documented in `.env.example`.
2. Replace the demo-generated login ID with the persistent backend account ID in `src/app/auth/services/authentication.service.ts` before using identity-based retention or conversion analysis.
3. Exercise login, logout, project creation, member addition, settings saves, two-factor changes, and session revocation in a real browser, then confirm all ten event names and their properties appear in PostHog.
4. Trigger a controlled uncaught Angular error and verify the exception appears in PostHog with the expected authenticated or anonymous context.
5. Decide whether to add the missing `prettier` dependency/configuration for the existing ESLint setup, then rerun lint.

## Before you merge

- [ ] Run a full production build and fix any lint or type errors introduced by the integration; the build passed, but lint is currently blocked by the existing missing `prettier` dependency.
- [ ] Run the test suite and update mocks or fixtures for the instrumented call sites if needed.
- [ ] Confirm `NG_APP_POSTHOG_PROJECT_TOKEN` and `NG_APP_POSTHOG_HOST` from `.env.example` are set in deployment environments; review the mappings in `src/environments/environment.ts` and `src/environments/environment.prod.ts`.
- [ ] If authentication is changed to use a backend account ID, recheck the login identify call in `src/app/auth/services/authentication.service.ts:47` and persisted-session identify in `src/app/app.component.ts:80`.
- [ ] Load the app in a real browser and verify the ten events arrive in PostHog; inspect the capture call sites in `src/app/auth/services/authentication.service.ts:52`, `src/app/auth/logout/logout.component.ts:28`, `src/app/shared/components/create-project-modal/create-project-modal.component.ts:143`, `src/app/shared/components/add-member-modal/add-member-modal.component.ts:202`, `src/app/pages/settings/components/account-settings/account-settings.component.ts:218`, `src/app/pages/settings/components/notification-settings/notification-settings.component.ts:230`, `src/app/pages/settings/components/preferences-settings/preferences-settings.component.ts:249`, and `src/app/pages/settings/components/security-settings/security-settings.component.ts:305-319`.
- [ ] Trigger and verify global exception delivery through `src/app/@core/services/posthog.service.ts:56` and its registration in `src/app/app.config.ts:21`.
