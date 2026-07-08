<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router todo application. PostHog is initialized client-side via `instrumentation-client.ts` using a reverse proxy through `/ingest` (configured in `next.config.ts`). A server-side singleton client in `lib/posthog-server.ts` covers API route tracking. Client-side events are captured in `components/todos/todo-list.tsx` for all core todo actions, while server-side events are captured in both API route handlers. Error tracking via `captureException` is wired into all client-side error paths.

| Event name | Description | File |
|---|---|---|
| `todo_created` | User successfully adds a new todo item via the form. | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks a todo item as completed by toggling its checkbox. | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | User unchecks a completed todo item, marking it as active again. | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item from the list. | `components/todos/todo-list.tsx` |
| `server_todo_created` | Server confirms successful creation of a new todo via the POST API route. | `pages/api/todos/index.ts` |
| `server_todo_updated` | Server confirms a todo was updated (toggled or edited) via the PATCH API route. | `pages/api/todos/[id].ts` |
| `server_todo_deleted` | Server confirms a todo was deleted via the DELETE API route. | `pages/api/todos/[id].ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1818200)
- [Todo actions over time](https://us.posthog.com/project/483112/insights/VVj0lKQE) — Line chart of created, completed, and deleted todos per day
- [Todo completion funnel](https://us.posthog.com/project/483112/insights/vbt4Rf6f) — Funnel from `todo_created` → `todo_completed`
- [Todos created with description](https://us.posthog.com/project/483112/insights/ZuON5uaU) — Bar chart breaking down creation by whether a description was included
- [Todo deletion: completed vs active](https://us.posthog.com/project/483112/insights/bIBunrQM) — Bar chart showing whether deleted todos were already done
- [Todo churn: deleted without completing](https://us.posthog.com/project/483112/insights/cSr0uekr) — Weekly stacked bar of created vs completed vs deleted todos

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
