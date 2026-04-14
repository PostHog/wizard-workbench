<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your Fastify blog API with PostHog analytics. Here is a summary of every change made:

- **`posthog-node` installed** as a production dependency (`package.json`).
- **`.env` created** with `POSTHOG_API_KEY` and `POSTHOG_HOST` (covered by `.gitignore`).
- **`index.js` updated**:
  - PostHog client initialised at startup using environment variables, with `enableExceptionAutocapture: true`.
  - Five `posthog.capture()` calls added across route handlers (see table below).
  - `fastify.setErrorHandler()` added to call `posthog.captureException(err)` on every unhandled server error.

## Events instrumented

| Event | Description | File |
|---|---|---|
| `post created` | Fired when a new blog post is successfully created via `POST /api/posts` | `index.js` |
| `post viewed` | Fired when a single post is fetched via `GET /api/posts/:id` — top of the engagement funnel | `index.js` |
| `post updated` | Fired when a post is updated via `PATCH /api/posts/:id` | `index.js` |
| `post deleted` | Fired when a post and its comments are deleted via `DELETE /api/posts/:id` | `index.js` |
| `comment created` | Fired when a comment is successfully added to a post via `POST /api/posts/:id/comments` | `index.js` |

## Next steps

Head to your PostHog project to explore these events and build insights:

- **PostHog project**: https://us.posthog.com/project/2
- **Create a new dashboard** ("Analytics basics"): https://us.posthog.com/project/2/dashboard/new
- **Insights to create** (suggested):
  1. **Posts created over time** — Trend on `post created`
  2. **Comments created over time** — Trend on `comment created`
  3. **Post engagement funnel** — Funnel: `post viewed` → `comment created`
  4. **Post update rate** — Trend on `post updated`
  5. **Post deletion rate** — Trend on `post deleted`

Use the [Insights builder](https://us.posthog.com/project/2/insights/new) to create each insight and pin them to your new dashboard.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
