<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this React Native SaaS application. The following changes were made:

- **Installed packages**: `posthog-react-native`, `react-native-svg` (required peer dependency), and `react-native-config` (for environment variable support).
- **Environment variables**: `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` added to `.env` and covered by `.gitignore`.
- **PostHog client** (`src/config/posthog.js`): Singleton PostHog instance configured with app lifecycle tracking, debug mode in dev, batching, and feature flag preloading.
- **PostHogProvider & screen tracking** (`src/routes.js`): `PostHogProvider` added inside `NavigationContainer` (required for React Navigation v7 compatibility) with touch autocapture enabled and manual screen tracking via `onStateChange`.
- **User identification & auth events** (`src/store/modules/auth/sagas.js`): `posthog.identify()` called on sign-in with `$set`/`$set_once` person properties; `user_signed_in` and `user_signed_out` events captured; `posthog.reset()` called on sign-out; `captureException` added to the sign-in error path.
- **Team events** (`src/store/modules/teams/sagas.js`): `team_created` (with `team_name`) and `team_switched` (with `team_name`, `team_id`) events captured; `captureException` on create failure.
- **Project events** (`src/store/modules/projects/sagas.js`): `project_created` (with `project_title`) event captured; `captureException` on create failure.
- **Member events** (`src/store/modules/members/sagas.js`): `member_invited` and `member_role_updated` (with `role_count`) events captured; `captureException` on each error path.

| Event Name | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signs in to the app | `src/store/modules/auth/sagas.js` |
| `user_signed_out` | User signs out of the app | `src/store/modules/auth/sagas.js` |
| `team_created` | User creates a new team | `src/store/modules/teams/sagas.js` |
| `team_switched` | User switches to a different team | `src/store/modules/teams/sagas.js` |
| `project_created` | User creates a new project within the active team | `src/store/modules/projects/sagas.js` |
| `member_invited` | User sends an invitation to a new team member | `src/store/modules/members/sagas.js` |
| `member_role_updated` | User updates the roles assigned to an existing team member | `src/store/modules/members/sagas.js` |

## Next steps

We've built a dashboard and five insights for you to keep an eye on user behavior:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1813077)
- [Sign-ins over time (wizard)](https://us.posthog.com/project/483112/insights/7hANAJLG)
- [Sign-in to team creation funnel (wizard)](https://us.posthog.com/project/483112/insights/nxazlvNX)
- [Team & project creation activity (wizard)](https://us.posthog.com/project/483112/insights/wsu4iDGA)
- [Member collaboration activity (wizard)](https://us.posthog.com/project/483112/insights/yu3hG0JB)
- [Sign-in vs sign-out (churn signal) (wizard)](https://us.posthog.com/project/483112/insights/AvBb0pud)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] For iOS, run `cd ios && pod install` after adding the new native packages (`posthog-react-native`, `react-native-svg`, `react-native-config`).
- [ ] For Android, ensure `react-native-config` Gradle configuration is applied per its README (add `apply from: project(':react-native-config').projectDir.getPath() + "/dotenv.gradle"` to `android/app/build.gradle`).
- [ ] Confirm the returning-visitor path also calls `identify` — the current implementation identifies on fresh login; verify that session restore on app relaunch re-identifies the user (the `init` saga restores the token but does not re-call `posthog.identify`). Consider adding an identify call in the `init` saga when a stored token is found.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
