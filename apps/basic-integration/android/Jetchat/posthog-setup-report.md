<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Jetchat Android application. Here's what was done:

**SDK Installation:** The PostHog Android SDK (`com.posthog:posthog-android:3.+`) was added to `gradle/libs.versions.toml` and `app/build.gradle.kts`. PostHog credentials are loaded from `local.properties` (gitignored) and exposed to the app via `BuildConfig` fields — no secrets are hardcoded.

**Application class:** A new `JetchatApplication` class was created and registered in `AndroidManifest.xml`. PostHog is initialized here on app startup with `captureApplicationLifecycleEvents`, `captureScreenViews`, and `captureDeepLinks` enabled, so lifecycle events and screen transitions are tracked automatically.

**User identification:** `PostHog.identify()` is called in `MainViewModel.login()` using the username as the distinct ID, linking all future events to the authenticated user. `PostHog.reset()` is called on logout to unlink the device from the user session.

**Event capture:** Twelve custom events were added across five files covering the main user flows — authentication, messaging, voice recording, emoji usage, navigation, and widget pinning.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logs in | `MainViewModel.kt` |
| `user_logged_out` | User taps the logout button | `MainViewModel.kt` |
| `message_sent` | User sends a chat message | `Conversation.kt` |
| `message_dropped` | User drops text via drag-and-drop | `Conversation.kt` |
| `voice_recording_started` | User begins a voice recording | `UserInput.kt` |
| `voice_recording_completed` | User finishes and sends a voice recording | `UserInput.kt` |
| `voice_recording_cancelled` | User cancels a voice recording by swiping | `UserInput.kt` |
| `emoji_selector_opened` | User opens the emoji picker | `UserInput.kt` |
| `emoji_sent` | User inserts an emoji into a message | `UserInput.kt` |
| `channel_switched` | User navigates to a different channel | `NavActivity.kt` |
| `profile_viewed` | User opens another user's profile | `NavActivity.kt` |
| `widget_added` | User pins the Jetchat widget to home screen | `JetchatDrawer.kt` |

## Next steps

To visualize your analytics data, create an **"Analytics basics"** dashboard in PostHog with these five insights:

1. **Daily active logins** — Trends chart for `user_logged_in` over the last 30 days. Tracks your daily active user count.

2. **Message volume** — Trends chart for `message_sent` over the last 30 days. Core engagement signal.

3. **Login → Message sent funnel** — Funnel from `user_logged_in` → `message_sent`. Measures what share of sessions result in a sent message.

4. **Voice recording completion rate** — Trends chart comparing `voice_recording_started`, `voice_recording_completed`, and `voice_recording_cancelled`. Tracks voice feature adoption and drop-off.

5. **Channel switch activity** — Trends chart for `channel_switched`. Measures how often users explore multiple channels (retention signal).

You can create these at [/insights](https://us.posthog.com/project/2/insights) and organize them in a new [dashboard](https://us.posthog.com/project/2/dashboard).

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-android/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
