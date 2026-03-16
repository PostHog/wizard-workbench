<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Native SaaS application. The following changes were made:

- **Installed packages**: `posthog-react-native`, `react-native-config`, `react-native-svg`, `react-native-device-info`, `react-native-localize`
- **Created** `src/config/posthog.js`: PostHog client initialized using `react-native-config` environment variables (`POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`) from `.env`. Autocapture and app lifecycle events are enabled.
- **Updated** `src/routes.js`: Wrapped the navigation stack with `PostHogProvider` (placed inside `NavigationContainer` for React Navigation v7 compatibility) to enable autocapture of touch events.
- **Updated** `src/store/modules/auth/sagas.js`: Added `posthog.identify()` on sign-in (with email as distinct ID), `posthog.reset()` on sign-out, and capture calls for `user_signed_in`, `user_sign_in_failed`, and `user_signed_out`.
- **Updated** `src/store/modules/teams/sagas.js`: Added capture calls for `team_created` and `team_selected`.
- **Updated** `src/store/modules/projects/sagas.js`: Added capture call for `project_created`.
- **Updated** `src/store/modules/members/sagas.js`: Added capture calls for `member_invited` and `member_role_updated`.

| Event | Description | File |
|-------|-------------|------|
| `user_signed_in` | User successfully signed in to the app | `src/store/modules/auth/sagas.js` |
| `user_sign_in_failed` | User sign-in attempt failed due to invalid credentials | `src/store/modules/auth/sagas.js` |
| `user_signed_out` | User signed out of the app | `src/store/modules/auth/sagas.js` |
| `team_created` | User created a new team | `src/store/modules/teams/sagas.js` |
| `team_selected` | User switched to a different team | `src/store/modules/teams/sagas.js` |
| `project_created` | User created a new project within a team | `src/store/modules/projects/sagas.js` |
| `member_invited` | User invited a new member to the team | `src/store/modules/members/sagas.js` |
| `member_role_updated` | User updated a team member's role | `src/store/modules/members/sagas.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](https://us.posthog.com/project/2/dashboard/1000000)
- [Sign-in success rate (funnel)](https://us.posthog.com/project/2/insights/r5mbb6ap)
- [Daily active sign-ins](https://us.posthog.com/project/2/insights/0bgshc66)
- [Project creation trend](https://us.posthog.com/project/2/insights/6idlnhsx)
- [Team growth](https://us.posthog.com/project/2/insights/axmvg6v0)
- [User retention signals (sign-outs)](https://us.posthog.com/project/2/insights/i151xtya)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
