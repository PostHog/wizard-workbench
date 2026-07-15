# PostHog post-wizard report

PostHog has been integrated into the React Router v7 Framework-mode client. The browser SDK is initialized at the client entry point using environment variables, wrapped with the React context provider, and configured with the framework's standard defaults while retaining autocapture and session recording. Event capture was added for simulated follower purchases, feed post likes, and profile follow-back actions. Route errors are captured with PostHog exception tracking. The PostHog SDK dependencies were installed with pnpm and the Vite SSR configuration was updated for browser SDK compatibility.

| Event name | Description | File |
|---|---|---|
| `fake_followers_purchase_completed` | Tracks when a visitor completes the simulated fake follower purchase flow. | `app/routes/buy-followers.tsx` |
| `post_liked` | Tracks when a visitor likes or unlikes a feed post. | `app/components/PostCard.tsx` |
| `follower_back_followed` | Tracks when a visitor follows back a recent follower from their profile. | `app/routes/profile.tsx` |

## Next steps

A PostHog dashboard and notebook could not be created because the PostHog MCP server was unavailable during this run (`ECONNREFUSED` while connecting to the configured server). Create a dashboard named `Analytics basics (wizard)` and add insights for the events above after reconnecting the PostHog MCP server.

## Verify before merging

- [x] Run a full production build and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_POSTHOG_PROJECT_TOKEN` and `VITE_POSTHOG_HOST` to `.env.example` and any deployment/bootstrap documentation.
- [ ] Wire source-map upload into CI so production PostHog stack traces de-minify.

### Agent skill

The installed PostHog integration skill remains available in `.claude/skills/integration-react-react-router-7-framework` for future agent development.
