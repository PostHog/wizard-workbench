<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hackers iOS app. The posthog-ios SDK (v3.58.3) was added as a Swift Package Manager dependency to the main Xcode target and to the relevant local feature packages (Authentication, Feed, Comments, Settings). PostHog is initialized in `HackersApp.init()` with `captureApplicationLifecycleEvents = true`, reading credentials from the Xcode scheme's Run environment variables via a `PostHogEnv` enum. Twelve events covering user authentication, content engagement, support purchases, onboarding, and settings actions were instrumented across seven files.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully authenticates with HN credentials | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `user_logged_out` | User signs out; PostHog identity is reset | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `post_upvoted` | User upvotes a post in the feed | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_bookmarked` | User saves or removes a bookmark on a post | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `feed_category_changed` | User switches between feed categories (Top, Ask, Show, etc.) | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_searched` | User performs a search query with result count | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_shared` | User shares a post via the iOS share sheet | `Features/Feed/Sources/Feed/FeedView.swift` |
| `comment_upvoted` | User upvotes a comment in a thread | `Features/Comments/Sources/Comments/CommentsViewModel.swift` |
| `support_purchased` | User successfully completes a supporter subscription or tip | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `support_purchase_cancelled` | User cancels a support purchase flow | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `onboarding_completed` | User finishes or dismisses the onboarding flow | `App/OnboardingCoordinator.swift` |
| `settings_cache_cleared` | User manually clears the app cache | `Features/Settings/Sources/Settings/SettingsViewModel.swift` |

## Next steps

We've set up an "Analytics basics" dashboard for you to track key user behaviors:

- [Analytics basics dashboard](/dashboard/1295821)

You can add insights to this dashboard for the Hackers-specific events above. Recommended insights to build:

1. **Login trend** — daily `user_logged_in` count to track active authentication
2. **Support purchase funnel** — `support_purchased` vs `support_purchase_cancelled` to measure conversion
3. **Content engagement** — `post_upvoted` + `comment_upvoted` + `post_bookmarked` over time
4. **Feature discovery** — `feed_category_changed` breakdown by `category` property
5. **Onboarding completion** — `onboarding_completed` count (shows new user activation)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-swift/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
