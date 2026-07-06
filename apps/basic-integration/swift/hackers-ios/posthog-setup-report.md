<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hackers iOS app. PostHog iOS SDK (v3.64.1) was added as a Swift Package Manager dependency to the Xcode project and all relevant feature modules. The SDK is initialized in `AppDelegate` on launch with lifecycle event capture enabled. Twelve events covering the full user journey — from authentication through engagement actions and revenue — were instrumented across six files. User identity is established on login via `PostHogSDK.shared.identify()` and cleared on logout via `reset()`.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully authenticates with their Hacker News credentials. | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `user_logged_out` | User explicitly logs out of their account. | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `post_upvoted` | User upvotes a Hacker News post. | `Shared/Sources/Shared/ViewModels/VotingViewModel.swift` |
| `post_bookmarked` | User toggles the bookmark state on a post (add or remove). | `Shared/Sources/Shared/Services/BookmarksController.swift` |
| `feed_category_changed` | User switches the feed to a different post category. | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `search_performed` | User submits a search query against Hacker News posts. | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `comments_viewed` | User opens the comments thread for a post. | `Features/Comments/Sources/Comments/CommentsViewModel.swift` |
| `comment_upvoted` | User upvotes a comment in a post thread. | `Features/Comments/Sources/Comments/CommentsViewModel.swift` |
| `settings_cache_cleared` | User clears the local cache from the settings screen. | `Features/Settings/Sources/Settings/SettingsViewModel.swift` |
| `support_purchase_initiated` | User initiates a purchase of a supporter subscription or tip. | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `support_purchase_completed` | User successfully completes a supporter subscription or tip purchase. | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `onboarding_completed` | User completes or dismisses the onboarding flow for the first time. | `App/OnboardingCoordinator.swift` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) Dashboard](https://us.posthog.com/project/483112/dashboard/1805815)
- [Daily Active Users](https://us.posthog.com/project/483112/insights/bSANCX0Y)
- [User Login & Logout Trend](https://us.posthog.com/project/483112/insights/OvDaFH2s)
- [Core Engagement Funnel](https://us.posthog.com/project/483112/insights/oKDGn915) — login → comments viewed → post upvoted
- [Support Purchase Funnel](https://us.posthog.com/project/483112/insights/fTAgqD17) — purchase initiated → completed
- [Content Engagement Actions](https://us.posthog.com/project/483112/insights/Hwr7QRfa) — comments, bookmarks, upvotes, searches

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_API_KEY` and `POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs. The current implementation only calls `identify` on explicit login; if users remain logged in across app restarts, consider calling `identify` again in `SessionService` when the persisted session is restored.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
