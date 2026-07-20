# PostHog post-wizard report

The wizard integrated PostHog into the SwiftUI application through Swift Package Manager, initialized analytics during app startup, enabled automatic error capture, configured build-time environment values, added authenticated-user identification/reset behavior, and instrumented key reading, navigation, onboarding, and sharing actions. The iOS Simulator Debug build completed successfully.

| Event | Description | File |
|---|---|---|
| `post_opened` | A reader opened a Hacker News post or its comments. | `App/NavigationStore.swift` |
| `feed_category_selected` | A reader selected a different feed category. | `App/NavigationStore.swift` |
| `deep_link_opened` | The app accepted a deep link to a Hacker News item. | `App/NavigationStore.swift` |
| `login_succeeded` | A reader successfully authenticated with Hacker News. | `App/ContentView.swift` |
| `user_logged_out` | An authenticated reader signed out. | `App/ContentView.swift` |
| `onboarding_completed` | A reader completed the What's New onboarding flow. | `App/OnboardingCoordinator.swift` |
| `article_shared` | A reader shared an article from the in-app browser. | `App/EmbeddedWebView.swift` |
| `article_opened_externally` | A reader opened an article in Safari from the in-app browser. | `App/EmbeddedWebView.swift` |

## Next steps

The PostHog dashboard and notebook could not be created because the configured PostHog MCP service was unavailable during setup. Once it is available, create **Analytics basics (wizard)** using the events above.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
