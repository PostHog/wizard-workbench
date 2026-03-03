<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the React Native SaaS app. The following changes were made:

- **`src/config/posthog.js`** — New PostHog client instance configured with `react-native-config` env vars (`POSTHOG_API_KEY`, `POSTHOG_HOST`), app lifecycle capture, autocapture, and graceful disabling when no key is set.
- **`src/routes.js`** — Added `PostHogProvider` inside `NavigationContainer` (required for React Navigation v7). Manual screen tracking via `onReady`/`onStateChange` hooks with `posthog.screen()`. Touch autocapture enabled.
- **`src/store/modules/auth/sagas.js`** — `posthog.identify()` on sign-in (including demo mode), `posthog.reset()` on sign-out, capture for `user_signed_in`, `user_sign_in_failed`, `user_signed_out`, and `captureException` on sign-in error.
- **`src/store/modules/projects/sagas.js`** — Capture `project_created` (with title and project ID) on success; `project_creation_failed` + `captureException` on error.
- **`src/store/modules/teams/sagas.js`** — Capture `team_created` (with name and team ID) on success, `team_switched` on team selection, `captureException` on error.
- **`src/store/modules/members/sagas.js`** — Capture `member_invited` on invite success, `member_role_updated` on role change, `captureException` on errors.
- **`src/pages/Main/index.js`** — Capture `members_panel_opened` (with team context) when the members drawer is opened — top of the member management funnel.
- **`.env`** — `POSTHOG_API_KEY` and `POSTHOG_HOST` written via `wizard-tools`.
- **Packages installed**: `posthog-react-native`, `react-native-device-info`, `react-native-localize`, `react-native-config`.

| Event | Description | File |
|-------|-------------|------|
| `user_signed_in` | User successfully signed in | `src/store/modules/auth/sagas.js` |
| `user_sign_in_failed` | Sign-in attempt failed (invalid credentials) | `src/store/modules/auth/sagas.js` |
| `user_signed_out` | User signed out | `src/store/modules/auth/sagas.js` |
| `team_created` | New team successfully created | `src/store/modules/teams/sagas.js` |
| `team_switched` | User switched to a different team | `src/store/modules/teams/sagas.js` |
| `project_created` | New project created within a team | `src/store/modules/projects/sagas.js` |
| `project_creation_failed` | Project creation failed | `src/store/modules/projects/sagas.js` |
| `member_invited` | Team member invitation sent | `src/store/modules/members/sagas.js` |
| `member_role_updated` | Team member role changed | `src/store/modules/members/sagas.js` |
| `members_panel_opened` | Members drawer opened (top of member funnel) | `src/pages/Main/index.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](https://us.posthog.com/project/2/dashboard/1271582)
  - [User Authentication Activity](https://us.posthog.com/project/2/insights/d6tgDkAJ) — Sign-ins vs sign-outs over time
  - [User Onboarding Funnel](https://us.posthog.com/project/2/insights/Hhf3Metu) — Sign-in → Team created → Project created
  - [Team Growth Activity](https://us.posthog.com/project/2/insights/rxRLg7hE) — Teams, projects, and member invitations over time
  - [Error Tracking](https://us.posthog.com/project/2/insights/48Bbt99Q) — Failure events across key actions
  - [Daily Active Users (DAU)](https://us.posthog.com/project/2/insights/i4yNn4qk) — Unique daily sign-ins

> **iOS note**: After installing the new packages, run `cd ios && pod install && cd ..` to link native dependencies.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
