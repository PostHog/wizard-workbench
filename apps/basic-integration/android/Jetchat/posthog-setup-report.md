<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Jetchat Android (Kotlin/Compose) app. The following changes were made:

- **PostHog Android SDK** (`com.posthog:posthog-android:3.+`) added to `app/build.gradle.kts`.
- **`local.properties`** updated with `posthog.apiKey` and `posthog.host`; `buildConfigField` entries expose these safely to Kotlin source via `BuildConfig`.
- **`JetchatApplication.kt`** created — a custom `Application` subclass that calls `PostHogAndroid.setup()` in `onCreate()`, enabling autocapture of lifecycle events, screen views, deep links, session replay, and automatic error/crash tracking.
- **`AndroidManifest.xml`** updated: registered `JetchatApplication`, added `INTERNET` permission, and added `android:label` to `NavActivity` for accurate screen-view tracking.
- **`MainViewModel.kt`** — `login()` calls `PostHog.identify()` then `PostHog.capture("user_logged_in")`; `logout()` captures `user_logged_out` and calls `PostHog.reset()`.
- **`NavActivity.kt`** — `onChatClicked` captures `channel_switched`; `onProfileClicked` captures `profile_viewed`.
- **`conversation/Conversation.kt`** — author avatar clicks capture `message_author_clicked`; tapping @mentions in text captures `message_author_clicked`; tapping links captures `message_link_clicked`.
- **`conversation/UserInput.kt`** — message send (both keyboard IME and send button) captures `message_sent`; opening the emoji panel captures `emoji_selector_opened`; starting a voice recording captures `voice_recording_started`; cancelling captures `voice_recording_cancelled`.
- **`components/JetchatDrawer.kt`** — tapping "Add widget" captures `add_widget_clicked`.

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logs in with a username and password | `MainViewModel.kt` |
| `user_logged_out` | User explicitly logs out via the drawer logout action | `MainViewModel.kt` |
| `message_sent` | User sends a message in a chat channel | `conversation/UserInput.kt` |
| `channel_switched` | User switches to a different chat channel from the drawer | `NavActivity.kt` |
| `profile_viewed` | User opens a member's profile screen | `NavActivity.kt` |
| `emoji_selector_opened` | User opens the emoji selector panel | `conversation/UserInput.kt` |
| `voice_recording_started` | User begins recording a voice message | `conversation/UserInput.kt` |
| `voice_recording_cancelled` | User cancels a voice message recording | `conversation/UserInput.kt` |
| `message_author_clicked` | User taps a message author avatar or @mention | `conversation/Conversation.kt` |
| `message_link_clicked` | User taps a hyperlink in a chat message bubble | `conversation/Conversation.kt` |
| `add_widget_clicked` | User taps the option to add the home screen widget | `components/JetchatDrawer.kt` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard:** https://us.posthog.com/project/483112/dashboard/1751155
- Login funnel (user_logged_in → message_sent): https://us.posthog.com/project/483112/insight/9585134
- Messages sent over time: https://us.posthog.com/project/483112/insight/9585136
- User logins over time: https://us.posthog.com/project/483112/insight/9585137
- Channel engagement by channel_name: https://us.posthog.com/project/483112/insight/9585145
- Emoji & voice feature adoption: https://us.posthog.com/project/483112/insight/9585147

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `posthog.apiKey` and `posthog.host` to a `local.properties.example` (or equivalent onboarding doc) so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
