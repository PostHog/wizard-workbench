<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hackers iOS app. The posthog-ios SDK (v3.40.0) was added via Swift Package Manager to the main Xcode project and to each affected feature package. PostHog is initialized in the app entry point and events are captured across authentication, feed browsing, voting, comments, and in-app purchases.

## Changes made

### SDK installation
- **`Hackers.xcodeproj/project.pbxproj`** — Added PostHog as a remote SPM package (`https://github.com/PostHog/posthog-ios.git`, `≥ 3.40.0`) with the required `XCRemoteSwiftPackageReference`, `XCSwiftPackageProductDependency`, and `PBXBuildFile` objects wired to the Hackers target.
- **`Features/Authentication/Package.swift`**, **`Features/Feed/Package.swift`**, **`Features/Comments/Package.swift`**, **`Features/Settings/Package.swift`**, **`Shared/Package.swift`** — Added `posthog-ios` as a remote package dependency and `PostHog` as a target dependency.
- All affected **`Package.resolved`** files updated with the `posthog-ios` pin (`3.40.0`, revision `1783865d79a1cabc472cf2d56a1fe3f797417b52`).

### PostHog initialization
- **`App/HackersApp.swift`** — Added `import PostHog`, a `PostHogConfig` with `captureApplicationLifecycleEvents = true`, and `PostHogSDK.shared.setup(config)` in the `App.init()` initializer.

### Events and user identification

| Event name | Description | File |
|---|---|---|
| `user_signed_in` | User successfully authenticates with their Hacker News credentials. | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `user_signed_out` | User signs out of their Hacker News account. | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `feed_category_changed` | User switches between feed categories such as news, ask, show, or jobs. | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_search_performed` | User performs a search and results are returned from the Hacker News search API. | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_bookmarked` | User bookmarks or removes a bookmark from a post. | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_upvoted` | User upvotes a post on Hacker News. | `Shared/Sources/Shared/ViewModels/VotingViewModel.swift` |
| `comment_upvoted` | User upvotes a comment on a Hacker News post. | `Shared/Sources/Shared/ViewModels/VotingViewModel.swift` |
| `comments_viewed` | User opens the comments view for a Hacker News post. | `Features/Comments/Sources/Comments/CommentsView.swift` |
| `support_purchase_initiated` | User initiates a purchase of a supporter subscription or tip. | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `support_purchase_completed` | User successfully completes a purchase of a supporter subscription or tip. | `Features/Settings/Sources/Settings/SupportViewModel.swift` |

**User identification:** `PostHogSDK.shared.identify(username, userProperties:)` is called on successful login in `LoginViewModel`, and `PostHogSDK.shared.reset()` is called on logout to clear the anonymous identity.

## Next steps

Visit [PostHog](https://us.posthog.com) to create a dashboard with insights for this integration. Suggested insights:

1. **Login funnel** — Trend of `user_signed_in` over time to track DAU/MAU engagement.
2. **Feed engagement** — Breakdown of `feed_category_changed` by `category` property to see which feed types are most used.
3. **Search usage** — Trend of `post_search_performed` with average `result_count`.
4. **Voting activity** — Combined trend of `post_upvoted` and `comment_upvoted` to measure engagement depth.
5. **Support conversion funnel** — Funnel from `support_purchase_initiated` → `support_purchase_completed` to measure purchase conversion.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Confirm the returning-visitor path also calls `identify` — currently `identify` only fires on fresh login; consider calling it in `SessionService.authenticate` or on app launch when a returning authenticated user is detected, so returning sessions are not left on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-swift/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
