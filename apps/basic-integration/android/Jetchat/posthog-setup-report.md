# PostHog post-wizard report

The wizard integrated the PostHog Android SDK into Jetchat, initialized it once from a registered `Application` class, enabled automatic exception capture, and added analytics for authentication, chat selection, messages, and profile views. PostHog configuration is supplied through `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`, loaded into `BuildConfig` without placing values in Kotlin source. The debug APK was successfully built with `./gradlew :app:assembleDebug`.

| Event | Description | File |
| --- | --- | --- |
| `user_logged_in` | A user successfully enters the demo chat experience. | `app/src/main/java/com/example/compose/jetchat/MainViewModel.kt` |
| `user_logged_out` | A signed-in user logs out of the chat experience. | `app/src/main/java/com/example/compose/jetchat/MainViewModel.kt` |
| `message_sent` | A user sends a text message in a channel. | `app/src/main/java/com/example/compose/jetchat/conversation/Conversation.kt` |
| `message_dropped` | A user adds a message to a channel through drag and drop. | `app/src/main/java/com/example/compose/jetchat/conversation/Conversation.kt` |
| `profile_viewed` | A user opens their own or another member's profile. | `app/src/main/java/com/example/compose/jetchat/profile/ProfileFragment.kt` |
| `chat_selected` | A user selects a chat from the navigation drawer. | `app/src/main/java/com/example/compose/jetchat/NavActivity.kt` |

## Next steps

Dashboard and notebook creation could not be completed because the PostHog MCP server was unavailable in this environment. Reconnect the server, then create `Analytics basics (wizard)` with insights using the event names above.

## Verify before merging

- [ ] Run a full production build and fix any lint or compile errors; the wizard verified the debug build only.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — the current demo only identifies on a fresh login.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
