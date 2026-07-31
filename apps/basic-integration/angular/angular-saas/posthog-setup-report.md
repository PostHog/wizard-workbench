# PostHog setup report

PostHog product analytics, authenticated-user attribution, Angular error tracking, and a starter dashboard were added to the Angular application.

## What was set up

- **SDK:** Installed `posthog-js` `^1.409.5` with npm, updating `package.json` and `package-lock.json`.
- **Initialization:** Added the singleton `PosthogService` at `src/app/@core/services/posthog.service.ts`, initialized once from `src/app/app.component.ts` using the environment-backed `NG_APP_POSTHOG_PROJECT_TOKEN` and `NG_APP_POSTHOG_HOST` configuration exposed through the Angular environment bridge. Browser-safe no-op behavior is retained for non-browser or pre-initialization use; development reports missing configuration while production remains a no-op.
- **Identity:** `identify()` runs after successful login and after restoring persisted credentials on refresh; `reset()` runs on logout. Person properties are kept on identification rather than event properties. The current demo generates a UUID client-side; production authentication should provide a durable server-issued user ID in `Credentials.id`.
- **Error tracking:** Angular's application-wide `ErrorHandler` forwards uncaught errors through `captureException` while preserving console logging (`src/app/@core/services/posthog.service.ts`, registered in `src/app/app.config.ts`).
- **Dashboard:** [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1935567) with four saved insights for logins, project/team growth, settings changes, and login-to-project activation.

## Events instrumented

The run verified that these 12 event names have capture calls at real submit, save, toggle, revoke, or selection handlers. The run did **not** exercise a production browser session or observe events arriving in PostHog, so delivery and ingestion remain unconfirmed.

| Event | What it measures | File |
|---|---|---|
| `user_logged_in` | A user successfully completes the demo login flow. | `src/app/auth/services/authentication.service.ts` |
| `user_logged_out` | An authenticated user ends their session. | `src/app/auth/services/authentication.service.ts` |
| `project_created` | A user creates a project from the dashboard modal. | `src/app/shared/components/create-project-modal/create-project-modal.component.ts` |
| `team_member_added` | A user adds a team member from the dashboard modal. | `src/app/shared/components/add-member-modal/add-member-modal.component.ts` |
| `profile_updated` | A user saves changes to their profile. | `src/app/pages/profile/profile.component.ts` |
| `account_settings_saved` | A user saves their account settings. | `src/app/pages/settings/components/account-settings/account-settings.component.ts` |
| `notification_preferences_saved` | A user saves notification preference changes. | `src/app/pages/settings/components/notification-settings/notification-settings.component.ts` |
| `app_preferences_saved` | A user saves application display preferences. | `src/app/pages/settings/components/preferences-settings/preferences-settings.component.ts` |
| `two_factor_authentication_changed` | A user enables or disables two-factor authentication. | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `session_revoked` | A user revokes one other active session. | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `other_sessions_revoked` | A user revokes all other active sessions. | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `language_changed` | A user selects a different application language. | `src/app/i18n/language-selector.component.ts` |

Event properties were limited to action state and exclude submitted PII, project names/descriptions, passwords, and session/location details. Incomplete or placeholder actions such as billing selection and account deletion were intentionally not instrumented.

## Verified versus unconfirmed

### Verified by the run

- `npm install` completed successfully and dependencies were current.
- `npm run build` completed successfully and produced the Angular application bundle.
- The integration review found no required fixes and preserved unrelated behavior.
- The dashboard and four tagged insights were created successfully in project `483112`.
- No Content-Security-Policy was present in `src/index.html`, so no CSP change was required.

### Not verified

- No production browser session was exercised, so no event was observed arriving in PostHog.
- The dashboard may remain empty until the application emits events.
- Lint did not run: `npm run lint` stopped before linting because the existing ESLint configuration requires a missing `prettier` dependency. This is an existing project dependency conflict, unrelated to the PostHog changes.

## Issues to follow up

1. **Stable identity is unresolved for production.** The demo creates a new client-side UUID during login; replace this with the durable server-issued user ID in `Credentials.id` in `src/app/auth/services/authentication.service.ts` (the UUID assignment and the identify call) before relying on longitudinal user attribution. Leaving it unchanged can fragment one real user across distinct IDs after a new login.
2. **Lint dependency is unresolved.** The existing `eslint.config.js` references `prettier`, but it is absent from project dependencies. Until resolved, lint cannot confirm the integration or the rest of the project.
3. **Event delivery is unresolved.** A browser login and representative actions still need to be exercised, and arrivals checked in PostHog; a passing build only proves compilation.

## Before you merge

- [ ] Run a full production build and fix any lint or type errors introduced by the generated integration; inspect `src/app/@core/services/posthog.service.ts`, `src/app/app.component.ts`, and `src/app/app.config.ts`.
- [ ] Run the test suite and update mocks or fixtures for the instrumented call sites, especially the files listed in the events table.
- [ ] Set `NG_APP_POSTHOG_PROJECT_TOKEN` and `NG_APP_POSTHOG_HOST` in every deploy environment, not only local `.env`; verify the names in `.env.example` and the Angular environment/bootstrap configuration.
- [ ] If authentication is expected to persist across real accounts, replace the demo UUID identity with the server-issued stable ID in `src/app/auth/services/authentication.service.ts`.
- [ ] Exercise login, logout, project creation, settings changes, security actions, and language selection in a real browser, then confirm the corresponding events arrive in PostHog and populate the dashboard.
