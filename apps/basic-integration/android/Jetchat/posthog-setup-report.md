# PostHog post-wizard report

The wizard integrated PostHog into this Android/Kotlin app. The Android SDK is configured through Gradle, with the public client token and host read from the gitignored `.env` file into `BuildConfig`. Analytics initializes once in `Application.onCreate()`, and the manifest registers that application class and labels the activity for automatic screen tracking. Session replay and automatic error tracking are enabled.

Login identifies the demo user and captures authentication activity without adding user-entered data to event properties. Logout resets the PostHog identity. Sending a chat message captures non-content metadata only.

| Event name | Description | File |
| --- | --- | --- |
| `user_logged_in` | Captures successful login after the app identifies the authenticated user. | `app/src/main/java/com/example/compose/jetchat/NavActivity.kt` |
| `user_logged_out` | Captures when an authenticated user signs out of the app. | `app/src/main/java/com/example/compose/jetchat/NavActivity.kt` |
| `message_sent` | Captures when a user sends a message with non-content contextual properties. | `app/src/main/java/com/example/compose/jetchat/conversation/Conversation.kt` |

## Next steps

A PostHog dashboard and shareable notebook could not be created because the configured PostHog MCP endpoint was unavailable in this environment. Create **Analytics basics (wizard)** in PostHog with trends for `user_logged_in`, `user_logged_out`, and `message_sent` once MCP access is restored.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
