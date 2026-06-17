<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hackers iOS app. The PostHog iOS SDK (`posthog-ios` 3.60.1) was added as a Swift Package Manager dependency to the main Xcode target and to each feature package that required tracking. PostHog is initialized once in `HackersApp.init()` with lifecycle event capture enabled. User identification is performed on login via `PostHogSDK.shared.identify()` and sessions are reset on logout via `PostHogSDK.shared.reset()`. Twelve events were instrumented across six files, covering user authentication, content engagement, search, bookmarking, in-app purchases, onboarding, and settings.

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | User successfully authenticated with Hacker News credentials | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `user_logged_out` | User signed out of their Hacker News account | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `post_upvoted` | User upvoted a post from the feed | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_bookmarked` | User toggled a bookmark on a post (saved or removed) | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `feed_category_changed` | User switched the feed category (Top, New, Ask, Show, Jobs, etc.) | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `search_performed` | User submitted a search query for Hacker News posts | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `comments_viewed` | User opened a post to view its comments thread | `Features/Comments/Sources/Comments/CommentsViewModel.swift` |
| `comment_upvoted` | User upvoted a comment within a post thread | `Features/Comments/Sources/Comments/CommentsViewModel.swift` |
| `support_purchase_initiated` | User tapped to purchase a supporter subscription or tip | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `support_purchase_completed` | User successfully completed a supporter subscription or tip purchase | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `onboarding_completed` | User dismissed the onboarding flow for the first time | `App/OnboardingCoordinator.swift` |
| `settings_cache_cleared` | User manually cleared the app's network/image cache from settings | `Features/Settings/Sources/Settings/SettingsViewModel.swift` |

## Next steps

Create a dashboard named **"Analytics basics (wizard)"** in PostHog and add these five recommended insights:

1. **User Logins (Trends)** — `user_logged_in` over time. Tracks daily active authenticated users.
2. **Engagement Funnel** — `search_performed` → `comments_viewed` → `post_upvoted`. Shows content discovery-to-engagement conversion.
3. **Support Conversion Funnel** — `support_purchase_initiated` → `support_purchase_completed`. Measures revenue conversion rate.
4. **Content Engagement (Trends)** — `post_upvoted` and `post_bookmarked` over time. Shows overall content engagement health.
5. **Onboarding Completion (Trends)** — `onboarding_completed` over time. Tracks new user activation.

Use these links to get started:

- [Create new insight](https://us.posthog.com/project/2/insights/new)
- [View all dashboards](https://us.posthog.com/project/2/dashboard)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs. Consider calling `identify` at app launch if a session/cookie is already active.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
