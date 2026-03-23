<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Jetchat Android application. The integration includes SDK initialization via a new `JetchatApplication` class, user identification on login/logout, and event tracking across key user flows including messaging, profile views, channel navigation, voice recording, and emoji usage.

## Changes Summary

- **`app/build.gradle.kts`** — Added PostHog Android SDK dependency (`com.posthog:posthog-android:3.+`), enabled `buildConfig`, added `buildConfigField` entries for `POSTHOG_API_KEY` and `POSTHOG_HOST` read from `local.properties`
- **`local.properties`** — Added `posthog.apiKey` and `posthog.host` (gitignored)
- **`app/src/main/AndroidManifest.xml`** — Registered `JetchatApplication` as the app's Application class; added `android:label` to `NavActivity`
- **`JetchatApplication.kt`** (new file) — Initializes PostHog on app startup with `PostHogAndroid.setup()`, enabling lifecycle events, deep link tracking, and screen views
- **`NavActivity.kt`** — Added `PostHog.identify()` + `user_logged_in` on login; `user_logged_out` + `PostHog.reset()` on logout; `channel_switched` when navigating to a chat channel
- **`conversation/Conversation.kt`** — Added `message_sent` event with channel name and message length when a message is submitted
- **`conversation/ConversationFragment.kt`** — Added `profile_viewed` event when a user navigates to another user's profile
- **`conversation/UserInput.kt`** — Added `voice_recording_started` and `voice_recording_finished` events on voice recording gestures; `emoji_inserted` event when an emoji is tapped
- **`profile/Profile.kt`** — Added `profile_fab_clicked` event with `user_is_me` and `profile_name` properties when the floating action button is tapped

## Event Tracking Table

| Event Name | Description | File |
|---|---|---|
| `user_logged_in` | User submits the login form; identifies user in PostHog | `NavActivity.kt` |
| `user_logged_out` | User clicks the logout button; resets PostHog identity | `NavActivity.kt` |
| `channel_switched` | User switches to a different chat channel from the drawer | `NavActivity.kt` |
| `message_sent` | User sends a message in the conversation | `conversation/Conversation.kt` |
| `profile_viewed` | User navigates to view another user's profile | `conversation/ConversationFragment.kt` |
| `voice_recording_started` | User starts a voice recording in the conversation | `conversation/UserInput.kt` |
| `voice_recording_finished` | User finishes a voice recording in the conversation | `conversation/UserInput.kt` |
| `emoji_inserted` | User inserts an emoji from the emoji selector | `conversation/UserInput.kt` |
| `profile_fab_clicked` | User clicks the floating action button on a profile screen | `profile/Profile.kt` |

## Next steps

We attempted to create an "Analytics basics" dashboard automatically, but the configured API key does not have the `dashboard:write` scope. You can create it manually in PostHog:

- **PostHog Dashboards**: [https://us.posthog.com/project/238460/dashboard](https://us.posthog.com/project/238460/dashboard)

Suggested insights to add to your dashboard:
1. **Login trend** — `user_logged_in` events over time (line chart)
2. **Daily active messengers** — unique users sending `message_sent` events (line chart)
3. **Login → Message conversion funnel** — funnel from `user_logged_in` → `message_sent`
4. **Channel popularity** — `channel_switched` breakdown by `channel_name` property (bar chart)
5. **Feature engagement** — `voice_recording_finished` and `emoji_inserted` events over time (line chart)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
