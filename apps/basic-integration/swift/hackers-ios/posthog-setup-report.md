# PostHog post-wizard report

The wizard added PostHog to the SwiftUI application launch path, configured the SDK with the project environment variables, enabled lifecycle and error autocapture defaults, added the PostHog Swift Package Manager dependency to the Xcode project, and instrumented authentication, feed, voting, bookmarking, search, and support-purchase actions. Usernames are sent through `identify` as person properties rather than event properties. The PostHog MCP dashboard service was unavailable during this run, so no dashboard or notebook could be created.

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | A user successfully authenticated with Hacker News. | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `user_logged_out` | An authenticated user logged out of the app. | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `feed_category_changed` | A user switched the active Hacker News feed category. | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_searched` | A user submitted a non-empty search query for posts. | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_bookmark_toggled` | A user added or removed a post bookmark. | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_upvoted` | A user upvoted a post. | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `comment_upvoted` | A user upvoted a comment. | `Features/Comments/Sources/Comments/CommentsViewModel.swift` |
| `support_purchase_completed` | A user completed a support purchase. | `Data/Sources/Data/SupportPurchaseRepository.swift` |

## Next steps

No dashboard or insight links were created because the PostHog MCP endpoint was unavailable in this environment.

## Verify before merging

- [ ] Run a full production Xcode build and fix any integration or package-resolution errors.
- [ ] Run the test suite; instrumented call sites may need updated mocks or fixtures.
- [ ] Confirm the returning-visitor path identifies an already authenticated user, not only users who freshly log in.
- [ ] Add the exact PostHog environment variable names to any collaborator onboarding or environment-example documentation.
- [ ] Confirm the app archive has a non-empty PostHog configuration available in Release builds; scheme environment variables are not present in TestFlight/App Store archives.

### Agent skill

The installed Swift integration skill remains in `.claude/skills/integration-swift` for future agent development.
