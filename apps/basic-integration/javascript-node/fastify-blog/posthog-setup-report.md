# PostHog post-wizard report

The wizard has completed a full PostHog integration for the Fastify blog API. The `posthog-node` SDK was installed, a singleton client was initialized with environment variable references (never hardcoded keys), and `capture()` calls were added to every route that mutates data. An error handler using `captureException()` was wired into Fastify's `setErrorHandler`, and graceful shutdown hooks flush the event queue on `SIGINT`/`SIGTERM`.

| Event name | Description | File |
|---|---|---|
| `post created` | Fired when a user successfully creates a new blog post via `POST /api/posts`. | `index.js` |
| `post published` | Fired when a post's `published` status is set to `true` via `PATCH /api/posts/:id`. | `index.js` |
| `post updated` | Fired when a post's content (title or body) is updated via `PATCH /api/posts/:id`. | `index.js` |
| `post deleted` | Fired when a post and its associated comments are deleted via `DELETE /api/posts/:id`. | `index.js` |
| `comment added` | Fired when a user successfully adds a comment to a post via `POST /api/posts/:id/comments`. | `index.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1829183)
- [Posts created over time](https://us.posthog.com/project/483112/insights/ZFn5e46o) — line chart of post creation volume over the last 30 days
- [Post publish funnel](https://us.posthog.com/project/483112/insights/hwN6QHbf) — conversion funnel from `post created` → `post published` (14-day window)
- [Posts deleted](https://us.posthog.com/project/483112/insights/uAztoxHZ) — bar chart of deletions as a content churn signal
- [Blog activity by event type](https://us.posthog.com/project/483112/insights/WFa5OHEB) — stacked bar of posts created, updated, and comments added
- [Comments added over time](https://us.posthog.com/project/483112/insights/Qt5GpfBg) — area chart of reader engagement over time

Dashboard subscription and alerts were skipped (the consent prompt was unavailable in this run). You can set these up manually in PostHog under the dashboard's **Share & export** menu for the weekly email digest, and under each insight's **Alerts** tab for threshold notifications.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_API_KEY` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
