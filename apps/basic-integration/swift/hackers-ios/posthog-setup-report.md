<wizard-report>
# PostHog post-wizard report

The wizard has completed a full PostHog integration for the Hackers iOS app. Here's a summary of all changes made:

**SDK Installation**: Added `posthog-ios` (v3.58.0+) as a Swift Package Manager dependency in `Hackers.xcodeproj/project.pbxproj`, including the `XCRemoteSwiftPackageReference`, `XCSwiftPackageProductDependency`, and `PBXBuildFile` entries for the Hackers target. The PostHog package dependency was also added to the `Package.swift` files for the `Authentication`, `Feed`, `Comments`, and `Settings` feature packages.

**Initialization**: Added a `PostHogEnv` enum in `App/HackersApp.swift` that reads `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from the Xcode scheme's run environment variables via `ProcessInfo`. PostHog is initialized in the `HackersApp` initializer with `captureApplicationLifecycleEvents = true`.

**Environment Variables**: Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to the Xcode scheme's run environment variables (`Hackers.xcscheme`) and to `.env`.

**Event Tracking**: Instrumented 12 events across 5 files covering authentication, onboarding, feed browsing, voting, bookmarking, search, and in-app purchases.

## Events

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | User successfully authenticated with Hacker News credentials | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `user_logged_out` | User logged out of their Hacker News account | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `login_failed` | User attempted login but authentication failed | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `onboarding_completed` | User dismissed the onboarding flow for the first time | `App/OnboardingCoordinator.swift` |
| `feed_category_changed` | User switched to a different feed category (news, ask, show, jobs, etc.) | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_search_performed` | User performed a search query on Hacker News posts | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_bookmarked` | User bookmarked or unbookmarked a post | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_upvoted` | User upvoted a post | `Features/Comments/Sources/Comments/CommentsViewModel.swift` |
| `comment_upvoted` | User upvoted a comment | `Features/Comments/Sources/Comments/CommentsViewModel.swift` |
| `support_purchase_initiated` | User tapped to initiate a purchase (subscription or tip) | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `support_purchase_completed` | User successfully completed a subscription or tip purchase | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `support_purchases_restored` | User successfully restored prior purchases | `Features/Settings/Sources/Settings/SupportViewModel.swift` |

## Next steps

We've prepared an "Analytics basics" dashboard for you to keep an eye on user behavior. Create it in PostHog using the links below:

**Create the dashboard**: [New Dashboard](https://us.posthog.com/project/2/dashboard/new)

Then add these five insights:

1. **Onboarding → Login funnel** — track how many users complete onboarding and then log in:
   [Create funnel insight](https://us.posthog.com/project/2/insights/new#{"insight":"FUNNELS","events":[{"id":"onboarding_completed","type":"events","order":0},{"id":"user_logged_in","type":"events","order":1}]})

2. **Purchase conversion funnel** — track the ratio of purchase initiations to completions:
   [Create funnel insight](https://us.posthog.com/project/2/insights/new#{"insight":"FUNNELS","events":[{"id":"support_purchase_initiated","type":"events","order":0},{"id":"support_purchase_completed","type":"events","order":1}]})

3. **User logins over time** — monitor daily active authenticated users:
   [Create trend insight](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"user_logged_in","type":"events"}],"display":"ActionsLineGraph"})

4. **Login failures** — catch spikes in failed login attempts:
   [Create trend insight](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"login_failed","type":"events"}],"display":"ActionsBarValueTotal"})

5. **Engagement events breakdown** — see votes, bookmarks, and searches in one view:
   [Create trend insight](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"post_upvoted","type":"events"},{"id":"comment_upvoted","type":"events"},{"id":"post_bookmarked","type":"events"},{"id":"post_search_performed","type":"events"}],"display":"ActionsLineGraph"})

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-swift/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
