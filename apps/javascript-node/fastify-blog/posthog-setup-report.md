<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your Fastify blog API with PostHog analytics. The `posthog-node` SDK has been installed and configured in `index.js`, with event capture added to every route that creates, updates, or deletes data. An error handler using `captureException` has been added for automatic error tracking, and graceful shutdown ensures all queued events are flushed before the process exits.

## Changes made

**`index.js`** — Added PostHog client initialization with `enableExceptionAutocapture: true`, four `posthog.capture()` calls in the mutation routes, a Fastify error handler using `posthog.captureException()`, and SIGINT/SIGTERM shutdown handlers.

**`.env`** — Created with `POSTHOG_API_KEY` and `POSTHOG_HOST` environment variables.

**`package.json`** — `posthog-node` added as a dependency (`^5.26.2`).

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `post created` | Fired when a new blog post is successfully created via `POST /api/posts` | `index.js` |
| `post updated` | Fired when an existing post is updated via `PATCH /api/posts/:id`, including publish status changes | `index.js` |
| `post deleted` | Fired when a post and its comments are deleted via `DELETE /api/posts/:id` | `index.js` |
| `comment created` | Fired when a comment is added to a post via `POST /api/posts/:id/comments` | `index.js` |

## Recommended dashboard: "Analytics basics"

Create an **"Analytics basics"** dashboard in PostHog with the following five insights:

1. **Post creation trend** — Trend chart counting `post created` events over time
2. **Comment activity** — Trend chart counting `comment created` events over time
3. **Content publishing funnel** — Funnel from `post created` → `post updated` (where `published = true`)
4. **Post deletion rate** — Trend chart counting `post deleted` events over time
5. **Top authors** — Table of unique `distinctId` values by `post created` event count

## Next steps

We've built a solid analytics foundation. Here's what you can do next:

- **View your events** at [https://us.posthog.com/project/2/events](https://us.posthog.com/project/2/events) once data flows in
- **Create the "Analytics basics" dashboard** at [https://us.posthog.com/project/2/dashboards](https://us.posthog.com/project/2/dashboards) using the five insights above
- **Add user identification**: if you add authentication to the blog, call `posthog.identify()` on login to link author names to real user profiles

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-javascript_node/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
