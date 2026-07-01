<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Jetchat Android app. Here is a summary of all changes made:

- **New file — `JetchatApplication.kt`**: Created an `Application` subclass that initializes PostHog via `PostHogAndroid.setup()` with lifecycle event capture, screen view tracking, session replay, and automatic error tracking all enabled.
- **`AndroidManifest.xml`**: Registered `JetchatApplication` as the app's `Application` class, added the `INTERNET` permission, and added an `android:label` attribute to `NavActivity` for accurate screen view tracking.
- **`gradle/libs.versions.toml`**: Added `posthog = "3.31.0"` to the versions catalog and `posthog-android` to the libraries catalog.
- **`app/build.gradle.kts`**: Enabled `buildConfig = true`, loaded PostHog credentials from `local.properties`, and exposed them as `BuildConfig.POSTHOG_API_KEY` and `BuildConfig.POSTHOG_HOST`. Added the `posthog-android` dependency.
- **`local.properties`**: Populated with the PostHog API key and host (gitignored).
- **`MainViewModel.kt`**: Added `PostHog.identify()` on login and `PostHog.capture()` for `user_logged_in`. Added `PostHog.capture()` for `user_logged_out` and `PostHog.reset()` to clear the user identity.
- **`Conversation.kt`**: Added `PostHog.capture()` for `message_sent` (with `channel_name` and `message_length`) and `drag_drop_message_received` (with `channel_name`).
- **`UserInput.kt`**: Added `PostHog.capture()` for `emoji_selector_opened`, `voice_recording_started`, and `voice_recording_cancelled`.
- **`ConversationFragment.kt`**: Added `onResume()` override that fires a `conversation_viewed` event with `channel_name`.
- **`ProfileFragment.kt`**: Added `onResume()` override that fires a `profile_viewed` event with `viewed_user_id`.
- **`NavActivity.kt`**: Added `PostHog.capture()` for `chat_channel_switched` and `profile_opened_from_drawer` in the drawer navigation callbacks.

## Events

| Event Name | Description | File |
|---|---|---|
| `user_logged_in` | A user successfully logs into the app. | `MainViewModel.kt` |
| `user_logged_out` | A user logs out of the app. | `MainViewModel.kt` |
| `message_sent` | A user sends a message in a conversation channel. | `Conversation.kt` |
| `drag_drop_message_received` | A user drops text content into the conversation via drag and drop. | `Conversation.kt` |
| `voice_recording_started` | A user starts recording a voice message. | `UserInput.kt` |
| `voice_recording_cancelled` | A user cancels a voice recording before sending. | `UserInput.kt` |
| `emoji_selector_opened` | A user opens the emoji selector panel in the message input. | `UserInput.kt` |
| `conversation_viewed` | A user opens and views a conversation channel. | `ConversationFragment.kt` |
| `profile_viewed` | A user opens and views a user profile page. | `ProfileFragment.kt` |
| `chat_channel_switched` | A user switches to a different chat channel from the navigation drawer. | `NavActivity.kt` |
| `profile_opened_from_drawer` | A user navigates to a user's profile from the navigation drawer. | `NavActivity.kt` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.i.posthog.com/project/483112/dashboard/1787330)
- [Engagement Funnel: View to Message](https://us.i.posthog.com/project/483112/insights/z2GS405O)
- [Message Volume Over Time](https://us.i.posthog.com/project/483112/insights/w2bp7LDt)
- [Login vs Logout (Retention Signal)](https://us.i.posthog.com/project/483112/insights/vmfuGVtw)
- [Voice Recording: Started vs Cancelled](https://us.i.posthog.com/project/483112/insights/TJ9gQY6z)
- [Top Channels by Messages Sent](https://us.i.posthog.com/project/483112/insights/TKTzsrQM)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `posthog.apiKey` and `posthog.host` to a `local.properties.example` file (or your onboarding docs) so collaborators know what values to set.
- [ ] Confirm the returning-visitor path also calls `identify` — the current implementation only identifies on fresh login, which can leave returning sessions on anonymous distinct IDs. Consider persisting the username and calling `PostHog.identify()` on app startup if a session exists.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
