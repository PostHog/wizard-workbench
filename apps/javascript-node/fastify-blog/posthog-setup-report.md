<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Fastify blog API. The `posthog-node` SDK was installed and initialized in `index.js` with exception autocapture enabled. Event tracking was added to all mutating route handlers, error tracking was wired into Fastify's `setErrorHandler`, and the process gracefully flushes all pending events on `SIGINT`/`SIGTERM`. Environment variables are loaded via Node's built-in `--env-file=.env` flag, and the scripts in `package.json` were updated accordingly.

| Event name | Description | File |
|---|---|---|
| `post created` | Fired when a user creates a new blog post | `index.js` |
| `post published` | Fired when a blog post is published (published field changes to true) | `index.js` |
| `post deleted` | Fired when a blog post is deleted along with its comments | `index.js` |
| `comment created` | Fired when a user adds a comment to a blog post | `index.js` |

## Next steps

The PostHog MCP was unavailable to automatically create a dashboard in this environment. You can create an **"Analytics basics"** dashboard manually in PostHog with the following recommended insights:

1. **Post creation trend** — Line chart of `post created` over time
2. **Post publish funnel** — Funnel: `post created` → `post published` (measures publish rate)
3. **Comment engagement** — Line chart of `comment created` over time
4. **Post deletion rate** — Bar chart of `post deleted` vs `post created` to track churn
5. **Top authors** — Breakdown of `post created` by `author` property

Visit your PostHog project to build these insights: https://us.posthog.com/project/2/insights

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
