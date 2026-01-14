<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js 15 Pages Router todo application. The integration includes:

- **Client-side initialization** via `instrumentation-client.ts` using the modern Next.js 15.3+ approach
- **Reverse proxy configuration** in `next.config.ts` to improve tracking reliability and avoid ad blockers
- **Event tracking** for all core user actions in the todo application
- **Error tracking** with `posthog.captureException()` for API failures
- **Environment variables** configured in `.env.local` for secure API key management

## Events Implemented

| Event Name | Description | File |
|------------|-------------|------|
| `todo created` | User creates a new todo item - key engagement metric | `components/todos/todo-list.tsx` |
| `todo completed` | User marks a todo as complete - success/productivity metric | `components/todos/todo-list.tsx` |
| `todo uncompleted` | User marks a completed todo as incomplete - tracks task re-opening | `components/todos/todo-list.tsx` |
| `todo deleted` | User deletes a todo item - potential churn indicator | `components/todos/todo-list.tsx` |

## Files Modified/Created

| File | Change |
|------|--------|
| `instrumentation-client.ts` | Created - PostHog client initialization |
| `next.config.ts` | Modified - Added reverse proxy rewrites |
| `components/todos/todo-list.tsx` | Modified - Added event tracking and error capture |
| `.env.local` | Created - Environment variables for PostHog |

## Next steps

To create an "Analytics basics" dashboard in PostHog with insights based on these events:

1. Go to your [PostHog dashboard](https://us.posthog.com)
2. Create a new dashboard named "Analytics basics"
3. Add the following insights:
   - **Todo Creation Trend** - Track `todo created` events over time
   - **Task Completion Rate** - Funnel from `todo created` to `todo completed`
   - **Todo Deletion Trend** - Track `todo deleted` events (churn indicator)
   - **Active vs Completed Ratio** - Compare `todo completed` vs `todo uncompleted` events
   - **Error Rate** - Track exception events for monitoring app health

### Suggested Insights to Create

1. **Engagement Funnel**: `todo created` → `todo completed`
2. **Daily Active Users**: Unique users triggering any todo event
3. **Completion Rate**: Percentage of created todos that get completed
4. **Deletion Analysis**: `todo deleted` by `was_completed` property
5. **Error Monitoring**: Exception events trend

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This context will help you prevent the model from using out-of-date approaches to the PostHog integration.

</wizard-report>
