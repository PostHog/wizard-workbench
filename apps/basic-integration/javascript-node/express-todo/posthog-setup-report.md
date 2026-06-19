# PostHog post-wizard report

The wizard has completed a PostHog integration for the Express Todo API. `posthog-node` was installed and initialized in `index.js` with `setupExpressRequestContext` (automatically reads `x-posthog-distinct-id` and `x-posthog-session-id` headers from incoming requests) and `setupExpressErrorHandler` (captures unhandled Express errors to PostHog Error Tracking). Event captures were added to all mutating routes, and environment variables were written to `.env`.

| Event name | Description | File |
|---|---|---|
| `todo_created` | A new todo item was created via the API. | index.js |
| `todo_completed` | A todo item was marked as completed. | index.js |
| `todo_updated` | A todo item's title was updated. | index.js |
| `todo_deleted` | A todo item was deleted via the API. | index.js |

## Next steps

A dashboard could not be created in this run because the CI environment's PostHog API key lacks `dashboard:write` scope. Once merged, create an "Analytics basics (wizard)" dashboard in PostHog manually with these suggested insights:

- **Todo creations over time** — Trend chart of `todo_created`
- **Todo completion rate** — Funnel: `todo_created` → `todo_completed`
- **Todo actions breakdown** — Bar chart comparing all four event types
- **Todo deletions over time** — Trend chart of `todo_deleted`
- **Total todos created** — Single number aggregate of `todo_created`

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
