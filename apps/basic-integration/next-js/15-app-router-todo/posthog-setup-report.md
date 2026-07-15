# PostHog post-wizard report

The wizard integrated PostHog into this Next.js App Router application. It installed the browser and Node SDKs, configured client initialization through `instrumentation-client.ts`, added a local ingestion proxy, and set the required environment variables in `.env.local`. Server-side captures are emitted from the todo API after successful writes, while the interface captures the matching successful user actions. The browser distinct ID and session ID are forwarded to the API so server and client events correlate without sending todo titles or descriptions to PostHog.

| Event name | Description | File |
| --- | --- | --- |
| `todo_created` | Records a successful todo creation through the API. | `app/api/todos/route.ts` |
| `todo_completion_changed` | Records a successful todo completion state update through the API. | `app/api/todos/[id]/route.ts` |
| `todo_deleted` | Records a successful todo deletion through the API. | `app/api/todos/[id]/route.ts` |
| `todo_creation_succeeded` | Records when a visitor successfully adds a todo in the interface. | `components/todos/todo-list.tsx` |
| `todo_completion_change_succeeded` | Records when a visitor successfully changes a todo completion state in the interface. | `components/todos/todo-list.tsx` |
| `todo_deletion_succeeded` | Records when a visitor successfully deletes a todo in the interface. | `components/todos/todo-list.tsx` |

## Next steps

A production build completed successfully. The PostHog MCP service was unavailable in this environment, so the requested dashboard, insights, and shareable notebook could not be created during this run.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
