<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your React Native SaaS app. Here's a summary of all changes made:

**New files created:**
- `src/config/posthog.js` — PostHog client singleton, initialized with environment variables via `react-native-config`. Autocapture of app lifecycle events and touch interactions enabled.
- `.env` — Environment variables for `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` (git-ignored).

**Modified files:**
- `src/routes.js` — Added `PostHogProvider` (inside `NavigationContainer` for React Navigation v7 compatibility) and manual screen tracking via `onStateChange`.
- `src/store/modules/auth/sagas.js` — Added `user_signed_in` + `posthog.identify()` on sign-in success, `sign_in_failed` on credential error, and `user_signed_out` + `posthog.reset()` on sign-out.
- `src/store/modules/teams/sagas.js` — Added `team_created` and `team_switched` events.
- `src/store/modules/projects/sagas.js` — Added `project_created` event.
- `src/store/modules/members/sagas.js` — Added `member_invited` and `member_role_updated` events.

**Packages installed:** `posthog-react-native`, `react-native-svg`, `react-native-device-info`, `react-native-localize`, `react-native-config`

> **iOS note:** After installing, run `pod install` in the `ios/` directory to link native dependencies.

> **Android note:** `react-native-config` requires a [one-line addition](https://github.com/luggit/react-native-config#android) to `android/app/build.gradle` to expose `.env` variables at build time.

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signs in (includes demo mode) | `src/store/modules/auth/sagas.js` |
| `user_signed_out` | User signs out and session is cleared | `src/store/modules/auth/sagas.js` |
| `sign_in_failed` | Sign-in attempt fails due to invalid credentials | `src/store/modules/auth/sagas.js` |
| `team_created` | User successfully creates a new team | `src/store/modules/teams/sagas.js` |
| `team_switched` | User selects/switches to a different team | `src/store/modules/teams/sagas.js` |
| `project_created` | User successfully creates a new project | `src/store/modules/projects/sagas.js` |
| `member_invited` | User sends an invite to a new team member | `src/store/modules/members/sagas.js` |
| `member_role_updated` | Administrator updates a member's role | `src/store/modules/members/sagas.js` |

## Next steps

Create an **"Analytics basics"** dashboard in PostHog and add these pre-configured insights:

- [Onboarding funnel](https://us.posthog.com/project/2/insights/new?insight=FUNNELS&events=%5B%7B%22id%22%3A+%22user_signed_in%22%2C+%22name%22%3A+%22user_signed_in%22%2C+%22type%22%3A+%22events%22%2C+%22order%22%3A+0%7D%2C+%7B%22id%22%3A+%22team_switched%22%2C+%22name%22%3A+%22team_switched%22%2C+%22type%22%3A+%22events%22%2C+%22order%22%3A+1%7D%2C+%7B%22id%22%3A+%22project_created%22%2C+%22name%22%3A+%22project_created%22%2C+%22type%22%3A+%22events%22%2C+%22order%22%3A+2%7D%5D) — Conversion funnel: sign in → team switch → project created
- [Daily sign-ins trend](https://us.posthog.com/project/2/insights/new?insight=TRENDS&events=%5B%7B%22id%22%3A+%22user_signed_in%22%2C+%22name%22%3A+%22user_signed_in%22%2C+%22type%22%3A+%22events%22%7D%5D) — Track active user login volume over time
- [Sign-in failures trend](https://us.posthog.com/project/2/insights/new?insight=TRENDS&events=%5B%7B%22id%22%3A+%22sign_in_failed%22%2C+%22name%22%3A+%22sign_in_failed%22%2C+%22type%22%3A+%22events%22%7D%5D) — Monitor authentication failure rate (churn signal)
- [Project creation trend](https://us.posthog.com/project/2/insights/new?insight=TRENDS&events=%5B%7B%22id%22%3A+%22project_created%22%2C+%22name%22%3A+%22project_created%22%2C+%22type%22%3A+%22events%22%7D%5D) — Track new project creation as a core activation metric
- [Member invitations trend](https://us.posthog.com/project/2/insights/new?insight=TRENDS&events=%5B%7B%22id%22%3A+%22member_invited%22%2C+%22name%22%3A+%22member_invited%22%2C+%22type%22%3A+%22events%22%7D%5D) — Track team growth via member invitations

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-native/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
