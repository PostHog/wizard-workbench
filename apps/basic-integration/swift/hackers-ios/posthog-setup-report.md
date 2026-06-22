<wizard-report>
# PostHog post-wizard report

The wizard has completed a full PostHog analytics integration for the Hackers iOS app. The posthog-ios SDK was added as a Swift Package Manager dependency to the Xcode project (`project.pbxproj`) and to the three feature packages that needed it (Authentication, Feed, Comments). PostHog is initialised once in `HackersApp.init()`, using a hardcoded public token with an optional env-var override for Xcode dev builds. User identification is called on successful login and `reset()` is called on logout. Nine meaningful business events are captured across the core user flows.

| Event name | Description | File |
|---|---|---|
| `user_signed_in` | User successfully authenticates with their Hacker News credentials. | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `user_signed_out` | User logs out of their Hacker News account. | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `feed_category_changed` | User switches to a different feed category such as Top, Ask, Show, or Jobs. | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_opened` | User opens a post to read its comments. | `Features/Comments/Sources/Comments/CommentsViewModel.swift` |
| `post_link_opened` | User taps a post's external link to open the article. | `Features/Feed/Sources/Feed/FeedView.swift` |
| `post_upvoted` | User upvotes a post in the feed. | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_bookmark_toggled` | User saves or removes a bookmark on a post. | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `comment_upvoted` | User upvotes a comment in a post's comment thread. | `Features/Comments/Sources/Comments/CommentsViewModel.swift` |
| `search_performed` | User performs a search query on Hacker News posts. | `Features/Feed/Sources/Feed/FeedViewModel.swift` |

## Next steps

We've prepared a dashboard for you to keep an eye on user behaviour. Open PostHog and create an "Analytics basics (wizard)" dashboard with the following insights:

1. **User sign-in trend** — Trends of `user_signed_in` and `user_signed_out` over the last 30 days to track active user sessions.
2. **Content engagement funnel** — Funnel: `user_signed_in` → `post_opened` → `post_upvoted` to measure drop-off from login to engagement.
3. **Feed category popularity** — Breakdown of `feed_category_changed` by `category` property to see which feed categories users prefer.
4. **Bookmarks and search activity** — Trends of `post_bookmark_toggled` and `search_performed` to track content discovery behaviour.
5. **Post engagement** — Trends of `post_link_opened` and `comment_upvoted` to measure content consumption depth.

[Dashboard](https://us.posthog.com/project/2/dashboards)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` (or your Xcode scheme's environment variables documentation) so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs. If users are auto-restored from a stored cookie/session on launch, add a `PostHogSDK.shared.identify(...)` call there too.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
