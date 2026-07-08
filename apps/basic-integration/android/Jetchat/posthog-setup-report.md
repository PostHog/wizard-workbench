<wizard-report>
# PostHog post-wizard report

The wizard has completed a full PostHog integration for the Jetchat Android app. This included adding the PostHog Android SDK, creating an `Application` subclass to initialize PostHog at startup, wiring 12 analytics events across 6 files, identifying users on login/logout, and enabling session replay and automatic error tracking.

## Changes summary

| File | Change |
|------|--------|
| `gradle/libs.versions.toml` | Added `posthog = "3.+"` version and `posthog-android` library entry |
| `app/build.gradle.kts` | Added PostHog dependency, `buildConfigField` entries for API key and host (read from `local.properties`), and `buildConfig = true` |
| `local.properties` | Added `posthog.apiKey` and `posthog.host` values (gitignored) |
| `app/src/main/AndroidManifest.xml` | Registered `JetchatApplication` as the `android:name` and added `android:label` to `NavActivity` |
| `app/src/main/java/.../JetchatApplication.kt` | **New file** — Application class that calls `PostHogAndroid.setup()` with lifecycle events, screen views, session replay, and auto error capture enabled |
| `MainViewModel.kt` | `identify()` + `user_logged_in` on login; `user_logged_out` + `reset()` on logout; `nav_drawer_opened` on drawer open |
| `NavActivity.kt` | `channel_switched` (with channel name) on chat click; `profile_viewed` (with user ID) on profile click |
| `Conversation.kt` | `message_sent` (with channel name and message length) on send; `conversation_scrolled_to_bottom` on jump-to-bottom click |
| `UserInput.kt` | `emoji_picker_opened` when emoji selector toggled on; `voice_recording_started` on mic hold; `voice_recording_cancelled` on swipe-cancel |
| `JetchatDrawer.kt` | `widget_add_requested` when home screen widget is pinned |
| `ProfileFragment.kt` | `profile_more_options_opened` when the overflow icon is tapped |

## Events tracked

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logs in with a username and password. | `MainViewModel.kt` |
| `user_logged_out` | User logs out of the app via the navigation drawer. | `MainViewModel.kt` |
| `nav_drawer_opened` | User opens the navigation drawer. | `MainViewModel.kt` |
| `channel_switched` | User switches to a different chat channel from the navigation drawer. | `NavActivity.kt` |
| `profile_viewed` | User navigates to view another user's profile. | `NavActivity.kt` |
| `message_sent` | User sends a message in a chat channel. | `Conversation.kt` |
| `conversation_scrolled_to_bottom` | User taps the jump-to-bottom button to scroll to latest messages. | `Conversation.kt` |
| `emoji_picker_opened` | User opens the emoji selector panel in the message input area. | `UserInput.kt` |
| `voice_recording_started` | User begins recording a voice message. | `UserInput.kt` |
| `voice_recording_cancelled` | User cancels an in-progress voice message recording. | `UserInput.kt` |
| `widget_add_requested` | User requests to add the Jetchat home screen widget. | `JetchatDrawer.kt` |
| `profile_more_options_opened` | User taps the more options icon on a profile screen. | `ProfileFragment.kt` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1818071)
- [Daily Logins](https://us.posthog.com/project/483112/insights/bPMJnFNG)
- [Login to Message Sent Funnel](https://us.posthog.com/project/483112/insights/Y9N27c3p)
- [Messages Sent Over Time](https://us.posthog.com/project/483112/insights/1Ct9m5YY)
- [Feature Engagement Overview](https://us.posthog.com/project/483112/insights/YRzkoc5d)
- [Logout (Churn) Rate](https://us.posthog.com/project/483112/insights/a4g4yaON)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `posthog.apiKey` and `posthog.host` to `local.properties.example` (or any team onboarding docs) so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
