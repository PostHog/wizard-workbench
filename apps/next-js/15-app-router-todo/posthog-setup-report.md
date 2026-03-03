<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router todo application. The integration includes:

- **Client-side initialization** via `instrumentation-client.ts` using the Next.js 15.3+ recommended approach (no `PostHogProvider` wrapper needed)
- **Reverse proxy** configured in `next.config.ts` to route PostHog traffic through `/ingest` for improved reliability and ad-blocker bypass
- **Client-side event tracking** in `components/todos/todo-list.tsx` for all user actions
- **Server-side event tracking** in `app/api/todos/route.ts` and `app/api/todos/[id]/route.ts` using `posthog-node`
- **Error tracking** via `posthog.captureException()` in all async handlers
- **Environment variables** set in `.env.local` using `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST`

| Event | Description | File |
|-------|-------------|------|
| `todo_created` | Fired on the client when a new todo is successfully added via the form | `components/todos/todo-list.tsx` |
| `todo_completed` | Fired on the client when a todo is toggled to completed state | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | Fired on the client when a todo is toggled back to incomplete state | `components/todos/todo-list.tsx` |
| `todo_deleted` | Fired on the client when a todo is successfully deleted | `components/todos/todo-list.tsx` |
| `todo_created` | Server-side event fired when a todo is successfully created via POST `/api/todos` | `app/api/todos/route.ts` |
| `todo_updated` | Server-side event fired when a todo is successfully updated via PATCH `/api/todos/[id]` | `app/api/todos/[id]/route.ts` |
| `todo_deleted` | Server-side event fired when a todo is successfully deleted via DELETE `/api/todos/[id]` | `app/api/todos/[id]/route.ts` |

## Next steps

We've referenced an existing analytics dashboard with insights that match the events instrumented in this project:

- [Analytics basics dashboard](https://us.posthog.com/project/2/dashboard/1195065) — Core todo app analytics overview
- [Todo Activity Overview insight](https://us.posthog.com/project/2/insights/X1GrGf0U) — Daily trend of todos created, completed, and deleted
- [Todo Completion Funnel insight](https://us.posthog.com/project/2/insights/wQrzcm5m) — Conversion funnel from `todo_created` to `todo_completed`

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
