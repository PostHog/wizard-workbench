<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 App Router todo application. Client-side PostHog is initialized via `instrumentation-client.ts` (the recommended Next.js 15.3+ approach), with a reverse proxy configured in `next.config.ts` so all analytics traffic routes through `/ingest`. A server-side PostHog client was created in `lib/posthog-server.ts` and wired into both API routes. Error tracking via `captureException` was added to all client-side action handlers. Environment variables are stored in `.env.local`.

| Event Name | Description | File |
|---|---|---|
| `todo_created` | Fired when a user successfully creates a new todo item. | `components/todos/todo-list.tsx` |
| `todo_completed` | Fired when a user marks a todo item as completed. | `components/todos/todo-list.tsx` |
| `todo_reopened` | Fired when a user unchecks a completed todo, marking it active again. | `components/todos/todo-list.tsx` |
| `todo_deleted` | Fired when a user deletes a todo item. | `components/todos/todo-list.tsx` |
| `server_todo_created` | Server-side event fired when a new todo is successfully created via the API. | `app/api/todos/route.ts` |
| `server_todo_deleted` | Server-side event fired when a todo is successfully deleted via the API. | `app/api/todos/[id]/route.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1792909)
- [Todo actions over time](https://us.posthog.com/project/483112/insights/uJYVQJjG)
- [Task completion rate](https://us.posthog.com/project/483112/insights/6TGyjdXh)
- [Todos created (total)](https://us.posthog.com/project/483112/insights/hOugJKbt)
- [Todo churn: deletions vs completions](https://us.posthog.com/project/483112/insights/UdTo9D7q)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
