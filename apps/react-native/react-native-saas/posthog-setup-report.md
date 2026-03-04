<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the React Native SaaS app. The following changes were made:

- **`src/config/posthog.js`** (new): PostHog singleton client initialized with `react-native-config` environment variables (`POSTHOG_API_KEY`, `POSTHOG_HOST`). Enables autocapture of app lifecycle events and touch interactions.
- **`src/routes.js`**: Added `PostHogProvider` inside `NavigationContainer` (required for React Navigation v7), with manual screen tracking via `onStateChange`. Touch autocapture enabled.
- **`src/store/modules/auth/sagas.js`**: Added `user_signed_in` and `sign_in_failed` capture on login, `posthog.identify()` on successful sign-in, `user_signed_out` capture and `posthog.reset()` on sign-out.
- **`src/store/modules/teams/sagas.js`**: Added `team_created` and `team_selected` capture.
- **`src/store/modules/projects/sagas.js`**: Added `project_created` capture.
- **`src/store/modules/members/sagas.js`**: Added `member_invited` and `member_role_updated` capture.
- **`.env`**: Created with `POSTHOG_API_KEY` and `POSTHOG_HOST` values.

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signed in | `src/store/modules/auth/sagas.js` |
| `sign_in_failed` | User sign-in attempt failed due to invalid credentials | `src/store/modules/auth/sagas.js` |
| `user_signed_out` | User signed out of the application | `src/store/modules/auth/sagas.js` |
| `team_created` | User created a new team | `src/store/modules/teams/sagas.js` |
| `team_selected` | User switched to a different team | `src/store/modules/teams/sagas.js` |
| `project_created` | User created a new project within a team | `src/store/modules/projects/sagas.js` |
| `member_invited` | User invited a new member to their team | `src/store/modules/members/sagas.js` |
| `member_role_updated` | User updated a team member's role | `src/store/modules/members/sagas.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](https://us.posthog.com/project/2/dashboard/1271582)
  - [Daily Active Users (DAU)](https://us.posthog.com/project/2/insights/i4yNn4qk) — unique users signing in per day
  - [User Authentication Activity](https://us.posthog.com/project/2/insights/d6tgDkAJ) — sign-ins vs sign-outs over time
  - [User Onboarding Funnel](https://us.posthog.com/project/2/insights/Hhf3Metu) — sign in → team creation → project creation conversion
  - [Team Growth Activity](https://us.posthog.com/project/2/insights/rxRLg7hE) — teams created, projects created, members invited
  - [Error Tracking](https://us.posthog.com/project/2/insights/48Bbt99Q) — sign-in failures and other error events

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
