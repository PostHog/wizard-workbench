# PostHog post-wizard report

The wizard integrated PostHog client-side analytics into this React Router framework-mode application. It installed `posthog-js` and `@posthog/react`, initialized the SDK from Vite environment variables at the client entry point, configured SSR bundling support, and added exception capture in the route error boundary. Custom events capture key feed engagement and the fake-follower purchase flow without sending user-entered content or other PII.

| Event name | Description | File |
| --- | --- | --- |
| `post_liked` | Captures when a visitor likes or unlikes a post in the feed. | `app/components/PostCard.tsx` |
| `follower_package_selected` | Captures when a visitor selects a fake follower package. | `app/routes/buy-followers.tsx` |
| `follower_purchase_completed` | Captures when a visitor completes a fake follower purchase. | `app/routes/buy-followers.tsx` |
| `follow_back_clicked` | Captures when a visitor follows back a suggested account. | `app/routes/profile.tsx` |

## Next steps

- Dashboard and insights could not be created because the configured PostHog MCP endpoint was unavailable during setup.
- A shareable notebook could not be created for the same reason.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
