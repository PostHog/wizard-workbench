<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router todo application. PostHog is initialized via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+), with a reverse proxy configured in `next.config.ts` to route all PostHog traffic through `/ingest`. A shared server-side client in `lib/posthog-server.ts` is used by the API routes. Client-side events are captured in `components/todos/todo-list.tsx`, and server-side events are captured in both API route files. The client passes its PostHog distinct ID via the `X-POSTHOG-DISTINCT-ID` header so client and server events can be correlated for the same user session. Exception capture (`posthog.captureException`) is also wired into all client-side error handlers.

| Event Name | Description | File |
|---|---|---|
| `todo_created` | A user successfully creates a new todo item via the form. | `components/todos/todo-list.tsx` |
| `todo_completed` | A user marks a todo as completed by checking its checkbox. | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | A user marks a completed todo as active again by unchecking its checkbox. | `components/todos/todo-list.tsx` |
| `todo_deleted` | A user deletes a todo item using the delete button. | `components/todos/todo-list.tsx` |
| `todo_created` | Server-side confirmation that a new todo was successfully persisted. | `app/api/todos/route.ts` |
| `todo_updated` | Server-side confirmation that a todo was successfully updated. | `app/api/todos/[id]/route.ts` |
| `todo_deleted` | Server-side confirmation that a todo was successfully deleted. | `app/api/todos/[id]/route.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1793492)
- [Todos Created Over Time](https://us.posthog.com/project/483112/insights/9iwELvDO)
- [Todos Completed Over Time](https://us.posthog.com/project/483112/insights/nEZ7pjF3)
- [Todos Deleted Over Time](https://us.posthog.com/project/483112/insights/Cru9KwmZ)
- [Todo Activity Overview](https://us.posthog.com/project/483112/insights/equFvQsI)
- [Todo Completion Rate](https://us.posthog.com/project/483112/insights/HxaELUte)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`, `NEXT_PUBLIC_POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
