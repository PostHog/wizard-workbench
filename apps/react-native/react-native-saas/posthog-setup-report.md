<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Native SaaS application. The following changes were made:

- **`src/config/posthog.js`** (new file): PostHog client initialized using `react-native-config` to load `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from the `.env` file. App lifecycle capture and autocapture are enabled.
- **`src/routes.js`**: Wrapped the navigation stack with `PostHogProvider` (placed inside `NavigationContainer` for React Navigation v7 compatibility). Manual screen tracking via `posthog.screen()` fires on route changes.
- **`src/store/modules/auth/sagas.js`**: Added `user_signed_in` (with `posthog.identify()`), `sign_in_failed`, and `user_signed_out` (with `posthog.reset()`) events.
- **`src/store/modules/teams/sagas.js`**: Added `team_created` and `team_selected` events, plus `$exception` error tracking on team creation failure.
- **`src/store/modules/projects/sagas.js`**: Added `project_created` event, plus `$exception` error tracking on project creation failure.
- **`src/store/modules/members/sagas.js`**: Added `member_invited` and `member_role_updated` events, plus `$exception` error tracking on failures.
- **`.env`**: Created with `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` environment variables.

Packages installed: `posthog-react-native`, `react-native-config`, `react-native-svg`, `react-native-device-info`, `react-native-localize`.

| Event | Description | File |
|---|---|---|
| `user_signed_in` | Fired when a user successfully signs in | `src/store/modules/auth/sagas.js` |
| `sign_in_failed` | Fired when a sign-in attempt fails due to invalid credentials | `src/store/modules/auth/sagas.js` |
| `user_signed_out` | Fired when a user signs out of the app | `src/store/modules/auth/sagas.js` |
| `team_created` | Fired when a new team is successfully created | `src/store/modules/teams/sagas.js` |
| `team_selected` | Fired when a user switches the active team | `src/store/modules/teams/sagas.js` |
| `project_created` | Fired when a new project is successfully created | `src/store/modules/projects/sagas.js` |
| `member_invited` | Fired when a member invitation is sent successfully | `src/store/modules/members/sagas.js` |
| `member_role_updated` | Fired when a member's role is updated successfully | `src/store/modules/members/sagas.js` |

## Next steps

To visualize your analytics, head to your PostHog project and create insights for the events above. Suggested insights:

- **Sign-in funnel**: Funnel from `sign_in_failed` → `user_signed_in` to track authentication success rate
- **User sign-ins over time**: Trend of `user_signed_in` to monitor active usage
- **Project creation over time**: Trend of `project_created` to track growth
- **Team activity**: Combined trend of `team_created` + `team_selected`
- **Member growth**: Trend of `member_invited` to track collaboration adoption

PostHog project: [https://us.posthog.com/project/2](https://us.posthog.com/project/2)

> **Note:** For iOS, run `cd ios && pod install` after installing the new packages. For Android, rebuild the project so `react-native-config` can embed the environment variables.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
