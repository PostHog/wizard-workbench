<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Jetchat Android app. Here is a summary of changes made:

- **`app/build.gradle.kts`** — Added the `posthog-android:3.+` dependency, enabled `buildConfig`, and configured `POSTHOG_API_KEY` / `POSTHOG_HOST` BuildConfig fields read from `local.properties`.
- **`local.properties`** — Created with PostHog API key and host (gitignored).
- **`app/src/main/AndroidManifest.xml`** — Added INTERNET permission, registered the `JetchatApplication` class, and added `android:label` to `NavActivity` for accurate screen view tracking.
- **`app/src/main/java/com/example/compose/jetchat/JetchatApplication.kt`** — New Application class that initializes PostHog via `PostHogAndroid.setup()` with lifecycle event capture, deep link tracking, and screen view tracking enabled.
- **`app/src/main/java/com/example/compose/jetchat/MainViewModel.kt`** — Added `PostHog.identify()` and `user_logged_in` capture on login; `user_logged_out` capture and `PostHog.reset()` on logout.
- **`app/src/main/java/com/example/compose/jetchat/conversation/Conversation.kt`** — Added `message_sent` capture inside the `UserInput.onMessageSent` callback.
- **`app/src/main/java/com/example/compose/jetchat/profile/ProfileFragment.kt`** — Added `profile_viewed` capture in `onAttach`.
- **`app/src/main/java/com/example/compose/jetchat/NavActivity.kt`** — Added `channel_switched` capture in the drawer's `onChatClicked` callback.
- **`app/src/main/java/com/example/compose/jetchat/conversation/UserInput.kt`** — Added `emoji_selector_opened` capture when the emoji selector button is tapped.
- **`app/src/main/java/com/example/compose/jetchat/components/JetchatDrawer.kt`** — Added `widget_added_to_home_screen` capture inside `addWidgetToHomeScreen`.

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully logs in with a username. | `MainViewModel.kt` |
| `user_logged_out` | Fired when a user logs out from the drawer menu. | `MainViewModel.kt` |
| `message_sent` | Fired when a user sends a message in a conversation channel. | `Conversation.kt` |
| `profile_viewed` | Fired when a user navigates to view a profile. | `ProfileFragment.kt` |
| `channel_switched` | Fired when a user selects a different chat channel from the drawer. | `NavActivity.kt` |
| `emoji_selector_opened` | Fired when a user opens the emoji picker in the message input. | `UserInput.kt` |
| `widget_added_to_home_screen` | Fired when a user requests to pin the Jetchat widget to the home screen. | `JetchatDrawer.kt` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard:** https://us.posthog.com/project/483112/dashboard/1751155
- **Daily Active Users:** https://us.posthog.com/project/483112/insights/vVApMgT3
- **Messages Sent Over Time:** https://us.posthog.com/project/483112/insights/ynI7ecuS
- **Login to Message Funnel:** https://us.posthog.com/project/483112/insights/mTFFVgRM
- **Channel Activity Breakdown:** https://us.posthog.com/project/483112/insights/hMW6lN96
- **User Retention vs Churn:** https://us.posthog.com/project/483112/insights/yq0jdEzl

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the PostHog env var names (`posthog.apiKey`, `posthog.host`) to a `local.properties.example` file so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — currently `identify` is only called on fresh login, which can leave returning sessions on anonymous distinct IDs if the user was already logged in from a previous session.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
