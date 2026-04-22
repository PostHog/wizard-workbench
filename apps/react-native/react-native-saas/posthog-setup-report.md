<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Native SaaS app. Here is a summary of all changes made:

- **`src/config/posthog.js`** (new): PostHog singleton client configured via `react-native-config`, reading `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `.env`. Includes autocapture of app lifecycle events and debug mode in development.
- **`src/routes.js`** (updated): `PostHogProvider` added inside `NavigationContainer` (required for React Navigation v7). Manual screen tracking via `onReady`/`onStateChange` hooks on the `NavigationContainer`. Touch autocapture enabled.
- **`src/store/modules/auth/sagas.js`** (updated): `posthog.identify()` called on successful sign-in; `posthog.capture('sign_in')` and `posthog.capture('sign_out')` added; `posthog.reset()` called on sign-out to clear the distinct ID.
- **`src/store/modules/teams/sagas.js`** (updated): `posthog.capture('team_created')` and `posthog.capture('team_selected')` added.
- **`src/store/modules/projects/sagas.js`** (updated): `posthog.capture('project_created')` added.
- **`src/store/modules/members/sagas.js`** (updated): `posthog.capture('member_invited')` and `posthog.capture('member_role_updated')` added.
- **`.env`** (updated): `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` written with correct values.

**Packages installed:** `posthog-react-native`, `react-native-device-info`, `react-native-localize`, `react-native-svg`, `react-native-config`

| Event | Description | File |
|---|---|---|
| `sign_in` | User successfully signs in | `src/store/modules/auth/sagas.js` |
| `sign_out` | User signs out of the app | `src/store/modules/auth/sagas.js` |
| `team_created` | User creates a new team | `src/store/modules/teams/sagas.js` |
| `team_selected` | User switches to a different team | `src/store/modules/teams/sagas.js` |
| `project_created` | User creates a new project within a team | `src/store/modules/projects/sagas.js` |
| `member_invited` | User sends an invite to a new member | `src/store/modules/members/sagas.js` |
| `member_role_updated` | User updates a team member's role | `src/store/modules/members/sagas.js` |

## Next steps

To view your analytics, visit your PostHog project and create an "Analytics basics" dashboard. Suggested insights to add:

1. **Sign-in trend** — `sign_in` event over time (line chart) — tracks daily active users logging in
2. **Sign-in → Team selected → Project created funnel** — conversion funnel showing onboarding completion rate
3. **Team creation trend** — `team_created` over time — tracks team growth
4. **Member invited trend** — `member_invited` over time — tracks viral/collaboration growth
5. **Sign-out rate** — `sign_out` vs `sign_in` ratio — churn signal

For iOS, run `pod install` in the `ios/` directory after installing the native packages. For Android, a rebuild is required to pick up the native modules (`react-native-config`, `react-native-device-info`, `react-native-localize`, `react-native-svg`).

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-native/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
