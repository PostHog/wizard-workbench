# PostHog post-wizard report

The wizard integrated PostHog into this bare React Native application using build-time environment variables through `react-native-config`. It installed the React Native SDK and native peer dependencies, initialized a shared client, enabled touch autocapture and manual React Navigation v7 screen tracking, instrumented core authentication and workspace actions, reset identity on logout, and added exception capture around critical API flows. Event properties intentionally exclude user-entered names and email addresses.

| Event | Description | File |
|---|---|---|
| `user_signed_in` | A user successfully signed in to the application. | `src/store/modules/auth/sagas.js` |
| `user_signed_out` | A user signed out of the application. | `src/store/modules/auth/sagas.js` |
| `team_created` | A user successfully created a team. | `src/store/modules/teams/sagas.js` |
| `team_selected` | A user selected a team workspace. | `src/store/modules/teams/sagas.js` |
| `project_created` | A user successfully created a project. | `src/store/modules/projects/sagas.js` |
| `member_invited` | A user successfully invited a member. | `src/store/modules/members/sagas.js` |
| `member_role_updated` | A user successfully updated a member's roles. | `src/store/modules/members/sagas.js` |

## Next steps

The PostHog dashboard and notebook could not be created because the PostHog MCP service was unreachable during this run. Once connectivity is restored, create **Analytics basics (wizard)** using the exact events above.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Run CocoaPods installation on macOS so the new native dependencies are linked into the iOS application.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
