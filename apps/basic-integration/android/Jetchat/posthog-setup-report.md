<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Jetchat Android app. PostHog is initialized in a new `JetchatApplication` class that registers early in the app lifecycle via `AndroidManifest.xml`. The PostHog Android SDK is configured with automatic lifecycle event capture, screen view tracking, deep link capture, and error tracking via `errorTrackingConfig.autoCapture`. API keys are sourced from `local.properties` and exposed to the app through `BuildConfig` fields, never hardcoded in source.

User identity is established immediately on login via `PostHog.identify()` with the username as `distinctId`, and reset on logout via `PostHog.reset()`. Ten custom events are captured across five files covering the key user flows: authentication, messaging, channel navigation, profile viewing, and media input interactions.

| Event Name | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logs in; also calls `identify()` | `MainViewModel.kt` |
| `user_logged_out` | User logs out; also calls `reset()` | `MainViewModel.kt` |
| `message_sent` | User sends a chat message (includes channel name and message length) | `conversation/Conversation.kt` |
| `channel_opened` | User selects a chat channel from the navigation drawer | `NavActivity.kt` |
| `profile_viewed` | User opens another user's profile | `NavActivity.kt` |
| `conversation_entered` | Conversation fragment becomes visible (tracked in `onResume`) | `conversation/ConversationFragment.kt` |
| `emoji_selector_opened` | User opens the emoji picker in the message input | `conversation/UserInput.kt` |
| `voice_recording_started` | User begins recording a voice message | `conversation/UserInput.kt` |
| `voice_recording_finished` | User completes and submits a voice message | `conversation/UserInput.kt` |
| `voice_recording_cancelled` | User cancels a voice message recording | `conversation/UserInput.kt` |

## Next steps

We recommend building the following insights in PostHog to track key user behavior:

- **Login funnel** — Trends for `user_logged_in` vs `user_logged_out` over time to track retention and churn patterns. Go to [Insights](/insights) and create a Trends chart with both events.
- **Message engagement** — Trends for `message_sent` broken down by `channel_name` to see which channels are most active. Go to [Insights](/insights) → Trends → add `message_sent` → Breakdown by `channel_name`.
- **Conversion funnel: Login → Message** — Create a Funnel insight with steps: `user_logged_in` → `conversation_entered` → `message_sent` to see drop-off between authentication and active engagement. Go to [Insights](/insights) → Funnel.
- **Media input engagement** — Trends for `emoji_selector_opened`, `voice_recording_started`, and `voice_recording_cancelled` side by side to understand which input methods users prefer and where they abandon.
- **Profile discovery** — Trends for `profile_viewed` to track social graph exploration in the app.

Visit your [PostHog Dashboards](/dashboard) to create a new "Analytics basics" dashboard and add the insights above.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-android/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
