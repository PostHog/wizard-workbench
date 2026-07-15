# PostHog post-wizard report

The wizard integrated PostHog into this SwiftUI iOS app. The Xcode project now declares the `posthog-ios` Swift Package Manager dependency and links the `PostHog` product to the app target. PostHog initializes during application launch from `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` environment values, with iOS error autocapture enabled. Product events cover onboarding completion, authentication, logout, and opening posts. Logout resets the analytics identity to avoid attributing later activity to the previous user.

| Event name | Description | File |
| --- | --- | --- |
| `onboarding_completed` | User completes the introductory onboarding flow. | `App/OnboardingCoordinator.swift` |
| `user_authenticated` | User successfully authenticates with the app. | `App/ContentView.swift` |
| `user_logged_out` | Authenticated user signs out of the app. | `App/ContentView.swift` |
| `post_opened` | User opens a post to read its discussion. | `App/NavigationStore.swift` |

## Next steps

A PostHog dashboard and shareable notebook could not be created because the configured PostHog MCP server was unavailable in this environment. Create an **Analytics basics (wizard)** dashboard in PostHog once the server connection is restored, using the events listed above.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
