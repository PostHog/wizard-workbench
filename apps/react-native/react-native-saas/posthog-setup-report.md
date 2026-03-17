<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your React Native SaaS project. Here is a summary of all changes made:

- **New file `src/config/posthog.js`**: Initializes the PostHog client using `react-native-config` to load `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `.env`. Analytics are gracefully disabled if no token is configured.
- **Updated `src/routes.js`**: Added `PostHogProvider` (with touch autocapture enabled) inside `NavigationContainer` for React Navigation v7 compatibility. Manual screen tracking via `posthog.screen()` on navigation state changes.
- **Updated `src/store/modules/auth/sagas.js`**: User identification (`posthog.identify`) and `user_signed_in` capture on successful login; `user_sign_in_failed` capture on error; `user_signed_out` capture and `posthog.reset()` on logout.
- **Updated `src/store/modules/projects/sagas.js`**: `project_created` capture on successful project creation; exception tracking on failure.
- **Updated `src/store/modules/teams/sagas.js`**: `team_created` capture on team creation; `team_selected` capture when user switches teams; exception tracking on failure.
- **Updated `src/store/modules/members/sagas.js`**: `member_invited` capture on invite; `member_role_updated` capture on role change; exception tracking on failure.
- **`.env`**: Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` environment variables.

## Installed packages

The following packages were installed:

- `posthog-react-native` — PostHog React Native SDK
- `react-native-device-info` — required peer dependency
- `react-native-localize` — required peer dependency
- `react-native-config` — loads `.env` variables at build time
- `react-native-svg` — required peer dependency for surveys feature

> **iOS note:** After installing, run `cd ios && pod install` to link native dependencies.

## Events tracked

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signed in | `src/store/modules/auth/sagas.js` |
| `user_sign_in_failed` | Sign in attempt failed (invalid credentials) | `src/store/modules/auth/sagas.js` |
| `user_signed_out` | User signed out | `src/store/modules/auth/sagas.js` |
| `project_created` | User created a new project | `src/store/modules/projects/sagas.js` |
| `team_created` | User created a new team | `src/store/modules/teams/sagas.js` |
| `team_selected` | User switched to a different team | `src/store/modules/teams/sagas.js` |
| `member_invited` | User invited a new member to the team | `src/store/modules/members/sagas.js` |
| `member_role_updated` | User updated a member's roles | `src/store/modules/members/sagas.js` |

## Next steps

To complete the setup, create an **"Analytics basics"** dashboard in PostHog with these suggested insights:

1. **Sign-in funnel** — Funnel from `user_signed_in` → `project_created` to measure activation
2. **Sign-in volume over time** — Trend of `user_signed_in` events
3. **Failed sign-ins** — Trend of `user_sign_in_failed` to monitor auth errors
4. **Team & project creation** — Trend of `team_created` and `project_created` events
5. **Churn indicator** — Trend of `user_signed_out` events

You can create these at: https://us.posthog.com/project/2/insights/new

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
