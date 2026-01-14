# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js Pages Router todo application. The integration includes:

- **Client-side initialization** via `instrumentation-client.ts` using the modern Next.js 15.3+ approach
- **Server-side tracking** with a reusable PostHog Node.js client in `lib/posthog-server.ts`
- **Reverse proxy configuration** in `next.config.ts` to improve tracking reliability and avoid ad blockers
- **Automatic exception capture** enabled for error tracking
- **Environment variables** configured in `.env.local` for secure credential management

## Events Implemented

| Event Name | Description | File |
|------------|-------------|------|
| `todo created` | User creates a new todo item - key conversion event for task management engagement | `components/todos/todo-list.tsx` |
| `todo completed` | User marks a todo as completed - indicates successful task completion and engagement | `components/todos/todo-list.tsx` |
| `todo uncompleted` | User marks a completed todo as incomplete - indicates re-engagement with task | `components/todos/todo-list.tsx` |
| `todo deleted` | User deletes a todo item - tracks task removal behavior | `components/todos/todo-list.tsx` |
| `api error` | Server-side API error occurred - tracks error rates and types for reliability monitoring | `pages/api/todos/index.ts`, `pages/api/todos/[id].ts` |

## Files Created/Modified

### New Files
- `instrumentation-client.ts` - Client-side PostHog initialization
- `lib/posthog-server.ts` - Server-side PostHog client singleton
- `.env.local` - Environment variables for PostHog configuration

### Modified Files
- `next.config.ts` - Added reverse proxy rewrites for PostHog ingestion
- `components/todos/todo-list.tsx` - Added client-side event tracking for todo actions
- `pages/api/todos/index.ts` - Added server-side error tracking
- `pages/api/todos/[id].ts` - Added server-side error tracking

## Next steps

### Recommended Insights to Create

Based on the events instrumented, we recommend creating the following insights in your PostHog dashboard:

1. **Todo Creation Trend** - Track daily/weekly todo creations to understand user engagement
2. **Task Completion Funnel** - `todo created` → `todo completed` to measure task completion rates
3. **Task Lifecycle Analysis** - Track the flow from creation to completion or deletion
4. **API Error Rate** - Monitor server-side errors to ensure reliability
5. **User Retention** - Track returning users based on todo interactions

### Creating Your Dashboard

1. Log in to [PostHog](https://us.posthog.com)
2. Navigate to Dashboards → New Dashboard
3. Name it "Todo App Analytics"
4. Add insights using the events listed above

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This context will help you prevent the model from using out-of-date approaches to the PostHog integration.

## Environment Variables

Make sure to set these environment variables in your production environment:

```
NEXT_PUBLIC_POSTHOG_KEY=<your-posthog-project-api-key>
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```
