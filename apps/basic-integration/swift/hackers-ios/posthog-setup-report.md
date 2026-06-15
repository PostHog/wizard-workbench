<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hackers iOS app. PostHog is now initialized in the SwiftUI App entry point, user identification is wired to HN login/logout, and 12 business-critical events are instrumented across four feature packages (Authentication, Feed, Comments, Settings).

**Changes made:**

- `Hackers.xcodeproj/project.pbxproj` — Added `posthog-ios` (v3.60.0+) as an XCRemoteSwiftPackageReference and linked it to the main Hackers target.
- `Hackers.xcodeproj/xcshareddata/xcschemes/Hackers.xcscheme` — Added `POSTHOG_API_KEY` and `POSTHOG_HOST` environment variables to the Launch action for debug builds.
- `.env` — Created with `POSTHOG_API_KEY` and `POSTHOG_HOST` for reference.
- `App/HackersApp.swift` — PostHog initialized in `init()` with `captureApplicationLifecycleEvents = true`.
- `Features/Authentication/Package.swift` — Added `posthog-ios` dependency.
- `Features/Feed/Package.swift` — Added `posthog-ios` dependency.
- `Features/Comments/Package.swift` — Added `posthog-ios` dependency.
- `Features/Settings/Package.swift` — Added `posthog-ios` dependency.
- `Features/Authentication/Sources/Authentication/LoginViewModel.swift` — `identify()` + `user_logged_in` on success; `user_logged_out` + `reset()` on logout.
- `Features/Feed/Sources/Feed/FeedViewModel.swift` — `feed_category_changed`, `post_upvoted`, `post_bookmarked`, `search_performed`.
- `Features/Feed/Sources/Feed/FeedView.swift` — `link_opened` when user taps an external article URL.
- `Features/Comments/Sources/Comments/CommentsViewModel.swift` — `comments_opened` when thread loads; `comment_upvoted` after a successful upvote.
- `Features/Settings/Sources/Settings/SupportViewModel.swift` — `support_purchase_started`, `support_purchase_completed`, `restore_purchases_completed`.

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | User successfully authenticated with HN credentials | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `user_logged_out` | User logged out of their HN account | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `feed_category_changed` | User switched to a different feed category (Top, Ask, Show, Jobs, etc.) | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_upvoted` | User upvoted a post from the feed | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_bookmarked` | User bookmarked or unbookmarked a post | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `search_performed` | User performed a search and results were returned | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `link_opened` | User opened an external article link from a post | `Features/Feed/Sources/Feed/FeedView.swift` |
| `comments_opened` | User opened the comments for a post (top of engagement funnel) | `Features/Comments/Sources/Comments/CommentsViewModel.swift` |
| `comment_upvoted` | User upvoted a comment in a discussion | `Features/Comments/Sources/Comments/CommentsViewModel.swift` |
| `support_purchase_started` | User initiated a purchase or tip in the Support screen | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `support_purchase_completed` | A subscription or tip purchase was successfully completed | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `restore_purchases_completed` | User successfully restored previous purchases | `Features/Settings/Sources/Settings/SupportViewModel.swift` |

## Next steps

The PostHog MCP requires additional OAuth scopes (`dashboard:write`, `insight:write`, `query:read`) to create insights and dashboards automatically. Create the "Analytics basics (wizard)" dashboard manually using the links below.

**Suggested insights for your dashboard:**

1. **Login conversion funnel** — Funnel from app launch (`Application Opened` lifecycle event) → `user_logged_in`. Shows what fraction of users authenticate.
2. **Engagement funnel** — Funnel: `comments_opened` → `comment_upvoted`. Measures how many readers become active voters.
3. **Support conversion funnel** — Funnel: `support_purchase_started` → `support_purchase_completed`. Tracks IAP conversion rate.
4. **Feed category usage** — Trends breakdown of `feed_category_changed` by `category` property. Shows which feed categories users prefer.
5. **Content engagement** — Trend of `link_opened` vs `comments_opened` over time. Shows the read-vs-discuss ratio of your audience.

- [Create a new insight](https://us.posthog.com/project/2/insights/new)
- [View all dashboards](https://us.posthog.com/project/2/dashboard)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures. ViewModels in `AuthenticationTests`, `FeedTests`, `CommentsTests`, and `SettingsTests` now call `PostHogSDK.shared` which may need to be mocked.
- [ ] Add `POSTHOG_API_KEY` and `POSTHOG_HOST` to `.env.example` (or your project's bootstrap scripts) so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs. Currently `identify` is called only in `LoginViewModel.performLogin()`. If users can be restored from a persisted session (e.g. from saved cookies in `AuthenticationRepository`), you should call `PostHogSDK.shared.identify(username)` in that path too.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
