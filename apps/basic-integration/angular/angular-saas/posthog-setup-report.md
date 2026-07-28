# PostHog setup report

PostHog product analytics, authenticated-user identification, centralized Angular error tracking, and a starter dashboard were added to the Angular application.

## Installed and initialized

- Installed `posthog-js` `^1.407.5` with npm; `package.json` and `package-lock.json` were updated.
- Added `NG_APP_POSTHOG_PROJECT_TOKEN` and `NG_APP_POSTHOG_HOST` to `.env.example`; the configured environment keys were also present locally.
- Added the singleton `PosthogService` at `src/app/@core/services/posthog.service.ts`.
- Initialized PostHog once from `src/app/app.component.ts`, using the environment-backed configuration and browser guards. Missing configuration is development-visible and production-safe no-op behavior.
- The SDK's default capture behavior was retained. No CSP changes were needed because the application has no CSP in `index.html`.

## Events instrumented

These ten event contracts were added and wired at the listed call sites:

| Event | What it measures | File |
|---|---|---|
| `user_logged_in` | An authenticated user completes a successful login. | `src/app/auth/services/authentication.service.ts` |
| `user_logged_out` | An authenticated user initiates logout before analytics identity is reset. | `src/app/auth/logout/logout.component.ts` |
| `project_created` | An authenticated user creates a project, segmented by selected project status. | `src/app/shared/components/create-project-modal/create-project-modal.component.ts` |
| `team_member_added` | An authenticated user adds a team member, segmented by assigned role. | `src/app/shared/components/add-member-modal/add-member-modal.component.ts` |
| `account_settings_saved` | An authenticated user saves account settings. | `src/app/pages/settings/components/account-settings/account-settings.component.ts` |
| `notification_preferences_saved` | An authenticated user saves notification preferences. | `src/app/pages/settings/components/notification-settings/notification-settings.component.ts` |
| `preferences_saved` | An authenticated user saves application preferences. | `src/app/pages/settings/components/preferences-settings/preferences-settings.component.ts` |
| `two_factor_authentication_toggled` | An authenticated user enables or disables two-factor authentication. | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `session_revoked` | An authenticated user revokes a non-current active session. | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `all_other_sessions_revoked` | An authenticated user revokes every non-current active session. | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |

The run verified that the ten capture calls exist in their action handlers and that the event manifest contains the corresponding names, descriptions, and source paths. It did **not** observe events arriving in PostHog, so event delivery and populated insight data remain unconfirmed.

## User identification

Identification was wired. Successful login calls `identify` with the generated credential `id`, and person properties contain email, name, username, and roles rather than event properties. Existing persisted credentials are identified again after PostHog initialization on refresh. Logout captures `user_logged_out` before calling `reset`.

The stable identifier assumption is the demo authentication flow's `Credentials.id`. If production authentication replaces this flow, `Credentials.id` must remain the backend's stable user primary key; otherwise event attribution can fragment.

## Error tracking

A global Angular `ErrorHandler` was added at `src/app/@core/services/posthog-error-handler.ts` and registered in `src/app/app.config.ts`. It forwards unhandled errors through `captureException` on the shared PostHog client. The run verified the handler and provider wiring, but did not trigger an exception or observe an error arriving in PostHog.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1918220)

The dashboard has five live insight tiles covering authentication activity, workspace creation and membership, settings engagement, project creation by status, and the login-to-project-creation funnel. The definitions use the exact captured event names. The dashboard may remain empty until the application sends events; this run did not verify incoming data.

## Verification and conflicts

- `npm install` completed successfully with dependencies up to date.
- `npm run build` completed successfully with Angular application bundle generation. This proves the application builds; it does not prove that events flow to PostHog.
- No test suite was run.
- `npm run lint` failed before linting because `eslint.config.js` could not resolve the pre-existing missing dependency `prettier`. This is the full known build-quality conflict: `npm run lint` fails because `eslint.config.js` cannot resolve pre-existing missing dependency `prettier`; the production build passes. The integration changes did not modify ESLint configuration or add/remove Prettier.

## Before you merge

- [ ] Run the full production build again and inspect the PostHog initialization and capture call sites in `src/app/@core/services/posthog.service.ts` and the instrumented action handlers; fix any integration-generated type or build errors.
- [ ] Run the test suite and update mocks or fixtures for the PostHog service and capture calls in the instrumented component and authentication files.
- [ ] Verify `NG_APP_POSTHOG_PROJECT_TOKEN` and `NG_APP_POSTHOG_HOST` from `.env.example` are configured in every deployment environment, not only local `.env`.
- [ ] Replace the demo identity assumption by checking the `Credentials.id` value at the login and refresh identify call sites in `src/app/auth/services/authentication.service.ts` and `src/app/app.component.ts`; it must be a stable backend user ID in production.
- [ ] Exercise login, logout, project/member creation, settings/security actions, and an unhandled exception, then confirm the corresponding events and exception arrive in PostHog; the run only verified source wiring, not delivery.
- [ ] Resolve the existing lint prerequisite at `eslint.config.js` (the missing `prettier` dependency) before relying on `npm run lint`.
