<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this React Native SaaS application. Here is a summary of what was added:

- **New file `src/services/posthog.js`**: A singleton PostHog client initialized using `react-native-config` to securely load `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `.env` at build time.
- **Updated `src/routes.js`**: Wrapped the app's navigator in `PostHogProvider` (inside `NavigationContainer`) to enable autocapture and provide the PostHog client via React context throughout the app.
- **Updated `src/store/modules/auth/sagas.js`**: Added `posthog.identify()` and `posthog.capture('sign_in')` on successful sign-in, `posthog.capture('sign_out')` and `posthog.reset()` on sign-out, and `posthog.captureException()` on sign-in errors.
- **Updated `src/store/modules/teams/sagas.js`**: Added `posthog.capture('team_created')` on successful team creation and `posthog.capture('team_selected')` when a user switches teams. Error tracking added on failure.
- **Updated `src/store/modules/projects/sagas.js`**: Added `posthog.capture('project_created')` on successful project creation with error tracking.
- **Updated `src/store/modules/members/sagas.js`**: Added `posthog.capture('member_invited')` on member invite and `posthog.capture('member_role_updated')` on role changes, with error tracking.
- **Dependencies installed**: `posthog-react-native`, `react-native-svg`, `react-native-config`
- **Environment variables**: `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` added to `.env`

| Event | Description | File |
|---|---|---|
| `sign_in` | User successfully signs in with email and password | `src/store/modules/auth/sagas.js` |
| `sign_out` | User signs out of the application | `src/store/modules/auth/sagas.js` |
| `team_created` | User successfully creates a new team | `src/store/modules/teams/sagas.js` |
| `team_selected` | User switches to a different team | `src/store/modules/teams/sagas.js` |
| `project_created` | User successfully creates a new project within a team | `src/store/modules/projects/sagas.js` |
| `member_invited` | User sends an invite to a new team member by email | `src/store/modules/members/sagas.js` |
| `member_role_updated` | User updates the roles/permissions of a team member | `src/store/modules/members/sagas.js` |

## Next steps

Create an "Analytics basics" dashboard in PostHog to monitor key user behavior metrics. Suggested insights to add:

1. **Sign-in trend** — Track `sign_in` event count over time to monitor daily/weekly active users
2. **Sign-in to project creation funnel** — Funnel from `sign_in` → `team_selected` → `project_created` to measure onboarding conversion
3. **Team growth** — Track `team_created` count over time to see product adoption
4. **Member invitations** — Track `member_invited` over time to understand viral/collaboration growth
5. **User churn signal** — Compare `sign_out` counts against `sign_in` to flag potential churn

Create your dashboard at: https://us.posthog.com/project/2/dashboards

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
