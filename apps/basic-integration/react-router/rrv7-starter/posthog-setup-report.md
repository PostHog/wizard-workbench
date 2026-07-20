# PostHog post-wizard report

The wizard integrated PostHog into this React Router v7 Framework-mode application. It installed the browser, React, and Node SDKs; initialized browser analytics from environment variables; added request-scoped server initialization with session correlation, exception autocapture, and awaited shutdown; enabled React Router middleware; captured route errors; and instrumented the app's key purchase and engagement actions. Autocapture and session recording remain at their defaults.

| Event | Description | File |
| --- | --- | --- |
| `follower_package_selected` | A visitor selects a fake follower package in the purchase funnel. | `app/routes/buy-followers.tsx` |
| `follower_purchase_completed` | A visitor completes the simulated fake follower purchase flow. | `app/routes/buy-followers.tsx` |
| `post_like_toggled` | A visitor likes or unlikes a post in the feed. | `app/components/PostCard.tsx` |
| `user_followed_back` | A visitor follows back one of the suggested bot accounts. | `app/routes/profile.tsx` |

## Next steps

The PostHog dashboard and notebook could not be created because the PostHog MCP service was unavailable during setup. Once access is restored, create **Analytics basics (wizard)** with a package-selection-to-purchase funnel and trends for purchase completions, post like toggles, and follow-backs.

## Verify before merging

- [ ] Run a full production build and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or the bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
