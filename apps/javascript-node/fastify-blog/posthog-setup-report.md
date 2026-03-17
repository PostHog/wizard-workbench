<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your Fastify blog API with PostHog analytics. The `posthog-node` SDK was installed, a PostHog client was initialized in `index.js` using environment variables, and `capture` calls were added to every route that creates, updates, or deletes data. A Fastify `setErrorHandler` was wired up to `captureException` for automatic error tracking, and graceful shutdown hooks flush pending events on SIGINT/SIGTERM.

| Event name | Description | File |
|---|---|---|
| `post created` | A new blog post was created | `index.js` |
| `post viewed` | A single blog post was viewed (top of conversion funnel) | `index.js` |
| `post updated` | A blog post was updated (title, body, or published status changed) | `index.js` |
| `post deleted` | A blog post was deleted along with its comments | `index.js` |
| `comment added` | A comment was added to a blog post | `index.js` |

## Next steps

We attempted to create the "Analytics basics" dashboard automatically, but the API key provided does not have the `dashboard:write` or `insight:write` scopes. You can create the dashboard manually in PostHog using the events above. Suggested insights:

1. **Posts created over time** — Trend chart on `post created`
2. **Content publishing funnel** — Funnel: `post created` → `post updated` (where `published = true`)
3. **Comments added over time** — Trend chart on `comment added`
4. **Post deletions (churn signal)** — Trend chart on `post deleted`
5. **Post engagement** — Trend chart comparing `post viewed` vs `comment added`

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
