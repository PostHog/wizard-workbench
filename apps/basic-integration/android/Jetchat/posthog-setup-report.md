<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Jetchat Android application. The following changes were made:

- **SDK installed**: Added `com.posthog:posthog-android:3.+` dependency to `app/build.gradle.kts`
- **BuildConfig fields**: Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` read from `local.properties` via Gradle `buildConfigField`
- **Application class created**: `JetchatApplication.kt` initializes PostHog early in the app lifecycle with lifecycle event capture, screen view capture, and automatic error tracking enabled
- **AndroidManifest.xml updated**: Registered `JetchatApplication` as the application class
- **User identification**: `PostHog.identify()` is called on login with the username as `distinctId`, and `PostHog.reset()` is called on logout to clear the session
- **10 events instrumented** across 4 files

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully completes login | `MainViewModel.kt` |
| `user_logged_out` | User logs out via the drawer | `MainViewModel.kt` |
| `message_sent` | User sends a text message (with `channel` and `message_length` properties) | `Conversation.kt` |
| `author_profile_clicked` | User taps an author's avatar in conversation (with `author` property) | `Conversation.kt` |
| `voice_recording_started` | User starts a voice message recording | `UserInput.kt` |
| `voice_recording_completed` | User finishes recording a voice message | `UserInput.kt` |
| `voice_recording_cancelled` | User cancels a voice recording by swiping | `UserInput.kt` |
| `emoji_selector_opened` | User opens the emoji picker | `UserInput.kt` |
| `channel_switched` | User switches chat channel via drawer (with `channel` property) | `NavActivity.kt` |
| `profile_viewed` | User views a profile from the drawer (with `user_id` and `source` properties) | `NavActivity.kt` |

## Next steps

We attempted to create the "Analytics basics" dashboard automatically but the PostHog API key is missing the `dashboard:write` and `insight:write` scopes. You can create the dashboard manually in PostHog with the following 5 recommended insights:

1. **Daily Logins** — Trends chart for `user_logged_in` over time (daily). Tracks user acquisition and engagement.
2. **Messages Sent** — Trends chart for `message_sent` broken down by `channel`. Shows which channels are most active.
3. **Voice Recording Funnel** — Funnel from `voice_recording_started` → `voice_recording_completed` vs `voice_recording_cancelled`. Reveals friction in the voice feature.
4. **Feature Engagement** — Multi-series trends chart for `emoji_selector_opened`, `channel_switched`, and `author_profile_clicked`. Shows breadth of feature use.
5. **Login → Message Funnel** — Funnel from `user_logged_in` → `message_sent`. Core conversion funnel measuring how many logged-in users actually send messages.

Create the dashboard at [/dashboard](/dashboard) in your PostHog project.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-android/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
