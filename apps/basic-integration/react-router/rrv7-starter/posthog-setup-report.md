# PostHog post-wizard report

The wizard integrated PostHog into the React Router v7 client entry, preserved default autocapture and session recording behavior, added route-level error capture, and instrumented the app's purchase and engagement flows. The SDK reads its project token and host from `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` in the local environment. Type checking and the production build both pass.

| Event | Description | File |
| --- | --- | --- |
| `follower_package_selected` | A visitor selected a fake follower package in the purchase funnel. | `app/routes/buy-followers.tsx` |
| `follower_purchase_completed` | A visitor completed the simulated fake follower purchase flow. | `app/routes/buy-followers.tsx` |
| `post_like_toggled` | A visitor liked or unliked a post in the feed. | `app/components/PostCard.tsx` |
| `follower_followed_back` | A visitor followed back a recent follower from the profile. | `app/routes/profile.tsx` |

## Next steps

The PostHog MCP endpoint was unavailable during setup, so the live dashboard, insights, and notebook could not be created. Reconnect the PostHog MCP server and create **Analytics basics (wizard)** with an ordered funnel from `follower_package_selected` to `follower_purchase_completed`, plus trends for the four events above.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
