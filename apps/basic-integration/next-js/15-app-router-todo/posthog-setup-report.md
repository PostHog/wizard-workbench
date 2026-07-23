# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Next.js 15 App Router todo application. PostHog is initialized via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+), with a reverse proxy configured in `next.config.ts` to avoid ad blockers. Both client-side and server-side events are tracked, with `tracing_headers` enabled to correlate anonymous browser sessions with server-side API route events.

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `todo_created` | User successfully creates a new todo item from the form | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks an active todo item as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | User marks a completed todo item as active again | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item | `components/todos/todo-list.tsx` |
| `todo_created` | Server confirms a new todo was successfully persisted via the POST API route | `app/api/todos/route.ts` |
| `todo_updated` | Server confirms a todo was successfully updated via the PATCH API route | `app/api/todos/[id]/route.ts` |
| `todo_deleted` | Server confirms a todo was successfully deleted via the DELETE API route | `app/api/todos/[id]/route.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1897335)
- **Insight**: [Todo actions over time (wizard)](https://us.posthog.com/project/483112/insights/JwGvVaqL)
- **Insight**: [Todo completion rate (wizard)](https://us.posthog.com/project/483112/insights/8Yo8zw1m)
- **Insight**: [Create to complete funnel (wizard)](https://us.posthog.com/project/483112/insights/MQWCI0Ff)
- **Insight**: [Todos with description (wizard)](https://us.posthog.com/project/483112/insights/R0mbtfxK)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
