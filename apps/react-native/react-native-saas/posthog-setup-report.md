<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Native SaaS app. Here's what was done:

- **Installed** `posthog-react-native`, `react-native-svg` (required peer dependency), and `react-native-config` (for environment variable loading)
- **Created** `src/config/posthog.js` — initialises the PostHog client using `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `.env` via `react-native-config`
- **Updated** `src/routes.js` — wrapped the navigator with `PostHogProvider` (inside `NavigationContainer` for React Navigation v7 compatibility), enabled touch autocapture, and added manual screen tracking via `onReady`/`onStateChange`
- **Added user identification** in `src/store/modules/auth/sagas.js` — calls `posthog.identify()` with the user's email on successful sign-in, and `posthog.reset()` on sign-out
- **Instrumented 9 business events** across auth, teams, projects, and members sagas

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signs in | `src/store/modules/auth/sagas.js` |
| `user_sign_in_failed` | Sign in attempt failed with invalid credentials | `src/store/modules/auth/sagas.js` |
| `user_signed_out` | User signs out of the application | `src/store/modules/auth/sagas.js` |
| `team_created` | User successfully creates a new team | `src/store/modules/teams/sagas.js` |
| `team_selected` | User switches to a different team | `src/store/modules/teams/sagas.js` |
| `project_created` | User successfully creates a new project within a team | `src/store/modules/projects/sagas.js` |
| `project_creation_failed` | Project creation failed due to an error | `src/store/modules/projects/sagas.js` |
| `member_invited` | User invites a new member to their team | `src/store/modules/members/sagas.js` |
| `member_role_updated` | User updates a team member's role | `src/store/modules/members/sagas.js` |

## Next steps

To finish native setup, run pod install for iOS (if you haven't already):

```bash
cd ios && pod install && cd ..
```

Visit your PostHog project to create an "Analytics basics" dashboard with these suggested insights:

- **User sign-in funnel** — `user_signed_in` over time, showing daily active users
- **Sign-in failure rate** — `user_sign_in_failed` vs `user_signed_in` to monitor auth error rate
- **Team & project creation** — `team_created` and `project_created` trends, showing growth in workspace adoption
- **Member collaboration** — `member_invited` over time, a proxy for virality and team growth
- **Churn signal** — `user_signed_out` vs `user_signed_in` ratio over time

Manage your PostHog project at: https://us.posthog.com/project/2

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
