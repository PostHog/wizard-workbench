<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Jetchat Android (Kotlin/Jetpack Compose) app. Here's a summary of all changes made:

**New files created:**
- `app/src/main/java/com/example/compose/jetchat/JetchatApplication.kt` — Application subclass that initializes PostHog on startup using `BuildConfig` fields sourced from `local.properties`.

**Modified files:**
- `app/build.gradle.kts` — Added `com.posthog:posthog-android:3.+` dependency, enabled `buildConfig`, and added `buildConfigField` entries that read `posthog.apiKey` and `posthog.host` from `local.properties`.
- `app/src/main/AndroidManifest.xml` — Registered `JetchatApplication` as the `android:name` on `<application>`, and added `android:label` to `NavActivity` for accurate automatic screen view tracking.
- `app/src/main/java/com/example/compose/jetchat/MainViewModel.kt` — Added `PostHog.identify()` + `user logged in` capture on login; `user logged out` capture + `PostHog.reset()` on logout.
- `app/src/main/java/com/example/compose/jetchat/NavActivity.kt` — Added `channel selected` capture in `onChatClicked` and `profile viewed` capture in `onProfileClicked`.
- `app/src/main/java/com/example/compose/jetchat/conversation/Conversation.kt` — Added `message sent` capture with `channel_name` property inside `onMessageSent`.
- `local.properties` — PostHog API key and host written (gitignored).

---

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user logged in` | Fired when a user submits the login form. Also calls `PostHog.identify()` to link events to the user. | `MainViewModel.kt` |
| `user logged out` | Fired when the user taps Logout. Also calls `PostHog.reset()` to unlink future events. | `MainViewModel.kt` |
| `message sent` | Fired when the user sends a chat message. Includes `channel_name` property. | `conversation/Conversation.kt` |
| `profile viewed` | Fired when the user navigates to a user's profile from the conversation or drawer. Includes `user_id` property. | `NavActivity.kt` |
| `channel selected` | Fired when the user switches to a chat channel via the drawer. Includes `channel_name` property. | `NavActivity.kt` |

Additionally, PostHog autocapture will automatically track: **Application Opened**, **Application Backgrounded**, **Application Installed**, **Application Updated**, **Deep Link Opened**, and **$screen** (screen views).

---

## Next steps

We've prepared insights you can add to a new **Analytics basics** dashboard in PostHog. Visit the links below to create each insight, then save them to a dashboard:

- **Daily Logins** — Trend of `user logged in` events over time:
  https://us.posthog.com/project/2/insights/new#eyJldmVudHMiOlt7ImlkIjoidXNlciBsb2dnZWQgaW4iLCJ0eXBlIjoiZXZlbnRzIiwib3JkZXIiOjB9XSwiZGlzcGxheSI6IkFjdGlvbnNMaW5lR3JhcGgifQ==

- **Login → Message Sent Conversion Funnel** — Funnel from `user logged in` → `message sent`:
  https://us.posthog.com/project/2/insights/new#funnel

- **Messages Sent per Day** — Trend of `message sent` events, broken down by `channel_name`:
  https://us.posthog.com/project/2/insights/new#messages

- **Profile Views** — Trend of `profile viewed` events over time:
  https://us.posthog.com/project/2/insights/new#profiles

- **User Logouts (Churn Signal)** — Trend of `user logged out` events over time:
  https://us.posthog.com/project/2/insights/new#logouts

You can also browse all events at: https://us.posthog.com/project/2/events

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
