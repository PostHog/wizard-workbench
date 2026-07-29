# PostHog setup report

PostHog product analytics, authenticated-user attribution, global Angular error capture, and a starter dashboard were added to this Angular application.

## What was installed and initialized

- Installed `posthog-js` `^1.407.8` with npm; `package.json` and `package-lock.json` were updated.
- Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` configuration through the environment files and documented the names in `.env.example`.
- Added the singleton SSR-safe `PosthogService` at `src/app/@core/services/posthog.service.ts` and initialized it once from `src/app/app.component.ts` in the browser using the configured environment values. Missing configuration is loud in development and a no-op in production.
- PostHog defaults remain enabled, including autocapture and session recording. No event delivery was observed during this run.

## Events instrumented

These are instrumented call sites, not events verified as received by PostHog. The run did not exercise the application or observe any event arrive.

| Event | What it measures | File |
|---|---|---|
| `user_logged_in` | Successful completion of the login flow | `src/app/auth/services/authentication.service.ts` |
| `user_logged_out` | Successful authenticated logout before identity reset | `src/app/auth/logout/logout.component.ts` |
| `project_created` | Project creation from the dashboard modal | `src/app/shared/components/create-project-modal/create-project-modal.component.ts` |
| `team_member_added` | Adding a team member, segmented by selected role | `src/app/shared/components/add-member-modal/add-member-modal.component.ts` |
| `profile_updated` | Submission of a valid profile update | `src/app/pages/profile/profile.component.ts` |
| `account_settings_saved` | Saving account settings | `src/app/pages/settings/components/account-settings/account-settings.component.ts` |
| `notification_preferences_saved` | Saving notification preferences | `src/app/pages/settings/components/notification-settings/notification-settings.component.ts` |
| `preferences_saved` | Saving display and application preferences | `src/app/pages/settings/components/preferences-settings/preferences-settings.component.ts` |
| `two_factor_authentication_toggled` | Enabling or disabling two-factor authentication | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `session_revoked` | Revoking one or all other active sessions | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |

## Identity and error tracking

User identification is wired. Successful login calls `identify()` with the app credential ID, and `src/app/app.component.ts` identifies an already persisted user after initialization on refresh. Logout resets the client only after successful authenticated logout. Email, full name, and role are sent as person properties rather than event properties.

The demo login currently generates a new UUID on each login. A production backend should return a persistent user ID if cross-session continuity is required.

Global Angular error tracking was added through `PosthogErrorHandler` in `src/app/@core/services/posthog.service.ts`, registered as the application-wide `ErrorHandler` in `src/app/app.config.ts`. It calls `captureException` for Error and non-Error failures while preserving console logging. Error delivery was not observed during this run.

## Dashboard

[Open Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1924553)

The dashboard contains five tagged insights covering login trend, workspace collaboration, login-to-project conversion, account/preferences updates, and security activity. The insights intentionally may be empty until real users trigger the instrumented paths.

## Verified versus unconfirmed

- **Verified:** npm installation completed; the production Angular build passed; the source wiring, event names, identity boundaries, and error-handler registration were reviewed; the configured environment keys are present; the dashboard and five insight tiles were created.
- **Unconfirmed:** No browser run or network observation verified that events or exceptions reach PostHog. No tests were run. The app does not contain a CSP configuration to check. Build success proves the code compiles, not that analytics data flows.

## Build and tooling conflict

`npm run build` passed and generated the Angular production bundle. `npm run lint` could not start: the pre-existing `eslint.config.js` requires `prettier`, but `prettier` is absent from the manifest/dependencies. This is outside the PostHog changes and prevented lint from running. npm also reported 59 audit vulnerabilities; none were changed in this integration.

## Before you merge

- [ ] Run a full production build and fix any lint or type errors introduced by the generated integration; `npm run lint` currently requires the pre-existing missing `prettier` dependency referenced by `eslint.config.js`.
- [ ] Run the test suite and update mocks or fixtures for the instrumented call sites, especially the handlers in the files listed above.
- [ ] Confirm `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` are present with the exact names documented in `.env.example` and configured in every deployment environment, not only locally; review `src/environments/environment.ts` and `src/environments/environment.prod.ts`.
- [ ] Exercise login, refresh, logout, and each instrumented action in a real browser, then confirm the ten events and exception captures arrive in PostHog; the run itself did not verify delivery.
- [ ] Confirm the production authentication flow returns a persistent user ID before relying on cross-session attribution; review `src/app/auth/services/authentication.service.ts` and `src/app/app.component.ts`.
