<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 Pages Router todo application. PostHog is now initialized client-side via `instrumentation-client.ts`, which runs automatically for all pages. A reverse proxy is configured in `next.config.ts` to route PostHog traffic through `/ingest` (improving ad-blocker resilience). A shared server-side PostHog client is provided in `lib/posthog-server.ts` for use in API routes. All key todo CRUD actions are tracked from both the client and server, giving full visibility into user behaviour.

| Event Name | Description | File |
|---|---|---|
| `todo_created` | User successfully submits a new todo item via the form. | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks an active todo item as completed. | `components/todos/todo-list.tsx` |
| `todo_reopened` | User unchecks a completed todo item, marking it active again. | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item from the list. | `components/todos/todo-list.tsx` |
| `todo_created` | Server-side: a new todo is successfully persisted via the POST API route. | `pages/api/todos/index.ts` |
| `todo_updated` | Server-side: a todo is successfully updated via the PATCH API route. | `pages/api/todos/[id].ts` |
| `todo_deleted` | Server-side: a todo is successfully deleted via the DELETE API route. | `pages/api/todos/[id].ts` |

## Next steps

We've built some insights and added them to your dashboard to track todo user behaviour:

- [Dashboard: Your starter dashboard](https://us.posthog.com/project/483112/dashboard/1751155)
- [Todos Created Over Time](https://us.posthog.com/project/483112/insights/vlKV0ew6)
- [Todo Completion Funnel](https://us.posthog.com/project/483112/insights/VxSL3srV)
- [Todos Deleted Over Time](https://us.posthog.com/project/483112/insights/o49kHsSQ)
- [Active vs Completed Todos](https://us.posthog.com/project/483112/insights/nsXMkC0v)
- [Todo Actions Breakdown](https://us.posthog.com/project/483112/insights/BlN3EiE5)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`, `NEXT_PUBLIC_POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
