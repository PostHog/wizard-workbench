<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hackers iOS app. Here is a summary of all changes made:

## Summary of changes

- **PostHog iOS SDK v3.50.0** added as a Swift Package Manager dependency to `Hackers.xcodeproj/project.pbxproj` and `Package.resolved`.
- **PostHog SDK** added as a dependency to the `Authentication`, `Feed`, `Comments`, and `Settings` feature packages (`Package.swift`).
- **`PostHogEnv` enum** and SDK initialization added to `App/HackersApp.swift`, reading `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from Xcode scheme environment variables.
- **Xcode scheme** (`Hackers.xcscheme`) updated with `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` environment variable entries for the Run action.
- **`.env` file** created with `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` values.
- **Event tracking** added across 5 files covering login, feed navigation, search, bookmarking, voting, purchases, and onboarding.

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | User successfully authenticated with Hacker News credentials | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `user_logged_out` | User logged out of their Hacker News account | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `login_failed` | User attempted login but authentication failed | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `feed_category_changed` | User switched the feed category (e.g. News, Ask, Show, Jobs) | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_bookmarked` | User bookmarked or removed bookmark from a post | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_searched` | User performed a search query on Hacker News posts | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_voted` | User upvoted a post from the comments view | `Features/Comments/Sources/Comments/CommentsViewModel.swift` |
| `comment_voted` | User upvoted a comment | `Features/Comments/Sources/Comments/CommentsViewModel.swift` |
| `purchase_completed` | User successfully completed a supporter subscription or tip purchase | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `purchase_failed` | User's in-app purchase attempt failed | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `onboarding_completed` | User completed the onboarding flow for a new app version | `App/OnboardingCoordinator.swift` |

## Next steps

We've prepared a set of recommended insights for an **"Analytics basics"** dashboard. Create these in your PostHog project at https://us.posthog.com:

1. **Login funnel** — Funnel from `user_logged_in` to `purchase_completed`: tracks how many authenticated users convert to paying supporters.
2. **Daily active users** — Trend of unique users triggering any event per day: a core engagement metric.
3. **Feed category distribution** — Breakdown of `feed_category_changed` by `to_category` property: shows which content categories users prefer.
4. **Purchase conversion** — Trend of `purchase_completed` vs `purchase_failed` over time: monitors in-app purchase health.
5. **Search usage** — Trend of `post_searched` with average `result_count` property: measures search engagement.

To create the dashboard:
1. Go to **Dashboards** → **New dashboard** → name it "Analytics basics"
2. Add each insight via **New insight** using the event names above
3. For the login funnel, use the **Funnel** insight type with steps: `user_logged_in` → `purchase_completed`

### Configuration reminder

The `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` values are set in the Xcode scheme's **Run** environment variables. For CI/CD or release builds, ensure these are set in your build environment or via a secure secrets manager — never commit secrets to source control.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-swift/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
