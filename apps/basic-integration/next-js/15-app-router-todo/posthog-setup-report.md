# PostHog post-wizard report

PostHog product analytics was added to the Next.js App Router application. The browser SDK is initialized in `instrumentation-client.ts` using environment variables, and the server SDK is configured in `lib/posthog-server.ts` with immediate flushing for route-handler events. Todo creation, completion/reopening, and deletion are captured from the corresponding API routes without including user-entered todo text in event properties. PostHog environment variables were added to `.env.local`.

| Event name | Description | File |
| --- | --- | --- |
| `todo_created` | Tracks successful creation of a todo item. | `app/api/todos/route.ts` |
| `todo_completed` | Tracks when a todo is marked completed or reopened. | `app/api/todos/[id]/route.ts` |
| `todo_deleted` | Tracks successful deletion of a todo item. | `app/api/todos/[id]/route.ts` |

## Next steps

Dashboard and notebook creation were unavailable because the PostHog MCP server could not connect in this run.

## Verify before merging

- [ ] Run a full production build and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite; instrumented API call sites may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any deployment/bootstrap configuration.
- [ ] Wire source-map upload into CI so production browser stack traces are de-minified.

### Agent skill

The installed skill context is available under `.claude/skills/integration-nextjs-app-router/` for future agent development.
