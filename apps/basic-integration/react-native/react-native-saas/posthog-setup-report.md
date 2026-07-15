# PostHog post-wizard report

PostHog was added to the bare React Native application using `posthog-react-native`, `react-native-config`, and `react-native-svg`. The client is initialized from `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`, and the provider wraps the navigation tree. Authentication and key workspace interactions now emit analytics events, identify authenticated sessions without placing entered email addresses in event properties, reset on logout, and capture sign-in exceptions.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | Records a successful sign-in with the authentication method. | `src/store/modules/auth/sagas.js` |
| `user_login_failed` | Records a failed sign-in attempt without credentials. | `src/store/modules/auth/sagas.js` |
| `user_logged_out` | Records when an authenticated user signs out. | `src/store/modules/auth/sagas.js` |
| `team_switcher_opened` | Records when a user opens the team switcher. | `src/pages/Main/index.js` |
| `member_panel_opened` | Records when a user opens the member panel. | `src/pages/Main/index.js` |

## Next steps

Dashboard and notebook creation could not be completed because the PostHog MCP server was unavailable during this run. No dashboard or insight links were created.

## Verify before merging

- [ ] Run a full production mobile build and fix any lint or type errors introduced by the integration.
- [ ] Run the test suite and update mocks or fixtures if needed.
- [ ] Add the exact PostHog environment variable names to `.env.example` and any collaborator/bootstrap documentation.
- [ ] Confirm the returning-visitor path identifies the user when restoring an authenticated session.
- [ ] Install iOS CocoaPods dependencies after adding the native packages, then build both iOS and Android.

### Agent skill

The integration skill is available under `.claude/skills/integration-react-native/` for future agent development.
