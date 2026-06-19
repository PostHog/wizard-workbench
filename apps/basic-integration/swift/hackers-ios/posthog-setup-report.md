<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hackers iOS app. PostHog was added as a Swift Package Manager dependency to the main Xcode project and to four feature module packages. The SDK is initialized at app launch in `HackersApp.swift`, and 12 events are captured across five key feature areas: authentication, feed interaction, content engagement, search, and in-app purchases.

User identification is performed on login via `PostHogSDK.shared.identify()` using the HN username, and `PostHogSDK.shared.reset()` is called on logout to clear the anonymous identity.

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully authenticates and logs in. | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `login_failed` | Fired when a login attempt fails due to bad credentials or an error. | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `user_logged_out` | Fired when a user explicitly logs out of the app. | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `feed_category_changed` | Fired when the user switches the feed to a different post category. | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_bookmarked` | Fired when a user saves a post to their bookmarks. | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_unbookmarked` | Fired when a user removes a post from their bookmarks. | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `search_performed` | Fired when a search query completes successfully. | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_upvoted` | Fired when a user upvotes a post from the comments view. | `Features/Comments/Sources/Comments/CommentsViewModel.swift` |
| `comment_upvoted` | Fired when a user upvotes a comment. | `Features/Comments/Sources/Comments/CommentsViewModel.swift` |
| `support_purchase_completed` | Fired when a support purchase (subscription or tip) succeeds. | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `support_purchase_failed` | Fired when a support purchase fails due to an error. | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `settings_cache_cleared` | Fired when the user clears the app cache from settings. | `Features/Settings/Sources/Settings/SettingsViewModel.swift` |

## Next steps

A dashboard named **"Analytics basics (wizard)"** with the following insights should be created in your PostHog project (https://us.posthog.com/project/2):

1. **Login success vs failure** — Trend of `user_logged_in` vs `login_failed`
2. **User login-to-purchase funnel** — Funnel from `user_logged_in` → `support_purchase_completed`
3. **Feed engagement** — Trend of `post_upvoted`, `comment_upvoted`, and `post_bookmarked`
4. **Search activity** — Trend of `search_performed` with `result_count` breakdown
5. **Support purchases** — Trend of `support_purchase_completed` vs `support_purchase_failed`

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs. Consider calling `identify` when the app restores a saved session on launch.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
