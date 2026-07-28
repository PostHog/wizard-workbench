# PostHog setup report

PostHog product analytics, user identification, global Angular error tracking, and a starter dashboard were added to the Angular application.

## Installed and initialized

- Installed `posthog-js` `^1.407.5` with npm; `package-lock.json` resolves 1.407.5.
- Configured `NG_APP_POSTHOG_PROJECT_TOKEN` and `NG_APP_POSTHOG_HOST` in `.env`, documented the names in `.env.example`, and mapped them through `src/environments/environment.ts` and `src/environments/environment.prod.ts`.
- Added the singleton `PosthogService` at `src/app/@core/services/posthog.service.ts`. It uses Angular `inject()`, browser guards, one-time initialization, and a no-op client before initialization or when configuration is unavailable. `AppComponent` initializes it once.
- Default PostHog capture behavior remains enabled. No CSP changes were needed because no CSP was present in `src/index.html`.

## Instrumented events

The run verified that these capture calls were added at the corresponding successful user actions. The run did **not** observe events arriving in PostHog; the dashboard may therefore render empty until the application is exercised with a real browser session.

| Event | What it measures | File |
|---|---|---|
| `user_logged_in` | A user successfully authenticates | `src/app/auth/services/authentication.service.ts` |
| `user_logged_out` | An authenticated user signs out | `src/app/auth/logout/logout.component.ts` |
| `project_created` | A user creates a project | `src/app/shared/components/create-project-modal/create-project-modal.component.ts` |
| `team_member_added` | A user adds a team member and selects a role | `src/app/shared/components/add-member-modal/add-member-modal.component.ts` |
| `profile_updated` | A user saves valid profile changes | `src/app/pages/profile/profile.component.ts` |
| `language_changed` | A user selects a different language | `src/app/i18n/language-selector.component.ts` |
| `notification_preferences_saved` | A user saves notification preferences | `src/app/pages/settings/components/notification-settings/notification-settings.component.ts` |
| `user_preferences_saved` | A user saves display preferences | `src/app/pages/settings/components/preferences-settings/preferences-settings.component.ts` |
| `two_factor_authentication_toggled` | A user enables or disables two-factor authentication | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `session_revoked` | A user revokes an individual active session | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `other_sessions_revoked` | A user revokes all other active sessions | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |

## Identification

Identification is wired on successful login and again after PostHog initialization when persisted credentials are present on refresh. Logout calls `reset()` before credentials are cleared. Person properties, including email and display name, are sent through `identify()` rather than event properties.

**Unresolved issue:** the demo authentication flow creates a fresh UUID with `crypto.randomUUID()` for every login. The stable identifier currently used by `identify()` is therefore not stable across separate login sessions. Replace it with the backend-issued, persistent user primary key in `src/app/auth/services/authentication.service.ts` at the credential creation/login path, and ensure the persisted refresh path in `src/app/app.component.ts` receives that same identifier. If left unresolved, returning users can fragment across distinct IDs and dashboard attribution will be unreliable.

## Error tracking

`PosthogErrorHandler` was added to `src/app/@core/services/posthog.service.ts` and registered as Angular's global `ErrorHandler` in `src/app/app.config.ts`. It forwards uncaught `Error` instances through `captureException`, safely converting unknown thrown values. The run verified the wiring, but did not observe an error event arrive in PostHog.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1918777)

The dashboard contains five saved insights covering authentication activity, workspace creation activity, settings engagement, security actions, and the login-to-workspace-creation funnel. The insights use the captured event definitions and 30-day views, but their live data was not verified.

## Build and validation

- `npm install` passed.
- `npm run build` passed and produced `dist/angular-boilerplate`.
- `npm run lint` did not reach source linting: the existing `eslint.config.js` requires a missing `prettier` module (`Cannot find module 'prettier'`). This is outside the PostHog integration changeset.
- No tests were run.
- No event delivery, error delivery, or production deployment was observed by this run.

## Before you merge

- [ ] Run the full production build and resolve any integration-related type or build errors; the initialization and environment mappings are in `src/app/@core/services/posthog.service.ts`, `src/app/app.component.ts`, `src/environments/environment.ts`, and `src/environments/environment.prod.ts`.
- [ ] Run the test suite and update mocks or fixtures for the capture, identify, reset, and global error-handler calls in the files listed in the event table, `src/app/auth/services/authentication.service.ts`, `src/app/auth/logout/logout.component.ts`, and `src/app/app.config.ts`.
- [ ] Fix the pre-existing lint dependency issue by making `prettier` available to `eslint.config.js`, then rerun lint; the reported blocker was `Cannot find module 'prettier'`.
- [ ] Set `NG_APP_POSTHOG_PROJECT_TOKEN` and `NG_APP_POSTHOG_HOST` in every deploy environment, not only locally; the exact names are documented in `.env.example`.
- [ ] Replace the demo per-login UUID with the backend-issued persistent user ID in `src/app/auth/services/authentication.service.ts`, and verify the same ID is used on refresh in `src/app/app.component.ts`.
- [ ] Exercise login, logout, project creation, settings actions, and an uncaught-error path in a real browser session, then confirm the corresponding events and exception appear in PostHog; this run verified code and build only, not delivery.
