<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Jetchat Android (Kotlin/Compose) application. The following changes were made:

- **Created `JetchatApplication.kt`** — a new `Application` subclass that initializes the PostHog Android SDK on app start, with session replay, lifecycle events, screen view tracking, and automatic error capture enabled.
- **Updated `AndroidManifest.xml`** — registered `JetchatApplication` as the app's Application class and added an `android:label` to `NavActivity` for accurate screen view tracking.
- **Updated `gradle/libs.versions.toml`** — added the `posthog-android` version (`3.31.0`) and library alias.
- **Updated `app/build.gradle.kts`** — enabled `buildConfig`, reads PostHog credentials from `local.properties`, and exposes them as `BuildConfig` fields. Added the PostHog SDK dependency.
- **Updated `local.properties`** — stored `posthog.apiKey` and `posthog.host` as environment variables (git-ignored).
- **Updated `MainViewModel.kt`** — calls `PostHog.identify()` and captures `user_logged_in` on login; captures `user_logged_out` and calls `PostHog.reset()` on logout.
- **Updated `Conversation.kt`** — captures `message_sent` with `channel` and `message_length` properties when a user sends a message.
- **Updated `JetchatDrawer.kt`** — captures `channel_selected` with `channel_name` property when a user selects a chat channel from the drawer.
- **Updated `ProfileFragment.kt`** — captures `profile_viewed` with `user_id` property when a profile is opened.
- **Updated `UserInput.kt`** — captures `emoji_selector_opened` when the emoji picker is tapped, and `attachment_type_selected` (with `attachment_type` property) for photo/map/phone selectors.

| Event Name | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully logs in with a username and password. | `app/src/main/java/com/example/compose/jetchat/MainViewModel.kt` |
| `user_logged_out` | Fired when the user taps the Logout option in the navigation drawer. | `app/src/main/java/com/example/compose/jetchat/MainViewModel.kt` |
| `message_sent` | Fired when a user sends a chat message in a conversation channel. | `app/src/main/java/com/example/compose/jetchat/conversation/Conversation.kt` |
| `channel_selected` | Fired when the user selects a chat channel from the navigation drawer. | `app/src/main/java/com/example/compose/jetchat/components/JetchatDrawer.kt` |
| `profile_viewed` | Fired when a user navigates to view another user's profile. | `app/src/main/java/com/example/compose/jetchat/profile/ProfileFragment.kt` |
| `emoji_selector_opened` | Fired when the user opens the emoji selector in the message input bar. | `app/src/main/java/com/example/compose/jetchat/conversation/UserInput.kt` |
| `attachment_type_selected` | Fired when a user taps a non-emoji attachment selector (photo, map, or phone) in the input bar. | `app/src/main/java/com/example/compose/jetchat/conversation/UserInput.kt` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) Dashboard](https://us.posthog.com/project/483112/dashboard/1777419)
- [Daily User Logins](https://us.posthog.com/project/483112/insights/YuAiJ2Ko)
- [Messages Sent Per Day](https://us.posthog.com/project/483112/insights/n7NDTBr6)
- [Login to First Message Funnel](https://us.posthog.com/project/483112/insights/yrlfhuES)
- [Channel Popularity](https://us.posthog.com/project/483112/insights/awfZtBQE)
- [User Logouts (Churn Indicator)](https://us.posthog.com/project/483112/insights/huEDdKBC)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `posthog.apiKey` and `posthog.host` to a `local.properties.example` file and any onboarding docs so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
