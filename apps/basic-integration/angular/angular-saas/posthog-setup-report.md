# PostHog setup report

PostHog product analytics and centralized Angular error tracking were added, with 11 identity-inheriting events, user identification, and a five-insight dashboard configured for project 483112.

## Installed and initialized

- Installed `posthog-js` 1.407.5 with npm; `package.json` and `package-lock.json` were updated.
- Configured `NG_APP_POSTHOG_PROJECT_TOKEN` and `NG_APP_POSTHOG_HOST` through `.env`, documented both in `.env.example`, and exposed them through `src/environments/environment.ts` and `environment.prod.ts`.
- Added the root singleton `PosthogService` in `src/app/@core/services/posthog.service.ts`. It is browser-safe, initializes once from the environment configuration, guards missing configuration, and exposes the shared client.
- `src/app/app.component.ts` initializes PostHog during `ngOnInit()` before restoring persisted-user identity.
- No CSP directives were found in `src`, so no CSP changes were made.

## Events instrumented

These call sites were added to the event plan and instrumented in real action handlers. The run did **not** browser-exercise the app or observe any event arriving in PostHog; the list describes configured capture calls, not verified deliveries.

| Event | What it measures | File |
|---|---|---|
| `user_logged_in` | A user completes the login flow successfully. | `src/app/auth/services/authentication.service.ts` |
| `user_logged_out` | An authenticated user begins logging out. | `src/app/auth/services/authentication.service.ts` |
| `project_created` | A user creates a project from the dashboard modal. | `src/app/shared/components/create-project-modal/create-project-modal.component.ts` |
| `team_member_added` | A user adds a team member from the dashboard modal. | `src/app/shared/components/add-member-modal/add-member-modal.component.ts` |
| `profile_updated` | A user saves changes to their profile. | `src/app/pages/profile/profile.component.ts` |
| `account_settings_saved` | A user saves account settings. | `src/app/pages/settings/components/account-settings/account-settings.component.ts` |
| `notification_preferences_saved` | A user saves notification preferences. | `src/app/pages/settings/components/notification-settings/notification-settings.component.ts` |
| `preferences_saved` | A user saves display and localization preferences. | `src/app/pages/settings/components/preferences-settings/preferences-settings.component.ts` |
| `two_factor_authentication_toggled` | A user enables or disables two-factor authentication. | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `session_revoked` | A user revokes one or all other active sessions. | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `language_changed` | A user changes the application language. | `src/app/i18n/language-selector.component.ts` |

Capture properties were reviewed as non-PII operational values. Captures inherit the current PostHog identity and do not pass a distinct ID or session ID directly.

## User identification

Identification is wired. `AuthenticationService` identifies after successful login using `credentials.id`, supplies email, full name, and role as person properties, resets before a direct account switch, and resets on logout. `AppComponent` identifies persisted credentials after initialization on page refresh.

The demo login currently generates a fresh UUID per login. A production backend must replace that generated value with the authenticated account's durable primary key; otherwise the same real user can be fragmented across identities.

## Error tracking

`src/app/@core/services/posthog-error-handler.ts` implements Angular's root `ErrorHandler`, forwards uncaught errors through `posthogService.client.captureException(error)`, and preserves console reporting. `src/app/app.config.ts` registers it globally. The run verified the wiring statically; it did not trigger an error in a running browser and therefore did not confirm an exception arrived in PostHog.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1919710) is live with five insights: Login activation funnel, Activation events, Settings engagement, Security activity, and Localization adoption. The insights use the instrumented event definitions, but the run did not observe event data populating them.

## Verification and unresolved issues

### Verified by the run

- npm installation completed and the dependency resolved successfully.
- `npm run build` passed twice, including after the final service correction.
- Event names are lower snake case, captures are placed in real handlers, and capture properties contain no PII.
- Environment key presence was checked without exposing values.
- Dashboard creation and all five insight attachments succeeded.

### Not verified by the run

- No production/browser session was exercised, so event delivery, session recording, initialization against the configured host, and exception delivery remain unconfirmed.
- The run did not run the test suite.
- No event was observed arriving in PostHog.

### Follow-up issues

- **Stable attribution remains unresolved in the demo:** `src/app/auth/services/authentication.service.ts` identifies with a generated credential UUID rather than a durable backend account ID. This affects every listed event and captured error by potentially fragmenting one real user across identities.
- **Lint is blocked by an existing dependency conflict:** `npm run lint` exits with `Cannot find module 'prettier' required from eslint.config.js`. This prevented lint verification; the integration did not change the lint configuration or add Prettier.
- `npm install` reported 59 audit vulnerabilities and pending allow-scripts warnings. The run did not attribute these to the PostHog changes or remediate them.

## Before you merge

- [ ] Run a full production build and fix any lint or type errors introduced by the generated integration; specifically resolve or otherwise account for the existing missing `prettier` dependency in `eslint.config.js` before treating lint as verified.
- [ ] Run the test suite and update mocks or fixtures for the new PostHog service, identity calls, capture calls, and global error handler if needed.
- [ ] Confirm `NG_APP_POSTHOG_PROJECT_TOKEN` and `NG_APP_POSTHOG_HOST` are set in every deploy environment, not only locally, and that the exact names remain documented in `.env.example`.
- [ ] Replace the demo-generated identity in `src/app/auth/services/authentication.service.ts` with the authenticated account's durable primary key before relying on event attribution.
- [ ] Load the deployed app, complete login and representative instrumented actions, and confirm the listed events and a deliberately triggered uncaught error arrive in PostHog; this is not proven by the passing build.
- [ ] Confirm the returning-session path in `src/app/app.component.ts` identifies persisted users before normal product activity begins.
