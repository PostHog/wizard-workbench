# PostHog post-wizard report

The wizard has completed a deep integration of this Android Jetchat sample with PostHog. The setup adds the PostHog Android SDK dependency, initializes PostHog once in a new `Application` class using `BuildConfig` values sourced from environment variables, wires the application into the manifest, and instruments key product events across login, logout, drawer usage, message sending, and profile viewing. Session replay, lifecycle capture, screen capture, and automatic error tracking were enabled in the Android SDK configuration.

| Event name | Description | File |
| --- | --- | --- |
| `user_logged_in` | Captures when a user signs in to the chat application. | `app/src/main/java/com/example/compose/jetchat/MainViewModel.kt` |
| `user_logged_out` | Captures when a signed-in user logs out from the app. | `app/src/main/java/com/example/compose/jetchat/MainViewModel.kt` |
| `drawer_opened` | Captures when the navigation drawer is opened from the main chat UI. | `app/src/main/java/com/example/compose/jetchat/MainViewModel.kt` |
| `message_sent` | Captures when a chat message is sent from the conversation composer. | `app/src/main/java/com/example/compose/jetchat/conversation/Conversation.kt` |
| `profile_viewed` | Captures when a user profile screen is opened from the chat experience. | `app/src/main/java/com/example/compose/jetchat/profile/ProfileFragment.kt` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1846655)
- Insight: [Logins over time (wizard)](https://us.posthog.com/project/483112/insights/QHJ1Eabk)
- Insight: [Messages sent over time (wizard)](https://us.posthog.com/project/483112/insights/v5Pi6hwm)
- Insight: [Profile views over time (wizard)](https://us.posthog.com/project/483112/insights/y395PfGb)
- Insight: [Login to message funnel (wizard)](https://us.posthog.com/project/483112/insights/Lz6eeqJY)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
