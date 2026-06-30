<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hackers iOS app. The PostHog iOS SDK (v3.62.3) was added as a Swift Package Manager dependency across the main Xcode target and all relevant local Swift package modules. PostHog is initialized once in `HackersApp.init()` with lifecycle event capture enabled. Events are tracked across key user flows including authentication, voting, bookmarks, feed browsing, search, comments, settings changes, and in-app purchases. Users are identified by username on login and the session is reset on logout.

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully authenticates with their Hacker News credentials. | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `user_logged_out` | Fired when a user logs out of the app. | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `post_upvoted` | Fired when a user upvotes a post. | `Shared/Sources/Shared/ViewModels/VotingViewModel.swift` |
| `post_unvoted` | Fired when a user removes their upvote from a post. | `Shared/Sources/Shared/ViewModels/VotingViewModel.swift` |
| `comment_upvoted` | Fired when a user upvotes a comment. | `Shared/Sources/Shared/ViewModels/VotingViewModel.swift` |
| `post_bookmarked` | Fired when a user bookmarks or removes a bookmark from a post. | `Shared/Sources/Shared/Services/BookmarksController.swift` |
| `feed_category_changed` | Fired when a user switches between feed categories (e.g., News, Ask, Show, Jobs). | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_searched` | Fired when a user submits a search query in the feed. | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `comments_viewed` | Fired when a user opens the comments view for a post. | `Features/Comments/Sources/Comments/CommentsViewModel.swift` |
| `purchase_started` | Fired when a user initiates an in-app purchase. | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `purchase_completed` | Fired when a user successfully completes an in-app purchase. | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `setting_changed` | Fired when a user changes an app setting. | `Features/Settings/Sources/Settings/SettingsViewModel.swift` |
| `cache_cleared` | Fired when a user clears the app cache from settings. | `Features/Settings/Sources/Settings/SettingsViewModel.swift` |

## Next steps

Create the following dashboard and insights in your [PostHog project](https://us.posthog.com/project/483112):

**Suggested dashboard: "Analytics basics (wizard)"**

Recommended insights to build:
1. **Active users** — Trend of unique users over time (using `user_logged_in` or `comments_viewed`)
2. **Login conversion funnel** — Funnel from `user_logged_in` → `feed_category_changed` → `comments_viewed`
3. **Engagement actions** — Breakdown of `post_upvoted`, `comment_upvoted`, `post_bookmarked` by day
4. **Search usage** — Trend of `post_searched` with breakdown by result count (p50/p95)
5. **In-app purchase funnel** — Funnel from `purchase_started` → `purchase_completed` (conversion rate)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to any `.env.example` or bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs. Currently `identify` is called only in `performLogin`; consider also calling it when a stored session is restored at app launch via `SessionService`.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-swift/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
