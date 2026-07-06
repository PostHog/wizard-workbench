<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Express todo API. The `posthog-node` SDK was installed and initialized in `index.js` with `enableExceptionAutocapture: true`. The `setupExpressRequestContext` middleware was registered before all routes so that requests carrying `x-posthog-distinct-id` and `x-posthog-session-id` headers automatically propagate user identity to captured events. Four events are captured across the three mutating route handlers. `setupExpressErrorHandler` was registered after all routes to forward unhandled Express errors to PostHog Error Tracking. A `SIGTERM` handler calls `posthog.shutdown()` to flush any queued events before the process exits. PostHog credentials are read from environment variables; `.env` has been created and added to `.gitignore`.

| Event name | Description | File |
|---|---|---|
| `todo_created` | A new todo item was successfully created via the API. | `index.js` |
| `todo_updated` | An existing todo item's title or completion status was updated. | `index.js` |
| `todo_completed` | A todo item was marked as completed. | `index.js` |
| `todo_deleted` | A todo item was permanently deleted. | `index.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1807615)
- [Todo Actions Over Time](https://us.posthog.com/project/483112/insights/YzepVwjB)
- [Todo Completion Rate](https://us.posthog.com/project/483112/insights/2AJDgMw6)
- [Todos Deleted](https://us.posthog.com/project/483112/insights/BuDGtpuL)
- [Todo Creation to Completion Funnel](https://us.posthog.com/project/483112/insights/JIy6YvVO)
- [Daily Active Users](https://us.posthog.com/project/483112/insights/5sUYxXmV)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_API_KEY` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
