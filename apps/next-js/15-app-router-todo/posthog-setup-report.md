# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js 15 App Router todo application. The integration includes both client-side and server-side event tracking using `posthog-js` and `posthog-node` respectively. Client-side initialization uses the recommended `instrumentation-client.ts` approach for Next.js 15.3+, with a reverse proxy configuration to improve tracking reliability by routing requests through your domain.

## Events Added

| Event Name | Description | File Path |
|------------|-------------|-----------|
| `todo_created` | Server-side event captured when a new todo item is created | `app/api/todos/route.ts` |
| `todo_completed` | Server-side event captured when a todo is marked as completed | `app/api/todos/[id]/route.ts` |
| `todo_uncompleted` | Server-side event captured when a todo is marked as uncompleted | `app/api/todos/[id]/route.ts` |
| `todo_deleted` | Server-side event captured when a todo item is deleted | `app/api/todos/[id]/route.ts` |
| `todo_add_button_clicked` | Client-side event captured when user clicks the Add Todo button | `components/todos/todo-form.tsx` |
| `todo_delete_button_clicked` | Client-side event captured when user clicks a delete button | `components/todos/todo-item.tsx` |
| `todo_toggle_clicked` | Client-side event captured when user clicks the checkbox to toggle completion | `components/todos/todo-item.tsx` |
| `about_page_link_clicked` | Client-side event captured when user clicks the About link | `components/todos/todo-list.tsx` |
| `back_to_todos_clicked` | Client-side event captured when user clicks Back to Todos from About page | `app/about/page.tsx` |

## Files Modified/Created

- **`instrumentation-client.ts`** - New file for client-side PostHog initialization
- **`lib/posthog-server.ts`** - New file for server-side PostHog client
- **`next.config.ts`** - Updated with reverse proxy rewrites for PostHog
- **`.env`** - Environment variables for PostHog configuration
- **`app/api/todos/route.ts`** - Added server-side event tracking
- **`app/api/todos/[id]/route.ts`** - Added server-side event tracking
- **`components/todos/todo-form.tsx`** - Added client-side event tracking
- **`components/todos/todo-item.tsx`** - Added client-side event tracking
- **`components/todos/todo-list.tsx`** - Added client-side event tracking
- **`app/about/page.tsx`** - Added client-side event tracking

## Configuration

Environment variables are set up in `.env`:
- `NEXT_PUBLIC_POSTHOG_KEY` - Your PostHog project API key
- `NEXT_PUBLIC_POSTHOG_HOST` - PostHog host URL

## Next steps

We recommend creating a dashboard in PostHog to track user behavior based on the events we just instrumented. Here are some suggested insights:

1. **Todo Creation Funnel** - Track from `todo_add_button_clicked` to `todo_created`
2. **Task Completion Rate** - Compare `todo_completed` vs `todo_created` events
3. **User Engagement** - Track `todo_toggle_clicked` and `todo_delete_button_clicked` events over time
4. **Navigation Patterns** - Track `about_page_link_clicked` and `back_to_todos_clicked` events

Visit your PostHog dashboard at: https://us.posthog.com

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
