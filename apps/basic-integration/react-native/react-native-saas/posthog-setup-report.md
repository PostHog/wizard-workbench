<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your project. PostHog was added to this React Native app with `posthog-react-native`, `react-native-config`, and required native peers, environment variables were written to `.env`, Android was configured to load dotenv values during builds, and a shared PostHog client plus tracking helpers were added under `src/services`. The app now initializes PostHog through `PostHogProvider` inside the navigation container, manually captures React Navigation v7 screen views, identifies signed-in users on successful authentication, resets identity on logout, and captures business events and exception telemetry across authentication, team switching, team creation, project creation, member invites, and role updates.

| Event name | Description | File |
| --- | --- | --- |
| `sign_in_submitted` | Captures when a user submits the sign-in form. | `src/pages/SignIn/index.js` |
| `sign_in_succeeded` | Captures when authentication succeeds and a session starts. | `src/store/modules/auth/sagas.js` |
| `sign_in_failed` | Captures when authentication fails. | `src/store/modules/auth/sagas.js` |
| `signed_out` | Captures when a user signs out of the app. | `src/store/modules/auth/sagas.js` |
| `team_switcher_opened` | Captures when a user opens the team switcher drawer. | `src/pages/Main/index.js` |
| `members_drawer_opened` | Captures when a user opens the members drawer. | `src/pages/Main/index.js` |
| `team_selected` | Captures when a user switches to a different team. | `src/components/TeamSwitcher/index.js` |
| `team_created` | Captures when a new team is successfully created. | `src/store/modules/teams/sagas.js` |
| `team_creation_failed` | Captures when creating a team fails. | `src/store/modules/teams/sagas.js` |
| `project_created` | Captures when a new project is successfully created. | `src/store/modules/projects/sagas.js` |
| `project_creation_failed` | Captures when creating a project fails. | `src/store/modules/projects/sagas.js` |
| `member_invited` | Captures when a member invitation is successfully sent or added in demo mode. | `src/store/modules/members/sagas.js` |
| `member_invitation_failed` | Captures when inviting a member fails. | `src/store/modules/members/sagas.js` |
| `member_role_updated` | Captures when a member's roles are updated. | `src/store/modules/members/sagas.js` |
| `member_role_update_failed` | Captures when updating a member role fails. | `src/store/modules/members/sagas.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1831090)
- [Sign-in conversion funnel (wizard)](https://us.posthog.com/project/483112/insights/V8ur5wbb)
- [Sign-ins over time (wizard)](https://us.posthog.com/project/483112/insights/EU4VO6nL)
- [Projects created over time (wizard)](https://us.posthog.com/project/483112/insights/EqnKLPwt)
- [Members invited over time (wizard)](https://us.posthog.com/project/483112/insights/Mf7ktJTW)
- [Team selections total (wizard)](https://us.posthog.com/project/483112/insights/zkDUsXvd)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
