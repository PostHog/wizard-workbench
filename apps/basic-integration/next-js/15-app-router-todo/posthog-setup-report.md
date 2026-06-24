<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router todo application. Client-side tracking was added to the `TodoList` component for all user actions (creating, completing, reopening, and deleting todos). Server-side tracking was added to both API route handlers (`/api/todos` and `/api/todos/[id]`) to capture the same critical operations at the server boundary. A reverse proxy was configured in `next.config.ts` to route PostHog requests through the app's own domain. PostHog is initialized in `instrumentation-client.ts` (the recommended approach for Next.js 15.3+), and a shared server-side client lives in `lib/posthog-server.ts`. Exception capture is enabled for client-side error tracking.

| Event name | Description | File |
|---|---|---|
| `todo_created` | Fired when a user successfully creates a new todo item. | `components/todos/todo-list.tsx` |
| `todo_completed` | Fired when a user marks a todo item as completed. | `components/todos/todo-list.tsx` |
| `todo_reopened` | Fired when a user unchecks a completed todo, marking it active again. | `components/todos/todo-list.tsx` |
| `todo_deleted` | Fired when a user deletes a todo item. | `components/todos/todo-list.tsx` |
| `server_todo_created` | Server-side event fired when a new todo is successfully created via the API. | `app/api/todos/route.ts` |
| `server_todo_updated` | Server-side event fired when a todo is successfully updated via the API. | `app/api/todos/[id]/route.ts` |
| `server_todo_deleted` | Server-side event fired when a todo is successfully deleted via the API. | `app/api/todos/[id]/route.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1751155)
- [Todo creation trend](https://us.posthog.com/project/483112/insights/fMYndwHa)
- [Todo completion rate (funnel)](https://us.posthog.com/project/483112/insights/CgvK8FZA)
- [Todo deletion rate](https://us.posthog.com/project/483112/insights/NeTiy7kk)
- [Active vs completed todos](https://us.posthog.com/project/483112/insights/e26Mt8oQ)
- [Server vs client event comparison](https://us.posthog.com/project/483112/insights/vjUGzpKL)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the PostHog env var names (`NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`, `NEXT_PUBLIC_POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
