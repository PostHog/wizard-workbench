# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your Next.js 15 Pages Router todo application. The integration includes:

- **Client-side initialization** via `instrumentation-client.ts` using the recommended Next.js 15.3+ approach
- **Reverse proxy configuration** in `next.config.ts` to route PostHog requests through `/ingest` for better reliability and ad-blocker avoidance
- **Environment variables** set up in `.env` with `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST`
- **Event tracking** for all core user actions in the todo application
- **Error tracking** with `posthog.captureException()` for all API failures
- **Automatic exception capture** enabled via `capture_exceptions: true` in the PostHog config

## Events Implemented

| Event Name | Description | File |
|------------|-------------|------|
| `todos_loaded` | User successfully loaded their todo list on first visit | `components/todos/todo-list.tsx` |
| `todo_created` | User created a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | User marked a todo item as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | User marked a completed todo as incomplete | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deleted a todo item | `components/todos/todo-list.tsx` |
| `todos_fetch_failed` | Error occurred while fetching todos | `components/todos/todo-list.tsx` |
| `todo_create_failed` | Error occurred while creating a todo | `components/todos/todo-list.tsx` |
| `todo_update_failed` | Error occurred while updating a todo | `components/todos/todo-list.tsx` |
| `todo_delete_failed` | Error occurred while deleting a todo | `components/todos/todo-list.tsx` |
| `about_page_link_clicked` | User clicked the About link from the main page | `components/todos/todo-list.tsx` |
| `back_to_todos_clicked` | User clicked Back to Todos from the About page | `pages/about.tsx` |

## Next steps

We recommend creating the following insights and dashboard to track user behavior based on the events we just instrumented:

### Recommended Dashboard: "Todo App Analytics"

Create this dashboard in PostHog with the following insights:

1. **Todo Creation Funnel**
   - Funnel: `todos_loaded` -> `todo_created` -> `todo_completed`
   - Purpose: Track conversion from viewing todos to creating and completing them

2. **Task Completion Rate (Trend)**
   - Events: `todo_completed` count over time
   - Purpose: Monitor how often users complete their tasks

3. **Error Rate Monitoring**
   - Events: `todo_create_failed`, `todo_update_failed`, `todo_delete_failed`, `todos_fetch_failed`
   - Purpose: Track application reliability and identify issues

4. **User Engagement (Lifecycle)**
   - Event: `todo_created`
   - Purpose: Understand new vs returning user task creation patterns

5. **Feature Usage Breakdown**
   - Events: `todo_created`, `todo_completed`, `todo_deleted`
   - Purpose: Pie chart showing distribution of user actions

### How to Create the Dashboard

1. Go to your PostHog project: https://us.posthog.com
2. Navigate to **Dashboards** -> **New Dashboard**
3. Name it "Todo App Analytics"
4. Add the insights described above using the **New Insight** button

### Useful Links

- [PostHog Dashboard](https://us.posthog.com/dashboards)
- [Create New Insight](https://us.posthog.com/insights/new)
- [PostHog Documentation](https://posthog.com/docs)
- [Next.js Integration Guide](https://posthog.com/docs/libraries/next-js)
