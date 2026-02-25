<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Jetchat Android (Kotlin) app. The integration covers SDK initialization via a custom `Application` class, user identity management tied to the login/logout lifecycle, and event capture across all key user interactions including messaging, voice recording, profile browsing, and navigation.

## Changes summary

### New files created
| File | Purpose |
|------|---------|
| `app/src/main/java/com/example/compose/jetchat/JetchatApplication.kt` | Application subclass that initializes the PostHog Android SDK on app start, with lifecycle event capture, screen view tracking, deep link tracking, and auto error capture enabled |

### Modified files
| File | Changes |
|------|---------|
| `app/build.gradle.kts` | Added `posthog-android` dependency via version catalog, enabled `buildConfig`, injected `POSTHOG_API_KEY` and `POSTHOG_HOST` as `BuildConfig` fields read from `local.properties` |
| `gradle/libs.versions.toml` | Added `posthog = "3.31.0"` version entry and `posthog-android` library alias |
| `app/src/main/AndroidManifest.xml` | Registered `JetchatApplication` as the `android:name` of the `<application>` element; added `android:label` to `NavActivity` for screen-view tracking |
| `local.properties` | Added `posthog.apiKey` and `posthog.host` (kept out of version control via `.gitignore`) |

### Events instrumented

| Event name | Description | File |
|-----------|-------------|------|
| `user_logged_in` | Fired when a user logs in; also calls `PostHog.identify()` to associate the session with the username | `MainViewModel.kt` |
| `user_logged_out` | Fired on logout; followed by `PostHog.reset()` to clear the identity | `MainViewModel.kt` |
| `message_sent` | Fired when a chat message is sent; includes `channel` and `message_length` properties | `Conversation.kt` |
| `profile_viewed` | Fired when a profile screen is opened; includes `user_id` property | `ProfileFragment.kt` |
| `chat_channel_switched` | Fired when the user selects a different channel from the drawer; includes `channel` property | `NavActivity.kt` |
| `voice_recording_started` | Fired when the user presses and holds the record button | `UserInput.kt` |
| `voice_recording_completed` | Fired when the user releases the record button to send | `UserInput.kt` |
| `voice_recording_cancelled` | Fired when the user swipes to cancel a recording | `UserInput.kt` |
| `emoji_selector_opened` | Fired when the emoji panel is opened | `UserInput.kt` |
| `author_profile_clicked` | Fired when the user taps a message author's avatar; includes `author` property | `Conversation.kt` |
| `drawer_opened` | Fired when the navigation drawer is opened | `NavActivity.kt` |

### Autocaptured events (by the SDK automatically)
- `Application Opened` / `Application Backgrounded` / `Application Installed` / `Application Updated`
- `$screen` — screen-level navigation (uses `android:label` from the manifest)
- `Deep Link Opened`
- `$exception` — uncaught exceptions via `errorTrackingConfig.autoCapture = true`

## Next steps

To explore these events in PostHog, visit your project and create insights using the event names above. Suggested analyses:

- **Login → Message funnel**: `user_logged_in` → `message_sent` to measure onboarding activation
- **Voice recording completion rate**: `voice_recording_started` → `voice_recording_completed` vs `voice_recording_cancelled`
- **Most active channels**: Trends on `chat_channel_switched` broken down by the `channel` property
- **Profile discovery**: Trends on `author_profile_clicked` vs `profile_viewed`
- **Daily active users**: Unique users triggering any event per day

Visit your PostHog project: https://us.i.posthog.com/project/238460

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-android/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
