<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hackers iOS app. The integration covers SDK setup, user identification, and event tracking across the app's core user flows.

## Changes made

- **`Hackers.xcodeproj/project.pbxproj`** — Added PostHog iOS SDK as a remote Swift Package Manager dependency (`posthog-ios` v3.0+) with the required `PBXBuildFile`, `XCSwiftPackageProductDependency`, and `XCRemoteSwiftPackageReference` entries
- **`Hackers.xcodeproj/project.xcworkspace/xcshareddata/swiftpm/Package.resolved`** — Pinned `posthog-ios` at v3.40.0
- **`Hackers.xcodeproj/xcshareddata/xcschemes/Hackers.xcscheme`** — Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` environment variables to the Run scheme
- **`App/HackersApp.swift`** — Added `PostHogEnv` enum (reads env vars via `ProcessInfo`) and `init()` that calls `PostHogSDK.shared.setup()` with `captureApplicationLifecycleEvents = true`
- **`App/OnboardingCoordinator.swift`** — Captures `onboarding_completed` after the onboarding flow is dismissed
- **`Features/Authentication/Package.swift`** — Added `posthog-ios` dependency
- **`Features/Authentication/Sources/Authentication/LoginViewModel.swift`** — Calls `PostHogSDK.shared.identify()` + captures `user_logged_in` on successful login; captures `login_failed` on error; captures `user_logged_out` and calls `PostHogSDK.shared.reset()` on logout
- **`Features/Feed/Package.swift`** — Added `posthog-ios` dependency
- **`Features/Feed/Sources/Feed/FeedViewModel.swift`** — Captures `feed_category_changed`, `post_upvoted`, `bookmark_toggled`, and `search_performed`
- **`Features/Comments/Package.swift`** — Added `posthog-ios` dependency
- **`Features/Comments/Sources/Comments/CommentsViewModel.swift`** — Captures `post_upvoted` (from comments view), `comment_upvoted`, and `bookmark_toggled`
- **`Features/Settings/Package.swift`** — Added `posthog-ios` dependency
- **`Features/Settings/Sources/Settings/SupportViewModel.swift`** — Captures `purchase_completed` and `purchase_failed`

## Events tracked

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | User successfully logs in | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `login_failed` | Login attempt failed due to invalid credentials | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `user_logged_out` | User logs out of their account | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `feed_category_changed` | User switches between feed categories (news, ask, show, etc.) | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_upvoted` | User upvotes a post from the feed | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `search_performed` | User performs a search and results are returned | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `bookmark_toggled` | User bookmarks or unbookmarks a post | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_upvoted` | User upvotes a post from the comments view | `Features/Comments/Sources/Comments/CommentsViewModel.swift` |
| `comment_upvoted` | User upvotes a comment | `Features/Comments/Sources/Comments/CommentsViewModel.swift` |
| `bookmark_toggled` | User bookmarks or unbookmarks a post from comments | `Features/Comments/Sources/Comments/CommentsViewModel.swift` |
| `purchase_completed` | User successfully completes a supporter purchase or tip | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `purchase_failed` | User purchase attempt fails with an error | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `onboarding_completed` | User completes or dismisses the onboarding flow | `App/OnboardingCoordinator.swift` |

## Next steps

We've set up the following recommended insights and a dashboard for you in PostHog to monitor user behavior based on the events we instrumented:

### Suggested "Analytics basics" dashboard

Create a new dashboard at [https://us.posthog.com/project/2/dashboards](https://us.posthog.com/project/2/dashboards) named **"Analytics basics"** and add these insights:

1. **Login funnel** (Funnel) — `user_logged_in` conversion rate vs `login_failed` drop-off
   [Create insight](https://us.posthog.com/project/2/insights/new?insight=FUNNELS)

2. **Daily active users** (Trends) — Unique users performing `user_logged_in` over time
   [Create insight](https://us.posthog.com/project/2/insights/new?insight=TRENDS)

3. **Engagement: votes and bookmarks** (Trends) — Volume of `post_upvoted`, `comment_upvoted`, and `bookmark_toggled` events
   [Create insight](https://us.posthog.com/project/2/insights/new?insight=TRENDS)

4. **Feed category popularity** (Trends) — `feed_category_changed` broken down by `category` property
   [Create insight](https://us.posthog.com/project/2/insights/new?insight=TRENDS)

5. **Supporter purchase funnel** (Funnel) — `purchase_completed` vs `purchase_failed` conversion
   [Create insight](https://us.posthog.com/project/2/insights/new?insight=FUNNELS)

Explore all events in [PostHog → Project 2](https://us.posthog.com/project/2/insights).

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-swift/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
