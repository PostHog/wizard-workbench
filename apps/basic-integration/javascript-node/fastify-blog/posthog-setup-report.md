# PostHog post-wizard report

The wizard has completed a full PostHog integration for this Fastify blog API. `posthog-node` was installed and a shared client instance was created in `index.js`, initialized from environment variables. Capture calls were added to every mutating route handler (`POST /api/posts`, `PATCH /api/posts/:id`, `DELETE /api/posts/:id`, `POST /api/posts/:id/comments`). `posthog.identify()` is called on post creation and comment creation to link the `author` string to a person profile. A `setErrorHandler` was added so all unhandled Fastify errors are forwarded to PostHog error tracking via `captureException`. A graceful shutdown hook flushes the event queue on `SIGTERM`.

| Event name | Description | File |
|---|---|---|
| `post_created` | Fired when a user successfully creates a new blog post. | `index.js` |
| `post_updated` | Fired when a user updates an existing blog post's title, body, or published status. | `index.js` |
| `post_published` | Fired when a post's published status is set to true for the first time. | `index.js` |
| `post_deleted` | Fired when a user deletes a blog post and all its associated comments. | `index.js` |
| `comment_added` | Fired when a user adds a comment to a blog post. | `index.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1818100)
- [Posts created over time](https://us.posthog.com/project/483112/insights/5ds2LLdT)
- [Comments added over time](https://us.posthog.com/project/483112/insights/HEU69pvN)
- [Post publish funnel](https://us.posthog.com/project/483112/insights/b55ugFOI)
- [Post deletions over time](https://us.posthog.com/project/483112/insights/VdwIQ1xT)
- [Active authors](https://us.posthog.com/project/483112/insights/ehvrX6pI)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_API_KEY` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
