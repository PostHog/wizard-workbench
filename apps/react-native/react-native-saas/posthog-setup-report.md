<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the React Native SaaS app. The following changes were made:

- **`src/config/posthog.js`** (new): PostHog client singleton configured via `react-native-config` environment variables. Autocapture of app lifecycle events is enabled. The client is safely disabled if no valid project token is present.
- **`src/routes.js`**: `PostHogProvider` added inside `NavigationContainer` (required for React Navigation v7 compatibility). Manual screen tracking implemented via `onReady`/`onStateChange` callbacks to fire `posthog.screen()` on each route change.
- **`android/app/build.gradle`**: Added `apply from: project(':react-native-config').projectDir.getPath() + "/dotenv.gradle"` so Android can read `.env` values at build time.
- **`src/store/modules/auth/sagas.js`**: User identification (`posthog.identify`) and `user_signed_in` capture on successful login (both demo and standard modes). `user_sign_in_failed` capture in the catch block. `user_signed_out` capture followed by `posthog.reset()` on logout to clear the distinct ID.
- **`src/store/modules/projects/sagas.js`**: `project_created` capture after successful project creation. `$exception` capture in the error handler.
- **`src/store/modules/teams/sagas.js`**: `team_created` capture after successful team creation. `team_switched` capture when a user selects an active team. `$exception` capture in the error handler.
- **`src/store/modules/members/sagas.js`**: `member_invited` capture after an invite is sent. `member_role_updated` capture after a member's role is changed. `$exception` capture in error handlers.

| Event name | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signs in to the app | `src/store/modules/auth/sagas.js` |
| `user_sign_in_failed` | User attempted to sign in but credentials were invalid | `src/store/modules/auth/sagas.js` |
| `user_signed_out` | User signs out of the app | `src/store/modules/auth/sagas.js` |
| `project_created` | User successfully creates a new project within a team | `src/store/modules/projects/sagas.js` |
| `team_created` | User successfully creates a new team | `src/store/modules/teams/sagas.js` |
| `team_switched` | User switches the active team | `src/store/modules/teams/sagas.js` |
| `member_invited` | User sends an invite to a new member to join a team | `src/store/modules/members/sagas.js` |
| `member_role_updated` | Administrator updates the role of a team member | `src/store/modules/members/sagas.js` |

## Next steps

Create an **"Analytics basics"** dashboard in PostHog and add the following suggested insights to track user behavior:

- [Sign-ins over time — trend of `user_signed_in` events](https://us.posthog.com/project/2/insights/new)
- [Sign-in funnel — conversion from app open to `user_signed_in`](https://us.posthog.com/project/2/insights/new)
- [Sign-in failure rate — trend of `user_sign_in_failed` events](https://us.posthog.com/project/2/insights/new)
- [Project & team creation — trend of `project_created` and `team_created` events](https://us.posthog.com/project/2/insights/new)
- [Churn signal — trend of `user_signed_out` events](https://us.posthog.com/project/2/insights/new)

You can create a new dashboard here: https://us.posthog.com/project/2/dashboard

### iOS note

After installing packages, run `cd ios && pod install` to link the new native dependencies (`posthog-react-native`, `react-native-device-info`, `react-native-localize`, `react-native-svg`, `react-native-config`).

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
