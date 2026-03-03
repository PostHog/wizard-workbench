<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Jetchat Android (Kotlin/Jetpack Compose) app. The integration includes SDK initialization via a custom Application class, user identification on login/logout, and custom event tracking across the core user flows: messaging, profile viewing, and channel navigation.

## Changes made

| File | Change |
|------|--------|
| `app/build.gradle.kts` | Added `posthog-android:3.+` dependency; added `buildConfigField` entries for `POSTHOG_API_KEY` and `POSTHOG_HOST` read from `local.properties`; enabled `buildConfig` feature |
| `local.properties` | Added `posthog.apiKey` and `posthog.host` values (gitignored) |
| `app/src/main/AndroidManifest.xml` | Registered `JetchatApplication` as the app's Application class; added `android:label` to `NavActivity` for accurate screen tracking |
| `app/src/main/java/…/JetchatApplication.kt` | **New file** — Application class that calls `PostHogAndroid.setup()` in `onCreate()` with lifecycle, screen view, and deep link capture enabled |
| `app/src/main/java/…/MainViewModel.kt` | Added `PostHog.identify()` + `user logged in` event on login; `user logged out` event + `PostHog.reset()` on logout |
| `app/src/main/java/…/NavActivity.kt` | Added `chat channel selected` event when a drawer channel is tapped; `profile viewed` event when a profile is opened |
| `app/src/main/java/…/conversation/Conversation.kt` | Added `message sent` event (with `channel_name` and `message_length` properties) when a message is submitted |

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `user logged in` | User successfully authenticates; triggers `PostHog.identify()` with username | `MainViewModel.kt` |
| `user logged out` | User logs out; triggers `PostHog.reset()` to clear identity | `MainViewModel.kt` |
| `message sent` | User submits a message in a chat channel | `conversation/Conversation.kt` |
| `profile viewed` | User navigates to view another user's profile | `NavActivity.kt` |
| `chat channel selected` | User switches to a different chat channel from the drawer | `NavActivity.kt` |

## Automatic events (no code required)

The PostHog Android SDK automatically captures:
- `Application Installed` / `Application Updated`
- `Application Opened` / `Application Backgrounded`
- `$screen` — screen views (using the `android:label` from the manifest)
- `$exception` — uncaught exceptions and crashes

## Next steps

Create an **"Analytics basics"** dashboard in PostHog with these suggested insights:

1. **Login → Message funnel** — Funnel from `user logged in` → `message sent` to measure activation
2. **Daily active users** — Trend of `user logged in` over time
3. **Messages sent over time** — Trend of `message sent` grouped by `channel_name`
4. **Profile engagement** — Trend of `profile viewed` events
5. **Churn signal** — Trend of `user logged out` events

Visit your PostHog project to create these: https://us.i.posthog.com/project/2/dashboard/new

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-android/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
