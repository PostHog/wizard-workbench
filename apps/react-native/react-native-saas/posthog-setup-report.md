<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Native SaaS application. Here is a summary of all changes made:

## What was integrated

- **`posthog-react-native`**, **`react-native-config`**, **`react-native-device-info`**, and **`react-native-localize`** were installed as dependencies.
- A **PostHog singleton client** (`src/config/posthog.js`) was created, reading API key and host from `.env` via `react-native-config`. Analytics gracefully disables itself if no key is configured.
- The **`PostHogProvider`** was added to `src/routes.js` inside `NavigationContainer` (required for React Navigation v7), with manual screen tracking via `onStateChange` and touch autocapture enabled.
- **User identification** (`posthog.identify`) is called on every sign-in with email as the distinct ID, using `$set` for current properties and `$set_once` for first-login date.
- **`posthog.reset()`** is called on sign-out to clear the distinct ID.
- **11 custom events** were instrumented across 3 saga files.
- Environment variables `POSTHOG_API_KEY` and `POSTHOG_HOST` were written to `.env` (`.gitignore`-covered).

## Instrumented events

| Event | Description | File |
|-------|-------------|------|
| `user_signed_in` | User successfully signed in (including demo mode) | `src/store/modules/auth/sagas.js` |
| `user_signed_out` | User signed out of the application | `src/store/modules/auth/sagas.js` |
| `sign_in_failed` | User sign-in attempt failed due to invalid credentials | `src/store/modules/auth/sagas.js` |
| `project_created` | User successfully created a new project | `src/store/modules/projects/sagas.js` |
| `project_creation_failed` | User failed to create a new project | `src/store/modules/projects/sagas.js` |
| `team_created` | User successfully created a new team | `src/store/modules/teams/sagas.js` |
| `team_creation_failed` | User failed to create a new team | `src/store/modules/teams/sagas.js` |
| `team_selected` | User switched to a different team | `src/store/modules/teams/sagas.js` |
| `member_invited` | User successfully invited a member to the team | `src/store/modules/members/sagas.js` |
| `member_invite_failed` | User failed to invite a member to the team | `src/store/modules/members/sagas.js` |
| `member_role_updated` | Admin updated the role of a team member | `src/store/modules/members/sagas.js` |

## Files changed

| File | Change |
|------|--------|
| `src/config/posthog.js` | **New** — PostHog client singleton using `react-native-config` env vars |
| `src/routes.js` | Added `PostHogProvider` (inside `NavigationContainer`), manual screen tracking via `onStateChange`, touch autocapture |
| `src/store/modules/auth/sagas.js` | Added `posthog.identify()`, `user_signed_in`, `sign_in_failed`, `user_signed_out`, `posthog.reset()` |
| `src/store/modules/projects/sagas.js` | Added `project_created`, `project_creation_failed` |
| `src/store/modules/teams/sagas.js` | Added `team_created`, `team_creation_failed`, `team_selected` |
| `src/store/modules/members/sagas.js` | Added `member_invited`, `member_invite_failed`, `member_role_updated` |
| `.env` | Added `POSTHOG_API_KEY` and `POSTHOG_HOST` (gitignored) |

## Next steps

To view your analytics, log in to PostHog and navigate to your project. Here are some suggested insights to create once data starts flowing:

- **Sign-in Funnel** — Compare `user_signed_in` vs `sign_in_failed` to monitor authentication success rates
- **Daily Active Sign-ins** — Trend of `user_signed_in` over time as a DAU proxy
- **Project & Team Creation** — Trend of `project_created` and `team_created` as product adoption signals
- **Member Collaboration Funnel** — `member_invited` vs `member_invite_failed` for invite health
- **Churn Signal** — `user_signed_out` over time as an early churn indicator

**For iOS:** Run `cd ios && pod install` to link the new native dependencies (`react-native-device-info`, `react-native-localize`, `react-native-config`).

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-react-native/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
