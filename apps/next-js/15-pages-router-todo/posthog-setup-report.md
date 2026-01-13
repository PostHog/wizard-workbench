# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your Next.js 15 Pages Router Todo application. The integration includes:

- **Client-side initialization** via `instrumentation-client.ts` using the recommended approach for Next.js 15.3+
- **Reverse proxy setup** in `next.config.ts` to route PostHog requests through `/ingest` for improved reliability and ad-blocker avoidance
- **Environment variables** configured in `.env` with `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST`
- **Error tracking** enabled with `capture_exceptions: true` for automatic exception capture
- **Event tracking** for all core todo operations with relevant properties

## Events Implemented

| Event Name | Description | File |
|------------|-------------|------|
| `todo_created` | Fired when a user successfully creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | Fired when a user marks a todo as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | Fired when a user marks a completed todo as incomplete | `components/todos/todo-list.tsx` |
| `todo_deleted` | Fired when a user deletes a todo item | `components/todos/todo-list.tsx` |
| `fetch_todos_failed` | Fired when fetching todos from the API fails | `components/todos/todo-list.tsx` |
| `create_todo_failed` | Fired when creating a todo fails due to an error | `components/todos/todo-list.tsx` |
| `update_todo_failed` | Fired when updating a todo fails due to an error | `components/todos/todo-list.tsx` |
| `delete_todo_failed` | Fired when deleting a todo fails due to an error | `components/todos/todo-list.tsx` |
| `about_page_link_clicked` | Fired when a user clicks the About link from the todo list page | `components/todos/todo-list.tsx` |
| `back_to_todos_clicked` | Fired when a user clicks the Back to Todos button on the About page | `pages/about.tsx` |

## Files Created/Modified

| File | Action | Purpose |
|------|--------|---------|
| `instrumentation-client.ts` | Created | PostHog client-side initialization |
| `next.config.ts` | Modified | Added PostHog reverse proxy rewrites |
| `.env` | Created | Environment variables for PostHog |
| `components/todos/todo-list.tsx` | Modified | Added event tracking for todo operations |
| `pages/about.tsx` | Modified | Added event tracking for navigation |

## Next steps

### Create a Dashboard

Visit your PostHog project and create an "Analytics Basics" dashboard with the following recommended insights:

1. **Todo Creation Funnel**: Track users from page view to `todo_created`
2. **Task Completion Rate**: Ratio of `todo_completed` to `todo_created` events
3. **Todo Operations Over Time**: Trend of `todo_created`, `todo_completed`, and `todo_deleted`
4. **Error Rate Monitoring**: Count of all `*_failed` events
5. **User Engagement**: Unique users performing todo actions per day

### Verify Integration

1. Run your development server: `pnpm dev`
2. Create, complete, and delete some todos
3. Check your PostHog dashboard at https://us.posthog.com to see events flowing in

### Additional Recommendations

- **User Identification**: When you add authentication, use `posthog.identify()` to link events to specific users
- **Feature Flags**: Consider using PostHog feature flags for A/B testing new features
- **Session Replay**: Session replay is enabled by default to help debug user issues
