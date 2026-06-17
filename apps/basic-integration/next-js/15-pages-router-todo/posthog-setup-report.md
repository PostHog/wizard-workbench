# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router todo application. The following changes were made:

- **`instrumentation-client.ts`** (new) — initializes `posthog-js` on the client via Next.js 15.3+ instrumentation support, using the `/ingest` reverse proxy, with error tracking (`capture_exceptions`) enabled.
- **`lib/posthog-server.ts`** (new) — singleton `posthog-node` client used by API routes for server-side event capture.
- **`next.config.ts`** — added reverse proxy rewrites so PostHog requests are tunnelled through `/ingest/*`, avoiding ad-blocker interference.
- **`components/todos/todo-list.tsx`** — added `posthog.capture()` calls in the `handleAddTodo`, `handleToggleTodo`, and `handleDeleteTodo` handlers; added `posthog.captureException()` in error catch blocks.
- **`pages/api/todos/index.ts`** — added server-side `server_todo_created` capture on successful POST.
- **`pages/api/todos/[id].ts`** — added server-side `server_todo_updated` capture on successful PATCH and `server_todo_deleted` capture on successful DELETE.
- **`.env.local`** — created with `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`.

## Events

| Event | Description | File |
|---|---|---|
| `todo_created` | User submits the form to add a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | User checks a todo item's checkbox to mark it as complete | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | User unchecks a todo item's checkbox to mark it as incomplete | `components/todos/todo-list.tsx` |
| `todo_deleted` | User clicks the delete button to remove a todo item | `components/todos/todo-list.tsx` |
| `server_todo_created` | Server-side capture when a new todo is successfully created via the API | `pages/api/todos/index.ts` |
| `server_todo_updated` | Server-side capture when a todo is updated via the API | `pages/api/todos/[id].ts` |
| `server_todo_deleted` | Server-side capture when a todo is deleted via the API | `pages/api/todos/[id].ts` |

## Next steps

A PostHog dashboard could not be created automatically because the API key used by the MCP is missing the `dashboard:write` and `query:read` scopes. To create the dashboard manually, open your [PostHog project](https://us.posthog.com/project/2) and build insights for:

1. **Todo creation trend** — `todo_created` events over time
2. **Todo completion rate** — `todo_completed` vs `todo_uncompleted` over time
3. **Todo deletion trend** — `todo_deleted` events, broken down by `was_completed`
4. **Todo creation funnel** — `todo_created` → `todo_completed` (conversion from created to completed)
5. **Error rate** — exceptions captured by PostHog error tracking

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
