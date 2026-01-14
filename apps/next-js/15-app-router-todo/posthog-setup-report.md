# PostHog post-wizard report

The wizard has completed a deep integration of your Next.js 15 Todo application with PostHog analytics. The integration includes:

- **Client-side initialization** via `instrumentation-client.ts` (recommended for Next.js 15.3+)
- **Server-side PostHog client** for potential future API route tracking
- **Reverse proxy configuration** through Next.js rewrites to avoid ad blockers
- **Automatic exception tracking** enabled via `capture_exceptions: true`
- **Environment variables** for secure API key management

## Events Implemented

| Event Name | Description | File Path |
|------------|-------------|-----------|
| `todo_created` | User successfully created a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | User marked a todo item as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | User marked a completed todo item as incomplete | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deleted a todo item | `components/todos/todo-list.tsx` |
| `todo_form_submitted` | User submitted the add todo form | `components/todos/todo-form.tsx` |
| `about_page_link_clicked` | User clicked the link to navigate to the about page | `components/todos/todo-list.tsx` |
| `back_to_todos_clicked` | User clicked the back to todos link from about page | `app/about/page.tsx` |
| `api_error_occurred` | An API error occurred during todo operations | `components/todos/todo-list.tsx` |

## Files Created/Modified

### New Files
- `.env` - Environment variables for PostHog configuration
- `instrumentation-client.ts` - Client-side PostHog initialization
- `lib/posthog-server.ts` - Server-side PostHog client
- `components/tracked-link.tsx` - Reusable tracked link component

### Modified Files
- `next.config.ts` - Added reverse proxy rewrites for PostHog
- `components/todos/todo-list.tsx` - Added event tracking for CRUD operations
- `components/todos/todo-form.tsx` - Added form submission tracking
- `app/about/page.tsx` - Added tracked link for navigation

## Next steps

To view your analytics data and create insights:

1. **Dashboard**: Visit [PostHog Dashboard](https://us.posthog.com/project/dashboards) to create a new dashboard
2. **Events**: View captured events at [PostHog Events](https://us.posthog.com/events)

### Recommended Insights to Create

1. **Todo Completion Funnel**: `todo_form_submitted` → `todo_created` → `todo_completed`
2. **Todo Activity Trends**: Track `todo_created`, `todo_completed`, `todo_deleted` over time
3. **User Engagement**: Track navigation events (`about_page_link_clicked`, `back_to_todos_clicked`)
4. **Error Monitoring**: Track `api_error_occurred` events to monitor application health
5. **Completion Rate**: Ratio of `todo_completed` to `todo_created` events

### Environment Variables

Make sure these are set in your `.env` file:
```
NEXT_PUBLIC_POSTHOG_KEY=sTMFPsFhdP1Ssg
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

### Agent skill

We've configured PostHog using the `instrumentation-client.ts` approach, which is the recommended method for Next.js 15.3+ applications. This context will help you prevent the model from using out-of-date approaches to the PostHog integration.

Key points for future development:
- Use `posthog.capture()` for client-side event tracking
- Use `posthog.captureException()` for error tracking
- Use `getPostHogClient()` from `lib/posthog-server.ts` for server-side tracking
- Never use `PostHogProvider` or other initialization approaches - use `instrumentation-client.ts` only
