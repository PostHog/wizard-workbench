<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Native SaaS app. The SDK was installed (`posthog-react-native`, `react-native-svg`, `react-native-config`), a PostHog client config was created at `src/config/posthog.js`, and `PostHogProvider` was wired into the navigation stack in `src/routes.js` (placed inside `NavigationContainer` as required by React Navigation v7). Screen tracking fires automatically via `onStateChange`. Twelve custom events were instrumented across four Redux Saga files covering authentication, team management, project creation, and member management. User identification (`posthog.identify`) runs on every successful sign-in, and `posthog.reset()` is called on sign-out. Error tracking via `posthog.captureException` was added to all failure paths.

| Event | Description | File |
|-------|-------------|------|
| `user_signed_in` | User successfully authenticates with email and password. | `src/store/modules/auth/sagas.js` |
| `sign_in_failed` | User sign-in attempt fails due to invalid credentials. | `src/store/modules/auth/sagas.js` |
| `user_signed_out` | User signs out and their session is cleared. | `src/store/modules/auth/sagas.js` |
| `team_created` | User creates a new team in the workspace. | `src/store/modules/teams/sagas.js` |
| `team_creation_failed` | An error occurs while attempting to create a new team. | `src/store/modules/teams/sagas.js` |
| `team_switched` | User switches their active team context. | `src/store/modules/teams/sagas.js` |
| `project_created` | User creates a new project within their active team. | `src/store/modules/projects/sagas.js` |
| `project_creation_failed` | An error occurs while attempting to create a new project. | `src/store/modules/projects/sagas.js` |
| `member_invited` | User sends an invitation to a new team member by email. | `src/store/modules/members/sagas.js` |
| `member_invite_failed` | An error occurs while attempting to invite a member. | `src/store/modules/members/sagas.js` |
| `member_role_updated` | Admin updates the role assignment of an existing team member. | `src/store/modules/members/sagas.js` |
| `member_role_update_failed` | An error occurs while updating a team member's role. | `src/store/modules/members/sagas.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1818270)
- [Daily sign-ins](https://us.posthog.com/project/483112/insights/ImB3pcpX)
- [User activation funnel](https://us.posthog.com/project/483112/insights/cSXwE1UE)
- [Team & project creation](https://us.posthog.com/project/483112/insights/kcjEYjBD)
- [Member management activity](https://us.posthog.com/project/483112/insights/jqx3G74C)
- [Sign-in failure rate](https://us.posthog.com/project/483112/insights/2X3D0Xoy)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs. The current integration calls `identify` in the `signIn` saga; consider also calling it in the `init` saga once a stored token is found.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
