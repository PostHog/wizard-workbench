<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your React Native SaaS application. Here is a summary of the changes made:

- **`src/services/posthog.js`** (new): Standalone PostHog client instance using `react-native-config` to load `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `.env`. This singleton is used in sagas and other non-React code.
- **`src/routes.js`**: Added `PostHogProvider` (wrapping the navigator, inside `NavigationContainer` for React Navigation v7 compatibility). The provider uses the shared `posthog` client instance to enable autocapture for touch events and screen views.
- **`src/store/modules/auth/sagas.js`**: On successful sign-in, calls `posthog.identify()` with the user's email and captures `user_signed_in`. On sign-out, captures `user_signed_out` and calls `posthog.reset()` to unlink the user.
- **`src/store/modules/teams/sagas.js`**: Captures `team_created` (with team name and ID) and `team_switched` (with team ID and name) on the respective saga success paths.
- **`src/store/modules/projects/sagas.js`**: Captures `project_created` (with project title and ID) after a project is successfully created.
- **`src/store/modules/members/sagas.js`**: Captures `member_invited` (with invitee email) and `member_role_updated` (with member ID and role count) on successful member operations.

**Packages installed (background):** `posthog-react-native`, `react-native-device-info`, `react-native-localize`, `react-native-svg`, `react-native-config`

> **iOS note:** After installation completes, run `pod install` inside the `ios/` directory to link native dependencies.
>
> **`react-native-config` Android note:** Follow the [react-native-config Android setup](https://github.com/luggit/react-native-config#android) to expose `.env` variables to the build — you need to add `apply from: project(':react-native-config').projectDir.getPath() + "/dotenv.gradle"` to `android/app/build.gradle`.

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signed in with email and password | `src/store/modules/auth/sagas.js` |
| `user_signed_out` | User signed out of the application | `src/store/modules/auth/sagas.js` |
| `team_created` | User created a new team | `src/store/modules/teams/sagas.js` |
| `team_switched` | User switched to a different team | `src/store/modules/teams/sagas.js` |
| `project_created` | User created a new project within a team | `src/store/modules/projects/sagas.js` |
| `member_invited` | User invited a new member to a team | `src/store/modules/members/sagas.js` |
| `member_role_updated` | User updated the role of a team member | `src/store/modules/members/sagas.js` |

## Next steps

To visualize these events, create an **"Analytics basics"** dashboard in your PostHog project with insights like:

- **Sign-in trend** — `user_signed_in` event count over time
- **Sign-in → team switch funnel** — conversion from `user_signed_in` → `team_switched` → `project_created`
- **Team & project creation** — `team_created` and `project_created` side by side
- **Member growth** — `member_invited` count over time
- **Churn signal** — `user_signed_out` trend

You can create the dashboard here: https://us.posthog.com/project/238460/dashboard

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-native/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
