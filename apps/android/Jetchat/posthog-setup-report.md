<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Jetchat Android app (Kotlin/Jetpack Compose).

## Summary of changes

**New files:**
- `app/src/main/java/com/example/compose/jetchat/JetchatApplication.kt` — Application subclass that initializes PostHog via `PostHogAndroid.setup()` on startup.

**Modified files:**
- `app/build.gradle.kts` — Added `com.posthog:posthog-android:3.+` dependency; enabled `buildConfig`; added `POSTHOG_API_KEY` and `POSTHOG_HOST` as `buildConfigField` entries read from `local.properties`.
- `app/src/main/AndroidManifest.xml` — Registered `JetchatApplication` as the `android:name` for the `<application>` element; added `android:label` to `NavActivity` for accurate screen view tracking.
- `local.properties` — PostHog API key and host stored here (gitignored).
- `MainViewModel.kt` — Added `PostHog.identify()` + `PostHog.capture("user logged in")` on login; `PostHog.capture("user logged out")` + `PostHog.reset()` on logout.
- `conversation/Conversation.kt` — Added `PostHog.capture("message sent")` with `channel` and `message_length` properties when a message is sent.
- `profile/ProfileFragment.kt` — Added `PostHog.capture("profile viewed")` with `user_id` property in `onAttach`.
- `components/JetchatDrawer.kt` — Added `PostHog.capture("chat channel switched")` with `channel` property for both chat channels.
- `conversation/UserInput.kt` — Added `PostHog.capture("emoji selector opened")` when the emoji panel button is tapped.

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `user logged in` | User successfully logs in with a username and password | `MainViewModel.kt` |
| `user logged out` | User logs out from the app via the navigation drawer | `MainViewModel.kt` |
| `message sent` | User sends a chat message in the conversation screen | `conversation/Conversation.kt` |
| `profile viewed` | User navigates to view another user's profile | `profile/ProfileFragment.kt` |
| `chat channel switched` | User switches to a different chat channel from the navigation drawer | `components/JetchatDrawer.kt` |
| `emoji selector opened` | User opens the emoji selector panel in the message input | `conversation/UserInput.kt` |

## Next steps

To complete setup, create an **"Analytics basics"** dashboard in PostHog with these recommended insights:

1. **Login funnel** — `user logged in` → `message sent` (conversion from login to first message)
2. **Daily active users** — Unique users per day based on `user logged in`
3. **Messages sent over time** — Trend of `message sent` events, grouped by `channel` property
4. **Profile engagement** — `profile viewed` event trend (how often users explore other profiles)
5. **Churn indicator** — `user logged out` event trend over time

Navigate to [PostHog → Dashboards → New dashboard](https://us.posthog.com/project/2/dashboards) to create this dashboard.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-android/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
