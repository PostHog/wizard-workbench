<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the React Native SaaS application. Here is a summary of all changes made:

**New files created:**
- `src/config/posthog.js` — PostHog singleton client using `react-native-config` for environment variable access. Configured with autocapture of app lifecycle events, debug mode in development, and graceful disable when no token is configured.
- `.env` — Environment file containing `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`.

**Files modified:**
- `src/routes.js` — Added `PostHogProvider` (inside `NavigationContainer` per React Navigation v7 requirements) with `captureTouches: true` autocapture and manual screen tracking via `onReady`/`onStateChange` callbacks.
- `android/app/build.gradle` — Added `react-native-config` dotenv Gradle plugin for Android env var support.
- `src/store/modules/auth/sagas.js` — `posthog.identify()` on sign-in to link events to the authenticated user; `posthog.reset()` on sign-out; events for `user_signed_in`, `sign_in_failed`, `user_signed_out`.
- `src/store/modules/teams/sagas.js` — Events for `team_created`, `team_creation_failed`, `team_selected`.
- `src/store/modules/projects/sagas.js` — Events for `project_created`, `project_creation_failed`.
- `src/store/modules/members/sagas.js` — Events for `member_invited`, `member_invite_failed`, `member_role_updated`, `member_role_update_failed`.

**Packages installed:**
- `posthog-react-native` — PostHog React Native SDK
- `react-native-config` — Environment variable support (reads `.env` at build time)
- `react-native-svg` — Required peer dependency of `posthog-react-native`

> **iOS note:** Run `cd ios && pod install` after installing to link native dependencies.

## Events

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signed in | `src/store/modules/auth/sagas.js` |
| `sign_in_failed` | Sign-in attempt failed with invalid credentials | `src/store/modules/auth/sagas.js` |
| `user_signed_out` | User signed out of the app | `src/store/modules/auth/sagas.js` |
| `team_created` | User created a new team | `src/store/modules/teams/sagas.js` |
| `team_creation_failed` | Team creation failed | `src/store/modules/teams/sagas.js` |
| `team_selected` | User switched active team | `src/store/modules/teams/sagas.js` |
| `project_created` | User created a new project | `src/store/modules/projects/sagas.js` |
| `project_creation_failed` | Project creation failed | `src/store/modules/projects/sagas.js` |
| `member_invited` | User invited a member to the team | `src/store/modules/members/sagas.js` |
| `member_invite_failed` | Member invite failed | `src/store/modules/members/sagas.js` |
| `member_role_updated` | User updated a member's role | `src/store/modules/members/sagas.js` |
| `member_role_update_failed` | Member role update failed | `src/store/modules/members/sagas.js` |

## Next steps

Create an **"Analytics basics"** dashboard in PostHog with these five insights:

1. **Daily Sign-ins** — Trends chart for `user_signed_in` over the last 30 days. Shows daily active users returning to the app.

2. **Sign-in Funnel** — Funnel from `user_signed_in` → `team_selected` → `project_created`. Identifies where users drop off after authenticating.

3. **Team & Project Creation** — Trends chart showing `team_created` and `project_created` side-by-side. Tracks new workspace growth over time.

4. **Member Invitation Rate** — Trends chart of `member_invited` vs `user_signed_in`. Helps measure virality (invites per active user).

5. **Error Rate** — Trends chart for `sign_in_failed`, `team_creation_failed`, `project_creation_failed`, and `member_invite_failed` stacked. Monitors failure rates across key actions.

Go to your PostHog project to create these: https://us.posthog.com/project/238460/insights/new

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
