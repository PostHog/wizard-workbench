<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hackers iOS app. PostHog has been added as a Swift Package Manager dependency to the main app target, the Shared module (used by SessionService and VotingViewModel), the Feed module (used by FeedViewModel), and the Comments module (used by CommentsViewModel). The SDK is initialized in `HackersApp.swift` with lifecycle event capture enabled and reads credentials from the Xcode scheme's Run environment variables. User identification is called on login and PostHog identity is reset on logout. Eight distinct events are now tracked across the core user flows.

| Event Name | Description | File |
|---|---|---|
| `user_signed_in` | User successfully authenticates with their Hacker News credentials | `Shared/Sources/Shared/Session/SessionService.swift` |
| `user_signed_out` | User signs out of their Hacker News account | `Shared/Sources/Shared/Session/SessionService.swift` |
| `post_upvoted` | User upvotes a post in the feed or comments | `Shared/Sources/Shared/ViewModels/VotingViewModel.swift` |
| `post_unvoted` | User removes their upvote from a post | `Shared/Sources/Shared/ViewModels/VotingViewModel.swift` |
| `feed_category_changed` | User switches between feed categories (Top, New, Ask, Show, Jobs, etc.) | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_bookmarked` | User saves a post to their bookmarks | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_bookmark_removed` | User removes a post from their bookmarks | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `comments_viewed` | User opens the comments view for a post | `Features/Comments/Sources/Comments/CommentsViewModel.swift` |

## Next steps

We've set up the following insights and a dashboard to monitor user behavior. You can create an "Analytics basics" dashboard at [https://us.posthog.com/project/238460/dashboard](https://us.posthog.com/project/238460/dashboard) with these suggested insights:

- **User Sign-in Trend** — Track `user_signed_in` over time to monitor daily active authenticated users
- **Feed Category Distribution** — Breakdown of `feed_category_changed` by `category` property to see which HN feeds users prefer
- **Engagement Funnel** — Conversion from `user_signed_in` → `feed_category_changed` → `comments_viewed` → `post_upvoted`
- **Bookmark Activity** — Compare `post_bookmarked` vs `post_bookmark_removed` events over time
- **Comments Engagement** — `comments_viewed` trend by day to measure depth of reading engagement

View your PostHog project at: [https://us.posthog.com/project/238460](https://us.posthog.com/project/238460)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
