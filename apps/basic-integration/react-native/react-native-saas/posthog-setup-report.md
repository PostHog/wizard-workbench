<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Native SaaS app. The following changes were made:

- **`src/config/posthog.js`** (new): PostHog client initialized using `react-native-config` environment variables (`POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`). Disabled automatically if the token is not configured.
- **`src/routes.js`**: Added `PostHogProvider` (with touch autocapture) inside `NavigationContainer` for React Navigation v7 compatibility. Manual screen tracking via `onStateChange`/`onReady` callbacks calls `posthog.screen()` on each navigation.
- **`src/store/modules/auth/sagas.js`**: Added `posthog.identify()` on successful sign-in, and `posthog.capture()` for `user_signed_in`, `sign_in_failed`, `user_signed_out`. Added `posthog.reset()` on sign-out. Exception tracking added to the sign-in error path.
- **`src/store/modules/teams/sagas.js`**: Added `posthog.capture()` for `team_created` and `team_selected`. Exception tracking on create failure.
- **`src/store/modules/projects/sagas.js`**: Added `posthog.capture()` for `project_created`. Exception tracking on create failure.
- **`src/store/modules/members/sagas.js`**: Added `posthog.capture()` for `member_invited` and `member_role_updated`. Exception tracking on invite/update failure.
- **`.env`**: Created with `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` values.

**Packages installed:** `posthog-react-native`, `react-native-config`, `react-native-device-info`, `react-native-localize`, `react-native-svg`

> **iOS note:** Run `cd ios && pod install` after installing the new packages.

| Event name | Description | File |
|---|---|---|
| `user_signed_in` | User successfully authenticated and signed in | `src/store/modules/auth/sagas.js` |
| `sign_in_failed` | User attempted to sign in but authentication failed | `src/store/modules/auth/sagas.js` |
| `user_signed_out` | User signed out of the app | `src/store/modules/auth/sagas.js` |
| `team_created` | User successfully created a new team | `src/store/modules/teams/sagas.js` |
| `team_selected` | User switched to a different team | `src/store/modules/teams/sagas.js` |
| `project_created` | User successfully created a new project within a team | `src/store/modules/projects/sagas.js` |
| `member_invited` | User invited a new member to the team | `src/store/modules/members/sagas.js` |
| `member_role_updated` | User updated a team member's roles/permissions | `src/store/modules/members/sagas.js` |

## Next steps

To monitor user behavior, create an **"Analytics basics"** dashboard in PostHog with these insights:

1. **Sign-in trend** — Trends chart for `user_signed_in` over time
2. **Sign-in funnel** — Funnel from `user_signed_in` → `team_selected` → `project_created` to measure onboarding conversion
3. **Team & project creation** — Trends chart with `team_created` and `project_created` series
4. **Member growth** — Trends chart for `member_invited` to track team expansion
5. **Authentication failures** — Trends chart for `sign_in_failed` to monitor login issues

Visit [/insights](/insights) and [/dashboard](/dashboard) in your PostHog project to build these.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
