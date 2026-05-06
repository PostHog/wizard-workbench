<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Jetchat Android app. Here is a summary of all changes made:

## Changes made

### New files
- **`app/src/main/java/com/example/compose/jetchat/JetchatApplication.kt`** — New `Application` subclass that initializes PostHog on app start using `PostHogAndroid.setup()` with API key and host read from `BuildConfig`.
- **`local.properties`** — PostHog API key and host stored as `posthog.apiKey` and `posthog.host` (gitignored).

### Modified files
- **`app/build.gradle.kts`** — Added `import java.util.Properties`, reads `local.properties` to expose `POSTHOG_API_KEY` and `POSTHOG_HOST` as `BuildConfig` fields; enabled `buildConfig = true`; added `implementation("com.posthog:posthog-android:3.+")` dependency.
- **`app/src/main/AndroidManifest.xml`** — Registered `JetchatApplication` as the app's `android:name`; added `android:label` to `NavActivity` for accurate screen view tracking.
- **`MainViewModel.kt`** — Added `PostHog.identify()` + `PostHog.capture("user logged in")` in `login()`; added `PostHog.capture("user logged out")` + `PostHog.reset()` in `logout()`.
- **`NavActivity.kt`** — Added `PostHog.capture("channel switched")` with `channel_name` property in the `onChatClicked` callback.
- **`ConversationFragment.kt`** — Added `onResume()` override that fires `PostHog.capture("conversation viewed")` with `channel_name`.
- **`Conversation.kt`** — Added `PostHog.capture("message sent")` with `channel_name` and `message_length` in `onMessageSent`; added `PostHog.capture("drag and drop message received")` in the drag-and-drop `onDrop` callback.
- **`UserInput.kt`** — Added `PostHog.capture("input selector opened")` with `selector` property for each of the five input selector buttons; added `PostHog.capture("emoji selected")` with `emoji` property in `EmojiTable`.
- **`ProfileFragment.kt`** — Added `PostHog.capture("profile viewed")` with `user_id` property in `onAttach()`.
- **`JetchatDrawer.kt`** — Added `PostHog.capture("widget pin requested")` in `addWidgetToHomeScreen()`.

## Event tracking summary

| Event | Description | File |
|---|---|---|
| `user logged in` | User successfully logs in; also calls `PostHog.identify()` | `MainViewModel.kt` |
| `user logged out` | User taps logout; also calls `PostHog.reset()` | `MainViewModel.kt` |
| `message sent` | User sends a message in a conversation | `Conversation.kt` |
| `profile viewed` | User navigates to view a user's profile | `ProfileFragment.kt` |
| `channel switched` | User switches to a different chat channel | `NavActivity.kt` |
| `emoji selected` | User picks an emoji from the emoji picker | `UserInput.kt` |
| `drag and drop message received` | User drops text onto the conversation | `Conversation.kt` |
| `input selector opened` | User opens an input tool (emoji, DM, photo, map, phone) | `UserInput.kt` |
| `conversation viewed` | User enters and views a conversation channel | `ConversationFragment.kt` |
| `widget pin requested` | User requests to pin the widget to their home screen | `JetchatDrawer.kt` |

## Next steps

We've instrumented the key user actions in Jetchat. Here are five recommended insights to build in PostHog for an **"Analytics basics"** dashboard:

1. **Login → Message funnel** (Funnel insight)
   Track conversion from `user logged in` → `conversation viewed` → `message sent`
   [Create this funnel](https://us.posthog.com/project/2/insights/new?insight=FUNNELS)

2. **Daily messages sent** (Trends insight)
   Chart `message sent` over time to track daily engagement volume
   [Create this trend](https://us.posthog.com/project/2/insights/new?insight=TRENDS)

3. **Channel popularity** (Trends insight)
   Chart `channel switched` broken down by `channel_name` to see which channels are most active
   [Create this trend](https://us.posthog.com/project/2/insights/new?insight=TRENDS)

4. **Input tool usage breakdown** (Trends insight)
   Chart `input selector opened` broken down by `selector` to see which tools users open most
   [Create this trend](https://us.posthog.com/project/2/insights/new?insight=TRENDS)

5. **User retention after login** (Retention insight)
   Retention starting from `user logged in`, returning with `message sent`
   [Create this retention insight](https://us.posthog.com/project/2/insights/new?insight=RETENTION)

[Open PostHog project dashboard](https://us.posthog.com/project/2/dashboards)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-android/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
