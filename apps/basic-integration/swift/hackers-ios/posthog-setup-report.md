<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of the SwiftUI iOS app with PostHog. The setup adds the `posthog-ios` Swift Package dependency through the shared package, initializes PostHog during app launch using environment variables, enables lifecycle and error autocapture, identifies authenticated users, resets analytics identity on logout, and instruments key product events across login, feed usage, comments, onboarding, and supporter purchase flows.

| Event | Description | File |
| --- | --- | --- |
| `app_opened` | Tracks when the app launches and PostHog is initialized. | `App/AppDelegate.swift` |
| `login_submitted` | Tracks when a user submits the sign-in form. | `Features/Authentication/Sources/Authentication/LoginView.swift` |
| `login_succeeded` | Tracks successful authentication after a login attempt. | `Shared/Sources/Shared/Session/SessionService.swift` |
| `login_failed` | Tracks failed authentication attempts with a coarse failure reason. | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `user_logged_out` | Tracks when an authenticated user signs out and the analytics identity resets. | `Shared/Sources/Shared/Session/SessionService.swift` |
| `feed_loaded` | Tracks when a feed category successfully loads posts. | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `feed_searched` | Tracks successful search queries from the feed. | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_opened` | Tracks when a post is opened from the feed or sidebar. | `Features/Feed/Sources/Feed/FeedView.swift` |
| `bookmark_toggled` | Tracks when a user adds or removes a bookmark. | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `comments_loaded` | Tracks when a post's comments finish loading. | `Features/Comments/Sources/Comments/CommentsViewModel.swift` |
| `comment_thread_revealed` | Tracks when a specific comment thread is revealed by navigation. | `Features/Comments/Sources/Comments/CommentsViewModel.swift` |
| `onboarding_dismissed` | Tracks when the user dismisses the what's new onboarding flow. | `Features/Onboarding/Sources/Onboarding/Views/OnboardingView.swift` |
| `support_purchase_completed` | Tracks successful in-app support purchases. | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `support_purchase_failed` | Tracks failed in-app support purchases. | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `support_restore_completed` | Tracks successful purchase restoration requests. | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `app_error_occurred` | Tracks application errors captured around login, search, comments, and support flows. | `Shared/Sources/Shared/Analytics/PostHogAnalytics.swift` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: https://us.posthog.com/project/483112/dashboard/1825448
- Insight: Logins over time (wizard) — https://us.posthog.com/project/483112/insights/se0ZuYBP
- Insight: Login funnel (wizard) — https://us.posthog.com/project/483112/insights/0dsrB8y3
- Insight: Feed engagement mix (wizard) — https://us.posthog.com/project/483112/insights/D7fZYBvP
- Insight: Comments and onboarding activity (wizard) — https://us.posthog.com/project/483112/insights/x22HnAEV
- Insight: Support conversion outcomes (wizard) — https://us.posthog.com/project/483112/insights/lYlBVGUU

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
