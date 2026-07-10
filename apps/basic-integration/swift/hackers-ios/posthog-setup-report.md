<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of this SwiftUI project by adding a shared PostHog analytics helper, wiring early SDK setup into app launch, instrumenting authentication, feed engagement, comments, onboarding, and support purchase flows, and storing the PostHog API key and host in local environment variables referenced through Info.plist values. The integration also created a live dashboard and five saved insights in PostHog. A remaining follow-up is needed in the Xcode project configuration so the app target definitively links the local `Shared` package and build settings expose `POSTHOG_API_KEY` / `POSTHOG_HOST` at compile time.

| Event name | Description | File |
| --- | --- | --- |
| `app_opened` | Captured when the app finishes launching and analytics are configured. | `App/AppDelegate.swift` |
| `login_succeeded` | Captured after a user successfully authenticates with Hacker News. | `Shared/Sources/Shared/Session/SessionService.swift` |
| `login_failed` | Captured when a login attempt fails in the authentication flow. | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `user_logged_out` | Captured when an authenticated user signs out of the app. | `Shared/Sources/Shared/Session/SessionService.swift` |
| `feed_viewed` | Captured when a feed category becomes visible to the user. | `Features/Feed/Sources/Feed/FeedView.swift` |
| `feed_category_changed` | Captured when the user switches between feed categories. | `Features/Feed/Sources/Feed/FeedView.swift` |
| `post_opened` | Captured when a post is opened from the feed or comments flow. | `Features/Feed/Sources/Feed/FeedView.swift` |
| `bookmark_toggled` | Captured when a user saves or removes a bookmark. | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `search_performed` | Captured when a user performs a search and results return successfully. | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `comments_viewed` | Captured when a post comments thread is loaded. | `Features/Comments/Sources/Comments/CommentsViewModel.swift` |
| `comment_visibility_toggled` | Captured when a user expands or collapses a comment branch. | `Features/Comments/Sources/Comments/CommentsView.swift` |
| `support_products_loaded` | Captured when support purchase options load successfully. | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `support_purchase_completed` | Captured when a support purchase succeeds. | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `support_restore_completed` | Captured when purchase restoration succeeds. | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `onboarding_viewed` | Captured when the onboarding experience is shown. | `Features/Onboarding/Sources/Onboarding/Views/OnboardingView.swift` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1831109)
- [App opens (wizard)](https://us.posthog.com/project/483112/insights/c5Jvn0ti)
- [Content engagement flow (wizard)](https://us.posthog.com/project/483112/insights/u38OCOaK)
- [Support conversions (wizard)](https://us.posthog.com/project/483112/insights/Q1avu3tW)
- [Searches vs bookmarks (wizard)](https://us.posthog.com/project/483112/insights/mE8dTNA9)
- [Login outcome mix (wizard)](https://us.posthog.com/project/483112/insights/SYlDYLzn)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.
- [ ] Update the Xcode project so the app target links the local `Shared` package product and exposes `POSTHOG_API_KEY` / `POSTHOG_HOST` build settings, since the wizard could not fully complete those `project.pbxproj` edits in this environment.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
