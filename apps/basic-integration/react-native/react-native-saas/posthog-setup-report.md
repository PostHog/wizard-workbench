<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this React Native SaaS app. The following changes were made:

- **`src/config/posthog.js`** (new): Initialises the PostHog client using `react-native-config` to load `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from the `.env` file at build time.
- **`src/routes.js`**: Wraps the navigator inside `PostHogProvider` (placed inside `NavigationContainer` for React Navigation v7 compatibility). Adds manual screen-view tracking via `onReady`/`onStateChange`, with autocapture enabled for touch events.
- **`src/store/modules/auth/sagas.js`**: Captures `user_signed_in` (with `posthog.identify` to link the email), `user_sign_in_failed`, and `user_signed_out` (with `posthog.reset`).
- **`src/store/modules/projects/sagas.js`**: Captures `project_created` and `project_creation_failed`.
- **`src/store/modules/teams/sagas.js`**: Captures `team_created`, `team_creation_failed`, and `team_switched`.
- **`src/store/modules/members/sagas.js`**: Captures `member_invited`, `member_invite_failed`, and `member_role_updated`.
- **`.env`** (new): Created with `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` values.
- **`react-native-config`**, **`posthog-react-native`**, and **`react-native-svg`** (peer dep) installed.

| Event name | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signs in to the app | `src/store/modules/auth/sagas.js` |
| `user_sign_in_failed` | User attempted to sign in but authentication failed | `src/store/modules/auth/sagas.js` |
| `user_signed_out` | User signs out of the app | `src/store/modules/auth/sagas.js` |
| `project_created` | User successfully creates a new project | `src/store/modules/projects/sagas.js` |
| `project_creation_failed` | An error occurred while creating a new project | `src/store/modules/projects/sagas.js` |
| `team_created` | User successfully creates a new team | `src/store/modules/teams/sagas.js` |
| `team_switched` | User switches the active team context | `src/store/modules/teams/sagas.js` |
| `member_invited` | User successfully invites a new member to the team | `src/store/modules/members/sagas.js` |
| `member_invite_failed` | An error occurred while inviting a member to the team | `src/store/modules/members/sagas.js` |
| `member_role_updated` | User updates the role of a team member | `src/store/modules/members/sagas.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behaviour, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1761248)
- [User sign-ins over time](https://us.posthog.com/project/483112/insights/8VQzg1Wk)
- [Sign-in to project creation funnel](https://us.posthog.com/project/483112/insights/E5mkIb2B)
- [Sign-in failures vs successes](https://us.posthog.com/project/483112/insights/AhHKyaR4)
- [Project and team creation](https://us.posthog.com/project/483112/insights/2lx9GEKW)
- [Member management activity](https://us.posthog.com/project/483112/insights/EDeV3ye0)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] For iOS, run `cd ios && pod install` after adding the new native packages (`posthog-react-native`, `react-native-svg`, `react-native-config`).
- [ ] Confirm the returning-visitor path also calls `identify` — users who resume a session without re-logging in are currently re-identified only if a fresh sign-in is triggered.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
