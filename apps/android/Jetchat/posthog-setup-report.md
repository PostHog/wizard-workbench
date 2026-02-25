<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Jetchat Android application. Here is a summary of all changes made:

## Changes Made

### 1. `app/build.gradle.kts`
- Added `import java.util.Properties` to read `local.properties`
- Added a `localProperties` block that reads `posthog.apiKey` and `posthog.host` from `local.properties`
- Added two `buildConfigField` entries in `defaultConfig` to expose `POSTHOG_API_KEY` and `POSTHOG_HOST` as typed constants via `BuildConfig`
- Enabled `buildConfig = true` in `buildFeatures`
- Added `implementation("com.posthog:posthog-android:3.+")` to the `dependencies` block

### 2. `app/src/main/java/com/example/compose/jetchat/JetchatApplication.kt` *(new file)*
- Created a new `Application` subclass that initializes `PostHogAndroid` in `onCreate()` using `BuildConfig.POSTHOG_API_KEY` and `BuildConfig.POSTHOG_HOST`
- Enabled `captureApplicationLifecycleEvents`, `captureScreenViews`, `captureDeepLinks`, and `errorTrackingConfig.autoCapture`

### 3. `app/src/main/AndroidManifest.xml`
- Registered `JetchatApplication` via `android:name=".JetchatApplication"` on the `<application>` tag
- Added `android:label="@string/app_name"` to `NavActivity` to enable accurate screen view auto-capture

### 4. `app/src/main/java/com/example/compose/jetchat/MainViewModel.kt`
- Added `PostHog.identify()` in `login()` to link the username as a distinct ID with user properties
- Added `PostHog.capture("user_logged_in")` in `login()`
- Added `PostHog.capture("user_logged_out")` in `logout()`
- Added `PostHog.reset()` in `logout()` to clear the session and unlink events

### 5. `app/src/main/java/com/example/compose/jetchat/conversation/ConversationFragment.kt`
- Added `PostHog.capture("conversation_viewed")` in `onCreateView()` with the `channel` property

### 6. `app/src/main/java/com/example/compose/jetchat/conversation/Conversation.kt`
- Added `PostHog.capture("message_sent")` in the `UserInput.onMessageSent` lambda with `channel` and `message_length` properties
- Added `PostHog.capture("message_drag_dropped")` in `dragAndDropCallback.onDrop()` with the `channel` property

### 7. `app/src/main/java/com/example/compose/jetchat/conversation/UserInput.kt`
- Added `PostHog.capture("voice_recording_started")` in `RecordButton.onStartRecording` when recording begins
- Added `PostHog.capture("voice_recording_cancelled")` in `RecordButton.onCancelRecording` when recording is cancelled
- Added `PostHog.capture("emoji_selected")` in `EmojiTable` click handler with the `emoji` property

### 8. `app/src/main/java/com/example/compose/jetchat/profile/ProfileFragment.kt`
- Added `PostHog.capture("profile_viewed")` in `onAttach()` with the `user_id` property

### 9. `app/src/main/java/com/example/compose/jetchat/components/JetchatDrawer.kt`
- Added `PostHog.capture("channel_switched")` with `channel` property to each `ChatItem` click handler
- Added `PostHog.capture("widget_add_requested")` in `addWidgetToHomeScreen()` when the user pins the widget

### 10. `local.properties` *(updated)*
- Added `posthog.apiKey` and `posthog.host` keys (gitignored)

## Instrumented Events

| Event Name | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully logs in. Calls `PostHog.identify()` to link events to the user. | `MainViewModel.kt` |
| `user_logged_out` | Fired when a user logs out. Calls `PostHog.reset()` to clear the session. | `MainViewModel.kt` |
| `conversation_viewed` | Fired when the conversation screen is opened. Top-of-funnel event for core user journey. | `ConversationFragment.kt` |
| `message_sent` | Fired when a user sends a chat message. Core engagement metric, includes `channel` and `message_length`. | `Conversation.kt` |
| `message_drag_dropped` | Fired when a user drags and drops text content into the conversation. | `Conversation.kt` |
| `voice_recording_started` | Fired when a user begins recording a voice message. Tracks voice feature adoption. | `UserInput.kt` |
| `voice_recording_cancelled` | Fired when a user cancels a voice recording. Identifies friction in the voice flow. | `UserInput.kt` |
| `emoji_selected` | Fired when a user taps an emoji from the emoji picker. Includes the `emoji` property. | `UserInput.kt` |
| `profile_viewed` | Fired when a user navigates to a profile screen. Includes the `user_id` property. | `ProfileFragment.kt` |
| `channel_switched` | Fired when a user selects a different chat channel from the drawer. Includes `channel` property. | `JetchatDrawer.kt` |
| `widget_add_requested` | Fired when a user taps 'Add widget to home screen'. Tracks widget discoverability. | `JetchatDrawer.kt` |

## Next steps

We've designed a **"Analytics basics"** dashboard for you in PostHog to track the most important user behaviors. You can create it yourself at:

👉 **[https://us.posthog.com/project/238460/dashboard](https://us.posthog.com/project/238460/dashboard)**

Here are the 5 recommended insights to add to that dashboard:

### 1. Login-to-Message Conversion Funnel
**Type:** Funnel
**Steps:** `user_logged_in` → `conversation_viewed` → `message_sent`
**Purpose:** Measures how many users complete the core journey from login to sending a message.
[Create this funnel →](https://us.posthog.com/project/238460/insights/new#funnel)

### 2. Daily Active Users (DAU)
**Type:** Trend
**Event:** `user_logged_in` (Unique users, by day)
**Purpose:** Tracks daily engagement and identifies growth or churn signals.
[Create this trend →](https://us.posthog.com/project/238460/insights/new#trend)

### 3. Messages Sent Over Time
**Type:** Trend
**Event:** `message_sent` (Total count, by day)
**Purpose:** Measures core engagement — is messaging increasing or declining?
[Create this trend →](https://us.posthog.com/project/238460/insights/new#trend)

### 4. Feature Adoption Comparison
**Type:** Trend
**Events:** `emoji_selected`, `voice_recording_started`, `message_drag_dropped` (Unique users, by week)
**Purpose:** Compares how many users are using each messaging feature.
[Create this trend →](https://us.posthog.com/project/238460/insights/new#trend)

### 5. Logout Rate vs Login Rate
**Type:** Trend
**Events:** `user_logged_in`, `user_logged_out` (Total count, by day)
**Purpose:** Surface churn signals — days where logout rate spikes relative to login rate indicate potential issues.
[Create this trend →](https://us.posthog.com/project/238460/insights/new#trend)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-android/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
