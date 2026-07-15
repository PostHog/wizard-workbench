# PostHog post-wizard report

PostHog has been integrated into the React Native app with `posthog-react-native` and `react-native-config`. The client reads `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from the local `.env` file, is placed inside the React Navigation v7 container for touch autocapture, and manually records screen transitions. Native environment integration was added for Android and iOS.

Successful business operations now capture the following events. Events contain only non-PII operational metadata; the demo user's email is set as a person property via `identify()` rather than attached to an event. Errors during authentication and core mutations are sent with `captureException()`, and logout resets the PostHog identity.

| Event name | Description | File |
| --- | --- | --- |
| `sign_in_completed` | Captured when a user successfully signs in. | `src/store/modules/auth/sagas.js` |
| `project_created` | Captured when a project is created successfully. | `src/store/modules/projects/sagas.js` |
| `team_created` | Captured when a team is created successfully. | `src/store/modules/teams/sagas.js` |
| `team_selected` | Captured when a user selects an active team. | `src/store/modules/teams/sagas.js` |
| `member_invited` | Captured when a member invitation is sent successfully. | `src/store/modules/members/sagas.js` |
| `member_role_updated` | Captured when a member's roles are updated successfully. | `src/store/modules/members/sagas.js` |

## Next steps

- Dashboard and insights: not created because the configured PostHog MCP server could not be reached from this environment.
- Notebook: not created for the same reason.
- Re-run the dashboard/notebook creation once the PostHog MCP service is available.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

An agent skill folder remains in the project for future PostHog integration work.
