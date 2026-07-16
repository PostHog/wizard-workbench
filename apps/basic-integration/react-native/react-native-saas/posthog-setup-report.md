# PostHog post-wizard report

PostHog has been added to this bare React Native application. The SDK and React Native peer dependencies are installed, `react-native-config` supplies the PostHog project token and host from `.env`, and Android is configured to load those build-time values. The PostHog client is initialized once and its provider is nested inside the React Navigation v7 navigation container with touch autocapture enabled and automatic screen tracking disabled, as required for this navigation version.

Successful authentication, sign-out, workspace, project, and member-management actions are now captured without including user-entered names or email addresses in event properties. Authentication and business-operation failures are reported with `captureException`.

| Event name | Description | File |
| --- | --- | --- |
| `user_logged_in` | Records a successful sign-in after authentication completes. | `src/store/modules/auth/sagas.js` |
| `user_logged_out` | Records when an authenticated user signs out. | `src/store/modules/auth/sagas.js` |
| `team_created` | Records successful creation of a workspace team. | `src/store/modules/teams/sagas.js` |
| `team_selected` | Records when a user changes their active workspace team. | `src/store/modules/teams/sagas.js` |
| `project_created` | Records successful creation of a project in the active team. | `src/store/modules/projects/sagas.js` |
| `member_invited` | Records when an invitation is successfully sent to join the active team. | `src/store/modules/members/sagas.js` |
| `member_role_updated` | Records when a team member's role assignment is successfully updated. | `src/store/modules/members/sagas.js` |

## Next steps

A dashboard and notebook could not be created because the configured PostHog MCP server was unavailable in this environment. Create an **Analytics basics (wizard)** dashboard after MCP access is restored, then add insights for `user_logged_in`, `team_created`, `project_created`, `member_invited`, and `member_role_updated`.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Run `pod install` in `ios` before building the iOS app so the newly added native dependencies are linked.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
