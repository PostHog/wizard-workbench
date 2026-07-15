# PostHog post-wizard report

The Android integration adds the PostHog Android SDK, initializes it once from the application class using values from `local.properties`, enables the SDK's default lifecycle, screen-view, deep-link, and exception capture behavior, and instruments the main authentication, messaging, profile, and logout actions. User-entered usernames are used only as the stable distinct ID for `identify`; they are not included in event properties. Message content is not captured.

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | Captures a successful demo login with the login method. | `app/src/main/java/com/example/compose/jetchat/MainViewModel.kt` |
| `message_sent` | Captures a sent message using message length and input method, excluding message content. | `app/src/main/java/com/example/compose/jetchat/conversation/UserInput.kt` |
| `profile_opened` | Captures opening a profile from the profile fragment. | `app/src/main/java/com/example/compose/jetchat/profile/ProfileFragment.kt` |
| `user_logged_out` | Captures logout before resetting the PostHog identity. | `app/src/main/java/com/example/compose/jetchat/MainViewModel.kt` |

## Next steps

The PostHog MCP dashboard and notebook steps could not be completed because the PostHog MCP server was unavailable during this run. No dashboard or insight links were created.

## Verify before merging

- [ ] Run a full production build and fix any lint or type errors introduced by the integration.
- [ ] Run the test suite; instrumented call sites may need updated mocks or fixtures.
- [ ] Add the exact `posthog.apiKey` and `posthog.host` properties to onboarding or environment documentation for collaborators.
- [ ] Confirm the returning-user path identifies users appropriately if persistent authentication is added later.

### Agent skill

The Android integration skill is available in `.claude/skills/integration-android` for future development.
