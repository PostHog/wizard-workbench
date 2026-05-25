# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Native SaaS app. Here's a summary of what was set up:

- **Installed packages**: `posthog-react-native`, `react-native-svg`, `react-native-config`, `react-native-device-info`, `react-native-localize`
- **Environment variables**: `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` written to `.env` via `react-native-config` (embedded at build time)
- **PostHog client**: Created `src/config/posthog.js` — a singleton PostHog instance with autocapture, lifecycle events, and debug mode in development
- **PostHogProvider**: Added to `src/routes.js` inside `NavigationContainer` (required for React Navigation v7), with manual screen tracking via `onStateChange` and touch autocapture enabled
- **User identification**: `posthog.identify(email)` called on every successful sign-in; `posthog.reset()` called on sign-out
- **Custom events**: 12 events added across four Redux Saga files covering all core user actions

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signed in | `src/store/modules/auth/sagas.js` |
| `user_sign_in_failed` | Sign in attempt failed with invalid credentials | `src/store/modules/auth/sagas.js` |
| `user_signed_out` | User signed out of the app | `src/store/modules/auth/sagas.js` |
| `team_created` | User successfully created a new team | `src/store/modules/teams/sagas.js` |
| `team_creation_failed` | Team creation failed due to an error | `src/store/modules/teams/sagas.js` |
| `team_selected` | User switched to a different team | `src/store/modules/teams/sagas.js` |
| `project_created` | User successfully created a new project within a team | `src/store/modules/projects/sagas.js` |
| `project_creation_failed` | Project creation failed due to an error | `src/store/modules/projects/sagas.js` |
| `member_invited` | User invited a new member to the team | `src/store/modules/members/sagas.js` |
| `member_invite_failed` | Sending a member invite failed | `src/store/modules/members/sagas.js` |
| `member_role_updated` | An administrator updated a member's role | `src/store/modules/members/sagas.js` |
| `member_role_update_failed` | Updating a member's role failed | `src/store/modules/members/sagas.js` |

## Next steps

We've prepared these insights for your "Analytics basics" dashboard. Create them in PostHog to keep an eye on user behavior:

- [Dashboards overview](https://us.posthog.com/project/2/dashboards) — create a new "Analytics basics" dashboard here
- [Sign-ins over time](https://us.posthog.com/project/2/insights/new#{"events":[{"id":"user_signed_in","type":"events"}],"display":"ActionsLineGraph","insight":"TRENDS","date_from":"-30d"}) — trends: `user_signed_in` over time
- [Sign-in failures](https://us.posthog.com/project/2/insights/new#{"events":[{"id":"user_sign_in_failed","type":"events"}],"display":"ActionsLineGraph","insight":"TRENDS","date_from":"-30d"}) — trends: `user_sign_in_failed` — monitor auth errors
- [Onboarding funnel](https://us.posthog.com/project/2/insights/new#{"events":[{"id":"user_signed_in","type":"events"},{"id":"team_created","type":"events"},{"id":"project_created","type":"events"}],"insight":"FUNNELS","date_from":"-30d"}) — funnel: sign-in → team created → project created
- [Team & project creation](https://us.posthog.com/project/2/insights/new#{"events":[{"id":"team_created","type":"events"},{"id":"project_created","type":"events"}],"display":"ActionsLineGraph","insight":"TRENDS","date_from":"-30d"}) — trends: team and project creation over time
- [Member invitations](https://us.posthog.com/project/2/insights/new#{"events":[{"id":"member_invited","type":"events"}],"display":"ActionsLineGraph","insight":"TRENDS","date_from":"-30d"}) — trends: `member_invited` — track growth of team collaboration

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
