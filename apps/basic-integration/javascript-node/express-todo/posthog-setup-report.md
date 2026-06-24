<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your Express todo API with PostHog analytics. The `posthog-node` SDK was installed and initialized in `index.js` using environment variables for the API key and host. The Express middleware helpers `setupExpressRequestContext` and `setupExpressErrorHandler` were registered to automatically enrich events with request metadata (URL, method, path, user agent, IP) and capture unhandled errors. Event capture calls were added to every mutating route handler (`POST`, `PATCH`, `DELETE`). A graceful shutdown handler ensures all queued events are flushed when the process exits.

| Event name | Description | File |
|---|---|---|
| `todo_created` | A new todo item was successfully created via the API. | `index.js` |
| `todo_updated` | An existing todo item was updated (title or completion status changed). | `index.js` |
| `todo_completed` | A todo item was marked as completed (fires alongside `todo_updated` when completion transitions from false to true). | `index.js` |
| `todo_deleted` | A todo item was deleted from the list. | `index.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1751155)
- [Total todos created over time](https://us.posthog.com/project/483112/insights/vk6iBnNg)
- [Todo completion rate](https://us.posthog.com/project/483112/insights/O6qcSOSx)
- [Todos deleted over time](https://us.posthog.com/project/483112/insights/Gq15PGvd)
- [Todo lifecycle funnel: created → completed](https://us.posthog.com/project/483112/insights/Lw0ZqfGn)
- [Most active users by todos created](https://us.posthog.com/project/483112/insights/b20K9Tf6)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`POSTHOG_API_KEY`, `POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
