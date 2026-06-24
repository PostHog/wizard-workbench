<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hackers iOS app. The posthog-ios SDK (v3.62.0) was added as a Swift Package Manager dependency to the main Xcode project and to the four Swift packages that required it (Shared, Authentication, Feed, Settings). PostHog is initialized in `HackersApp.init()` with lifecycle event autocapture enabled. Users are identified on login and the session is reset on logout. Twelve events are tracked across six files covering the most business-critical user flows: authentication, voting, bookmarking, feed navigation, search, in-app purchases, and settings changes.

| Event Name | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully authenticates with their Hacker News credentials. | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `user_logged_out` | Fired when a user logs out and their session is cleared. | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `post_upvoted` | Fired when a user upvotes a post on Hacker News. | `Shared/Sources/Shared/ViewModels/VotingViewModel.swift` |
| `post_unvoted` | Fired when a user removes their upvote from a post. | `Shared/Sources/Shared/ViewModels/VotingViewModel.swift` |
| `comment_upvoted` | Fired when a user upvotes a comment on Hacker News. | `Shared/Sources/Shared/ViewModels/VotingViewModel.swift` |
| `post_bookmarked` | Fired when a user saves a post to their bookmarks. | `Shared/Sources/Shared/Services/BookmarksController.swift` |
| `post_unbookmarked` | Fired when a user removes a post from their bookmarks. | `Shared/Sources/Shared/Services/BookmarksController.swift` |
| `feed_category_changed` | Fired when a user switches between feed categories (e.g. Top, Ask, Show, Jobs). | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_searched` | Fired when a user performs a search query on Hacker News posts. | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `support_purchase_completed` | Fired when a user successfully completes a supporter subscription or tip purchase. | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `support_purchase_restored` | Fired when a user successfully restores a previous supporter purchase. | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `settings_changed` | Fired when a user changes an app setting. | `Features/Settings/Sources/Settings/SettingsViewModel.swift` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: https://us.i.posthog.com/project/483112/dashboard/1751155
- **Login funnel** (user_logged_in → feed_category_changed): https://us.i.posthog.com/project/483112/insights/T2mLfDt9
- **User retention** (logins vs logouts over time): https://us.i.posthog.com/project/483112/insights/TgdJHXE8
- **Top user actions** (upvotes, bookmarks, comment votes): https://us.i.posthog.com/project/483112/insights/2ZE8kadn
- **Search usage** (post_searched over time): https://us.i.posthog.com/project/483112/insights/TUqgxERO
- **Support conversion** (support_purchase_completed over time): https://us.i.posthog.com/project/483112/insights/hINm3Tbl

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`) to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — the current implementation only identifies on fresh login, which can leave returning sessions on anonymous distinct IDs if users are already logged in when the app launches.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
