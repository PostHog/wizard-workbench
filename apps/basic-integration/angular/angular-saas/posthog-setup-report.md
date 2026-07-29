# PostHog setup report

PostHog product analytics, user identification, global Angular error tracking, and a starter dashboard were added to the Angular application.

## Installed and initialized

- Installed `posthog-js` 1.408.0 with npm; `package.json` declares `^1.408.0` and the lockfile resolves 1.408.0.
- Added a singleton `PosthogService` at `src/app/@core/services/posthog.service.ts`, using Angular `inject()`, browser guards, one-time initialization, and a no-op client before initialization.
- `AppComponent` initializes PostHog after startup using the environment configuration. The configured variables are `NG_APP_POSTHOG_PROJECT_TOKEN` and `NG_APP_POSTHOG_HOST`, documented in `.env.example` and set locally during the run.
- Development builds fail loudly when either configuration variable is missing; production remains a no-op when configuration is absent.
- Default PostHog capture behavior was retained. No CSP changes were needed because no CSP was present in the reviewed application files.

## Events instrumented

These events were added to successful action handlers. The run verified that the calls exist in the listed files; it did **not** observe events arriving in PostHog.

| Event | What it measures | File |
|---|---|---|
| `login_completed` | User successfully completes sign-in | `src/app/auth/login/login.component.ts` |
| `project_created` | User creates a project, including selected status | `src/app/shared/components/create-project-modal/create-project-modal.component.ts` |
| `team_member_added` | User adds a team member, including assigned role | `src/app/shared/components/add-member-modal/add-member-modal.component.ts` |
| `profile_updated` | User saves profile changes | `src/app/pages/profile/profile.component.ts` |
| `account_settings_saved` | User saves account settings | `src/app/pages/settings/components/account-settings/account-settings.component.ts` |
| `notification_preferences_saved` | User saves notification preferences, including enabled-channel count | `src/app/pages/settings/components/notification-settings/notification-settings.component.ts` |
| `preferences_saved` | User saves display and navigation preferences | `src/app/pages/settings/components/preferences-settings/preferences-settings.component.ts` |
| `two_factor_authentication_toggled` | User enables or disables two-factor authentication | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `session_revoked` | User revokes another active session | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `other_sessions_revoked` | User revokes all other active sessions | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |

Event properties were reviewed as non-PII categorical or aggregate values. No event-flow verification was performed, so delivery remains unconfirmed.

## User identification

Identification is wired. After successful authentication, `credentials.id` is passed to `identify()` with email, display name, and role as person properties. On application initialization, a persisted authenticated user is identified again, and successful authenticated logout calls `reset()`.

### Follow-up issue: stable identity is unresolved

The demo authentication service currently generates `credentials.id` with `crypto.randomUUID()` on each login. This means the identifier is not stable across separate logins until production authentication supplies a persistent backend user ID. The affected call site is `src/app/auth/services/authentication.service.ts` (the run did not record an exact line number); the persisted-user identification path is in `src/app/app.component.ts` (exact line not recorded). If left unresolved, returning users can fragment across PostHog persons and attribution across sessions will be unreliable.

## Error tracking

A singleton `PosthogErrorHandler` was added in `src/app/@core/services/posthog.service.ts`. It forwards uncaught Angular errors to `captureException()` and retains `console.error` visibility. `src/app/app.config.ts` registers it as Angular's global `ErrorHandler`. No component-level wrappers or manual error instrumentation were added.

The run verified wiring in source, but did not start the application or observe an exception arrive in PostHog.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1926564)

The dashboard contains four tagged insights: a login-to-project-creation funnel, project creation activity trend, account and preference updates trend, and security actions trend. The insights may initially be empty until application events arrive.

## Verification and conflicts

- `npm install` completed successfully and dependency state was current.
- `npm run build` completed successfully and generated `dist/angular-boilerplate`.
- No event delivery, application startup, or automated browser verification was observed during this run.
- `npm run lint` is blocked before linting because the existing `eslint.config.js` requires `prettier`, but `prettier` is not installed. This is unrelated to the PostHog changes and was not widened into a dependency change.
- No test suite was run.

## Before you merge

- [ ] Run a full production build and fix any lint or type errors introduced by the integration; the verified build was `npm run build`, while lint remains blocked by the missing `prettier` dependency required by `eslint.config.js`.
- [ ] Run the test suite and update mocks or fixtures if the instrumented call sites require them.
- [ ] Confirm `NG_APP_POSTHOG_PROJECT_TOKEN` and `NG_APP_POSTHOG_HOST` from `.env.example` are configured in every deployment environment, not only the local `.env`.
- [ ] Replace the demo-generated `credentials.id` in `src/app/auth/services/authentication.service.ts` with the persistent backend user ID, then verify the returning-user identification path in `src/app/app.component.ts`.
- [ ] Trigger each instrumented successful action in a real browser session and confirm the ten event names arrive in PostHog with the expected non-PII properties.
- [ ] Trigger an uncaught Angular error and confirm the global handler in `src/app/@core/services/posthog.service.ts` produces an error in PostHog.
