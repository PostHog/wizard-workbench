# PostHog setup report

PostHog product analytics, authenticated user identification, Angular error tracking, and a starter dashboard were added to this Angular application.

## Installed and initialized

- Installed `posthog-js` `^1.407.3` with npm; the resolved package is `1.407.3` in `package-lock.json`.
- Added the singleton `PosthogService` at `src/app/@core/services/posthog.service.ts`. It is browser-guarded, initializes once from `src/app/app.component.ts`, and exposes the shared client to call sites.
- Configuration is read through `NG_APP_POSTHOG_PROJECT_TOKEN` and `NG_APP_POSTHOG_HOST`, mapped in `src/environments/environment.ts` and `src/environments/environment.prod.ts`, and documented in `.env.example`. The configured keys were present in the local environment during review.
- Missing configuration throws explicit development-only errors while production remains a no-op.
- The integration uses the SDK defaults, including autocapture and session recording. No event delivery was exercised or observed during this run.

## Events instrumented

| Event | What it measures | File |
|---|---|---|
| `project_created` | An authenticated user successfully creates a project. | `src/app/shared/components/create-project-modal/create-project-modal.component.ts` |
| `team_member_added` | An authenticated user adds a team member, segmented by assigned role. | `src/app/shared/components/add-member-modal/add-member-modal.component.ts` |
| `profile_updated` | An authenticated user saves profile changes. | `src/app/pages/profile/profile.component.ts` |
| `account_settings_saved` | An authenticated user saves account settings. | `src/app/pages/settings/components/account-settings/account-settings.component.ts` |
| `notification_preferences_saved` | An authenticated user saves notification preferences. | `src/app/pages/settings/components/notification-settings/notification-settings.component.ts` |
| `preferences_saved` | An authenticated user saves application preferences. | `src/app/pages/settings/components/preferences-settings/preferences-settings.component.ts` |
| `two_factor_authentication_toggled` | An authenticated user enables or disables two-factor authentication. | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `sessions_revoked` | An authenticated user revokes one or all other sessions; the event includes the revocation scope. | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |

These are planned/instrumented events, not verified deliveries. The capture step found nine call sites because `sessions_revoked` is emitted for both single-session and all-other-session actions.

## Identification and logout

Identification was wired. Successful login identifies the mock user's stable `credentials.id`; app initialization re-identifies persisted credentials, and successful logout calls `reset()`. No placeholder distinct IDs were reported. The mock app generates and persists a credentials UUID; a production authentication backend should provide its own durable primary key if this flow is replaced. No PII is included in capture properties.

## Error tracking

`PosthogErrorHandler` was added at `src/app/@core/services/posthog-error-handler.service.ts` and registered as Angular's global `ErrorHandler` in `src/app/app.config.ts`. Uncaught Angular errors are forwarded with `captureException`, while console reporting is preserved. Error delivery was not observed during this run.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1914206)

The dashboard contains five insights covering project creation, role-segmented collaboration, settings engagement, the project-to-collaboration funnel, and security settings activity. The insights reference the instrumented event names and remain valid even though no new event data was observed during the run.

## What the run verified

- `npm install` completed successfully and the declared SDK dependency is present.
- `npm run build` succeeded before and after the review fix; the Angular bundle compiled.
- The integration review found the singleton initialization, identity/logout flow, capture contracts, error handling, and minimality acceptable.
- Both configured PostHog environment keys were present when checked.

## What the run did not verify

- No browser session or live PostHog ingestion was exercised, so event capture, identity delivery, error delivery, and dashboard data population remain unconfirmed.
- Lint did not run: `npm run lint` stopped before linting because `eslint.config.js` imports undeclared `prettier` (`Cannot find module 'prettier'`). This is a pre-existing project dependency conflict outside the PostHog changeset.
- The generated Angular environment bridge was assumed to expose the configured `.env` values; direct inspection of that protected bridge was unavailable.
- The UI handlers are local/demo success paths. In production, move captures after confirmed backend success where applicable.

## Before you merge

- [ ] Run a full production build and fix any lint or type errors introduced by the integration; `npm run build` passed in review, but `npm run lint` is currently blocked by the missing `prettier` dependency in `eslint.config.js:5`.
- [ ] Run the test suite and update mocks or fixtures for the instrumented handlers in `src/app/shared/components/create-project-modal/create-project-modal.component.ts:143`, `src/app/shared/components/add-member-modal/add-member-modal.component.ts:202`, `src/app/pages/profile/profile.component.ts:66`, and the settings call sites.
- [ ] Confirm `NG_APP_POSTHOG_PROJECT_TOKEN` and `NG_APP_POSTHOG_HOST` from `.env.example` are set in every deploy environment, not only in the local `.env`.
- [ ] Exercise login, refresh, logout, each instrumented action, and an uncaught error in a real browser, then confirm events and error reports arrive in PostHog.
- [ ] If the mock authentication flow is replaced, ensure `src/app/auth/services/authentication.service.ts:55` identifies with the backend's durable user ID and that the returning-user path remains wired.
