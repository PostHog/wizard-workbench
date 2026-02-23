<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Jetchat Android (Kotlin) application. Here's a summary of all changes made:

## Changes Summary

### New Files Created

- **`app/src/main/java/com/example/compose/jetchat/JetchatApplication.kt`** — New Android Application class that initializes PostHog on app startup using `PostHogAndroid.setup()`. Reads the API key and host from `BuildConfig`, enables lifecycle events, screen view tracking, deep link capture, and automatic error tracking.

- **`local.properties`** — Contains PostHog credentials (`posthog.apiKey` and `posthog.host`) read via Gradle into `BuildConfig`. This file is gitignored and secrets never leave the machine.

### Modified Files

- **`gradle/libs.versions.toml`** — Added `posthog = "3.+"` under `[versions]` and `posthog-android = { module = "com.posthog:posthog-android", version.ref = "posthog" }` under `[libraries]`.

- **`app/build.gradle.kts`** — Added `buildConfig = true` to `buildFeatures`, reads `local.properties`, adds `buildConfigField` entries for `POSTHOG_API_KEY` and `POSTHOG_HOST`, and adds `implementation(libs.posthog.android)` to dependencies.

- **`app/src/main/AndroidManifest.xml`** — Added `android:name=".JetchatApplication"` to the `<application>` tag to register the new Application class. Added `android:label="@string/app_name"` to the `<activity>` tag for accurate screen view tracking.

- **`app/src/main/java/com/example/compose/jetchat/MainViewModel.kt`** — Added PostHog event tracking for login (with `identify()`), logout (with `reset()`), and drawer open events.

- **`app/src/main/java/com/example/compose/jetchat/conversation/ConversationFragment.kt`** — Added `profile_viewed` event tracking when a user navigates to another user's profile.

- **`app/src/main/java/com/example/compose/jetchat/conversation/Conversation.kt`** — Added `message_sent` event tracking when a user sends a chat message.

## Event Tracking Table

| Event Name | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully logs in; also calls `PostHog.identify()` to associate events with the user | `MainViewModel.kt` |
| `user_logged_out` | Fired when a user logs out; also calls `PostHog.reset()` to clear the user session | `MainViewModel.kt` |
| `drawer_opened` | Fired when the navigation drawer is opened from any screen | `MainViewModel.kt` |
| `message_sent` | Fired when a user sends a chat message; includes `message_length` property | `Conversation.kt` |
| `profile_viewed` | Fired when a user navigates to another user's profile; includes `viewed_user` property | `ConversationFragment.kt` |

## Automatic Events (via PostHog SDK)

The PostHog Android SDK also automatically captures these events with no additional code:
- `Application Opened` / `Application Backgrounded` / `Application Installed` / `Application Updated`
- `$screen` — Screen view events (using `android:label` values from the manifest)
- `$exception` — Unhandled exceptions and crashes (via `errorTrackingConfig.autoCapture = true`)
- `Deep Link Opened`

## Recommended PostHog Dashboard Insights

Create an **"Analytics basics"** dashboard in your PostHog project with these insights:

1. **Daily Active Users (Login Rate)** — Trend of `user_logged_in` events over time
2. **Message Sending Volume** — Trend of `message_sent` events over time
3. **Login → Message Conversion Funnel** — Funnel from `user_logged_in` → `message_sent`
4. **User Churn Signal (Logout Rate)** — Trend of `user_logged_out` events over time
5. **Feature Engagement** — Comparison trend of `profile_viewed` vs `drawer_opened` events

Visit your [PostHog project](https://us.posthog.com) to create these insights once your app starts sending events.

## Next Steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Log in to [PostHog](https://us.posthog.com) and create a new dashboard named "Analytics basics"
- Add the 5 insights listed above to track key user behaviors
- Sync Gradle in Android Studio to download the PostHog SDK
- Build and run the app — events will start appearing in PostHog immediately

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
