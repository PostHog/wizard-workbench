# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hackers iOS app. The PostHog iOS SDK (`posthog-ios` 3.62.3) was added via Swift Package Manager to both the main Xcode project (`project.pbxproj`) and to the five Swift Package modules that contain instrumented code (`Authentication`, `Feed`, `Comments`, `Settings`, `Shared`). PostHog is initialized in `HackersApp.init()` with lifecycle event capture enabled. Users are identified on login and their session is reset on logout. Thirteen events covering the full user journey — from authentication through content engagement to in-app purchases — have been instrumented across the app.

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | Fires when a user successfully authenticates with their HN credentials. | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `user_logged_out` | Fires when a user signs out of their HN account. | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `post_viewed` | Fires when a user opens a post to read its comments. | `Features/Comments/Sources/Comments/CommentsView.swift` |
| `post_upvoted` | Fires when a user upvotes a post. | `Shared/Sources/Shared/ViewModels/VotingViewModel.swift` |
| `comment_upvoted` | Fires when a user upvotes a comment. | `Shared/Sources/Shared/ViewModels/VotingViewModel.swift` |
| `post_bookmarked` | Fires when a user saves or removes a bookmark on a post. | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `feed_category_changed` | Fires when a user switches the feed category (news, ask, show, jobs, etc.). | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `search_performed` | Fires when a user submits a search query. | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `link_opened` | Fires when a user taps a post's external article link. | `Features/Feed/Sources/Feed/FeedView.swift` |
| `support_subscription_purchased` | Fires when a user completes a monthly supporter subscription purchase. | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `support_tip_given` | Fires when a user completes a one-off tip purchase. | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `support_purchases_restored` | Fires when a user successfully restores prior purchases. | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `settings_text_size_changed` | Fires when a user changes the app text size preference. | `Features/Settings/Sources/Settings/SettingsViewModel.swift` |

## Next steps

Create an "Analytics basics (wizard)" dashboard in your [PostHog project](https://us.i.posthog.com/project/483112) with these recommended insights:

1. **Login funnel** — Funnel from `user_logged_in` → `post_viewed` → `post_upvoted` to measure post-login engagement.
2. **Content engagement** — Trend of `post_viewed`, `post_upvoted`, and `comment_upvoted` over time.
3. **Search adoption** — Trend of `search_performed` with breakdown by result count.
4. **Revenue funnel** — Funnel from `support_subscription_purchased` and `support_tip_given` to measure conversion in the support flow.
5. **Churn signal** — Trend of `user_logged_out` relative to `user_logged_in` to detect logout spikes.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any team bootstrap scripts so collaborators know what values to set.
- [ ] Confirm the returning-visitor path also calls `identify` — currently `identify` is only called in `LoginViewModel.performLogin`. If users remain authenticated across app launches (session restoration), add a `identify` call in the session restoration path so returning sessions are not left on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-swift/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
