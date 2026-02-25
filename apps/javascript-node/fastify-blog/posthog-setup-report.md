<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Fastify blog API. The following changes were made to `index.js`:

- **PostHog initialization**: Added `initializePosthog()` which reads `POSTHOG_API_KEY` and `POSTHOG_HOST` from environment variables and initialises the `posthog-node` SDK with `enableExceptionAutocapture: true` for automatic error tracking. The app starts gracefully without analytics if the key is missing.
- **Helper functions**: Added `trackEvent(distinctId, event, properties)` and `identifyUser(distinctId, properties)` wrappers to keep route handlers clean.
- **Error handler**: Added `fastify.setErrorHandler()` which calls `posthog.captureException()` so every unhandled route error is tracked against the triggering user.
- **Event capture**: Added `posthog.capture()` calls in five routes (see table below) with rich contextual properties.
- **User identification**: `posthog.identify()` is called on write actions (`POST /api/posts`, `POST /api/posts/:id/comments`) to associate the `author` field as the user's distinct ID and keep `last_active` up to date.
- **Graceful shutdown**: Added `SIGINT`/`SIGTERM` handlers that close the Fastify server and flush pending PostHog events via `posthog.shutdown()` before the process exits.
- **Environment variables**: `POSTHOG_API_KEY` and `POSTHOG_HOST` have been written to `.env` (git-ignored) and are referenced in code via `process.env`.

| Event | Description | File |
|---|---|---|
| `post_created` | A new blog post was successfully created | `index.js` |
| `post_viewed` | A single blog post was viewed — top of the engagement funnel leading to comments | `index.js` |
| `post_updated` | A blog post was updated (title, body, or published status changed) | `index.js` |
| `post_deleted` | A blog post and its associated comments were deleted | `index.js` |
| `comment_added` | A comment was added to a blog post | `index.js` |

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog ([https://us.posthog.com/project/238460/dashboards](https://us.posthog.com/project/238460/dashboards)) with the following insights:

1. **Post creation trend** – Trend of `post_created` over time to track content growth.
2. **View → Comment conversion funnel** – Funnel from `post_viewed` → `comment_added` to measure content engagement.
3. **Post deletion rate** – Trend of `post_deleted` compared to `post_created` to monitor churn/content turnover.
4. **Post update activity** – Trend of `post_updated` events to gauge how actively authors revise content.
5. **All events overview** – A single trend chart with all five events to get a bird's-eye view of platform activity.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-javascript_node/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
