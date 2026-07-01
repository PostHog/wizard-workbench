# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Native SaaS application. Changes include:

- **`src/config/posthog.js`** (new file): PostHog client configured using `react-native-config` to load `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `.env`. Gracefully disabled when no token is set.
- **`src/routes.js`**: Added `PostHogProvider` inside `NavigationContainer` with manual screen tracking for React Navigation v7 compatibility. Added `PostHogErrorBoundary` inside the provider for automatic React render error capture.
- **`src/store/modules/auth/sagas.js`**: `posthog.identify()` called on successful sign-in; `posthog.capture('user_signed_in')` and `posthog.capture('user_signed_out')` added; `posthog.reset()` called on sign-out; `posthog.captureException()` added in the sign-in error handler.
- **`src/store/modules/teams/sagas.js`**: `posthog.capture('team_created')` added after successful team creation.
- **`src/components/TeamSwitcher/index.js`**: `usePostHog()` hook added; `posthog.capture('team_selected')` fires when a user switches teams.
- **`src/store/modules/projects/sagas.js`**: `posthog.capture('project_created')` added after successful project creation.
- **`src/store/modules/members/sagas.js`**: `posthog.capture('member_invited')` and `posthog.capture('member_role_updated')` added at the respective success points.

| Event name | Description | File |
|---|---|---|
| `user_signed_in` | Fires when a user successfully authenticates and receives a session token. | `src/store/modules/auth/sagas.js` |
| `user_signed_out` | Fires when a user explicitly signs out and their session is cleared. | `src/store/modules/auth/sagas.js` |
| `team_created` | Fires when a user successfully creates a new team. | `src/store/modules/teams/sagas.js` |
| `team_selected` | Fires when a user switches the active team context. | `src/components/TeamSwitcher/index.js` |
| `project_created` | Fires when a user successfully creates a new project within the active team. | `src/store/modules/projects/sagas.js` |
| `member_invited` | Fires when a user sends an invitation to a new team member. | `src/store/modules/members/sagas.js` |
| `member_role_updated` | Fires when an administrator updates a team member's roles. | `src/store/modules/members/sagas.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.i.posthog.com/project/483112/dashboard/1787476)
  - [Daily active users](https://us.i.posthog.com/project/483112/insights/9743965)
  - [Sign-in to team creation funnel](https://us.i.posthog.com/project/483112/insights/9743975)
  - [Project creation trend](https://us.i.posthog.com/project/483112/insights/9743984)
  - [Team collaboration](https://us.i.posthog.com/project/483112/insights/9743986)
  - [User churn](https://us.i.posthog.com/project/483112/insights/9743989)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — the auth saga already re-identifies users in the `init()` saga when a stored token is found, but confirm this works end-to-end in the app.
- [ ] After building for iOS, run `cd ios && pod install` to link the newly added native dependencies (`posthog-react-native`, `react-native-svg`, `react-native-config`).

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
