# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js 15 Pages Router Todo application. The integration includes:

- **Client-side initialization** via `instrumentation-client.ts` using the recommended Next.js 15.3+ approach
- **Reverse proxy configuration** in `next.config.ts` to route PostHog requests through `/ingest` for improved reliability and ad-blocker bypass
- **Environment variables** configured in `.env` for secure API key management
- **Event tracking** for all CRUD operations on todos, navigation events, and error handling

## Events Implemented

| Event Name | Description | File |
|------------|-------------|------|
| `todo_created` | User successfully creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks a todo as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | User marks a completed todo as incomplete | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item | `components/todos/todo-list.tsx` |
| `todo_create_failed` | Error occurred while creating a todo | `components/todos/todo-list.tsx` |
| `todo_update_failed` | Error occurred while updating a todo | `components/todos/todo-list.tsx` |
| `todo_delete_failed` | Error occurred while deleting a todo | `components/todos/todo-list.tsx` |
| `todos_fetch_failed` | Error occurred while fetching todos list | `components/todos/todo-list.tsx` |
| `about_page_link_clicked` | User clicks the About link from the main page | `components/todos/todo-list.tsx` |
| `back_to_todos_clicked` | User clicks Back to Todos link from the About page | `pages/about.tsx` |

## Files Modified/Created

| File | Changes |
|------|---------|
| `instrumentation-client.ts` | Created - PostHog client-side initialization |
| `next.config.ts` | Modified - Added PostHog reverse proxy rewrites |
| `.env` | Created - Environment variables for PostHog |
| `components/todos/todo-list.tsx` | Modified - Added event tracking for CRUD operations and navigation |
| `pages/about.tsx` | Modified - Added click tracking for Back to Todos link |

## Next steps

### Create a dashboard

Visit your PostHog project and create a dashboard named "Analytics basics" with the following suggested insights:

1. **Todo Creation Funnel** - Track users who create todos and complete them
2. **Feature Engagement** - Track `todo_created`, `todo_completed`, `todo_deleted` events over time
3. **Error Rate** - Monitor `*_failed` events to track application health
4. **Navigation Flow** - Analyze `about_page_link_clicked` and `back_to_todos_clicked` patterns
5. **Task Completion Rate** - Compare `todo_completed` vs `todo_created` events

### Suggested queries

```sql
-- Daily todo creation trend
SELECT toDate(timestamp) as day, count(*) as todos_created
FROM events
WHERE event = 'todo_created'
GROUP BY day
ORDER BY day DESC

-- Completion rate
SELECT
  countIf(event = 'todo_completed') as completed,
  countIf(event = 'todo_created') as created,
  round(completed / created * 100, 2) as completion_rate
FROM events
WHERE event IN ('todo_created', 'todo_completed')
```

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This context will help you prevent the model from using out-of-date approaches to the PostHog integration.
