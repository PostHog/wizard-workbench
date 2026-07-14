# PostHog post-wizard report

The wizard completed a React Native PostHog integration for this project using `posthog-react-native` with `react-native-config`-backed environment variables. It initialized the SDK with a shared client, placed `PostHogProvider` inside `NavigationContainer` for React Navigation v7 compatibility, enabled touch autocapture, added manual screen tracking, forwarded `X-POSTHOG-DISTINCT-ID` on API requests, and instrumented key auth, project, team, and member-management flows. It also added identify/reset handling around login and logout, plus targeted exception capture for important async flows.

| Event | Description | File |
| --- | --- | --- |
| `sign_in_submitted` | Captures when a user submits the sign-in form. | `src/pages/SignIn/index.js` |
| `sign_in_succeeded` | Captures when sign-in succeeds and the user is identified. | `src/store/modules/auth/sagas.js` |
| `sign_in_failed` | Captures failed sign-in attempts and related auth errors. | `src/store/modules/auth/sagas.js` |
| `sign_out_clicked` | Captures when a signed-in user initiates sign-out. | `src/pages/Main/index.js` |
| `team_drawer_opened` | Captures when the team switcher drawer is opened. | `src/pages/Main/index.js` |
| `members_drawer_opened` | Captures when the members drawer is opened. | `src/pages/Main/index.js` |
| `projects_loaded` | Captures when project data loads for the active team. | `src/store/modules/projects/sagas.js` |
| `project_creation_submitted` | Captures when a user submits the new-project form. | `src/components/NewProject/index.js` |
| `project_created` | Captures successful project creation. | `src/store/modules/projects/sagas.js` |
| `project_create_failed` | Captures failed project creation attempts. | `src/store/modules/projects/sagas.js` |
| `team_creation_modal_opened` | Captures when the create-team modal is opened. | `src/components/TeamSwitcher/index.js` |
| `team_creation_submitted` | Captures when a user submits the new-team form. | `src/components/NewTeam/index.js` |
| `team_created` | Captures successful team creation. | `src/store/modules/teams/sagas.js` |
| `team_create_failed` | Captures failed team creation attempts. | `src/store/modules/teams/sagas.js` |
| `team_switcher_item_selected` | Captures when a team is selected from the switcher UI. | `src/components/TeamSwitcher/index.js` |
| `team_selected` | Captures when the active team changes and team context is registered. | `src/store/modules/teams/sagas.js` |
| `members_loaded` | Captures when members load for the active team. | `src/store/modules/members/sagas.js` |
| `member_invite_modal_opened` | Captures when the invite-member modal is opened. | `src/components/Members/index.js` |
| `member_invite_submitted` | Captures when an invite is submitted. | `src/components/InviteMember/index.js` |
| `member_invited` | Captures successful member invitations. | `src/store/modules/members/sagas.js` |
| `member_role_editor_opened` | Captures when the role editor is opened for a member. | `src/components/Members/index.js` |
| `member_role_update_submitted` | Captures when a role change is submitted. | `src/components/RoleUpdater/index.js` |
| `member_role_updated` | Captures successful member role updates. | `src/store/modules/members/sagas.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1846837)
- Insight: [Sign-in submissions (wizard)](https://us.posthog.com/project/483112/insights/ku59HiPJ)
- Insight: [Sign-in conversion funnel (wizard)](https://us.posthog.com/project/483112/insights/ocfWALFS)
- Insight: [Project creation outcomes (wizard)](https://us.posthog.com/project/483112/insights/sYPWYt9B)
- Insight: [Team selection activity (wizard)](https://us.posthog.com/project/483112/insights/bPs2Mq05)
- Insight: [Member invitation and role updates (wizard)](https://us.posthog.com/project/483112/insights/LXI13MPe)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.
- [ ] Run `pod install` in `ios/` before the next iOS build so the new native dependencies are linked.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
