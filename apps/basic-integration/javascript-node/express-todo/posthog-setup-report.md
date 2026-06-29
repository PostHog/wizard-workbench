<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Express Todo API. The `posthog-node` SDK was installed and wired into `index.js` with the following changes:

- Imported `PostHog`, `setupExpressRequestContext`, and `setupExpressErrorHandler` from `posthog-node`.
- Initialized a `PostHog` client using `POSTHOG_API_KEY` and `POSTHOG_HOST` environment variables, with `enableExceptionAutocapture: true`.
- Registered `setupExpressRequestContext` before routes so that the `x-posthog-distinct-id` and `x-posthog-session-id` headers (sent by posthog-js frontends) are automatically picked up per-request.
- Added `posthog.capture()` calls in the POST, PATCH, and DELETE route handlers to track meaningful todo actions.
- Registered `setupExpressErrorHandler` after routes to automatically send Express errors to PostHog Error Tracking.
- Added a `SIGTERM` handler to call `posthog.shutdown()` so in-flight events are flushed before the process exits.
- Created `.env` with `POSTHOG_API_KEY` and `POSTHOG_HOST` (covered by `.gitignore`).

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `todo created` | A new todo item is successfully created via POST /api/todos. | `index.js` |
| `todo completed` | A todo item is marked as completed via PATCH /api/todos/:id. | `index.js` |
| `todo updated` | A todo item's title is updated via PATCH /api/todos/:id. | `index.js` |
| `todo deleted` | A todo item is deleted via DELETE /api/todos/:id. | `index.js` |

## Next steps

A PostHog dashboard could not be automatically created because no personal API key was available. Once your PostHog personal API key is configured, you can create a dashboard manually in PostHog and add the following suggested insights:

- **Todo creation trend** — `todo created` event count over time (line chart)
- **Todo completion rate** — `todo completed` / `todo created` funnel
- **Todo deletion trend** — `todo deleted` event count over time
- **Active users** — unique users triggering any todo event per day

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_API_KEY` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
