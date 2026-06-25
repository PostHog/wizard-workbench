<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router todo application. The following changes were made:

- **`instrumentation-client.ts`** (new): Initializes PostHog on the client using the Next.js 15.3+ `instrumentation-client.ts` pattern. Configures a reverse proxy via `/ingest`, enables exception capture, and sets debug mode in development.
- **`next.config.ts`** (updated): Added `rewrites()` to proxy PostHog requests through `/ingest` (for both static assets and the ingestion API) and set `skipTrailingSlashRedirect: true`.
- **`lib/posthog-server.ts`** (new): Singleton `posthog-node` client for server-side event capture in API routes.
- **`components/todos/todo-list.tsx`** (updated): Added four client-side `posthog.capture()` calls in the todo mutation handlers, plus `captureException` on error paths. Also passes the client distinct ID to relevant API calls via the `X-POSTHOG-DISTINCT-ID` header.
- **`app/api/todos/route.ts`** (updated): Added a server-side `todo_created` event using `posthog-node` after a todo is successfully persisted.
- **`app/api/todos/[id]/route.ts`** (updated): Added a server-side `todo_deleted` event using `posthog-node` after a todo is successfully removed.
- **`.env.local`** (updated): Added `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables.

| Event Name | Description | File |
|---|---|---|
| `todo_created` | Fired on the client when a user successfully adds a new todo item. | `components/todos/todo-list.tsx` |
| `todo_completed` | Fired on the client when a user marks an active todo as completed. | `components/todos/todo-list.tsx` |
| `todo_reopened` | Fired on the client when a user marks a completed todo as active again. | `components/todos/todo-list.tsx` |
| `todo_deleted` | Fired on the client when a user deletes a todo item. | `components/todos/todo-list.tsx` |
| `todo_created` | Server-side event confirming a todo was successfully persisted via the API. | `app/api/todos/route.ts` |
| `todo_deleted` | Server-side event confirming a todo was successfully deleted via the API. | `app/api/todos/[id]/route.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) Dashboard](https://us.posthog.com/project/483112/dashboard/1761154)
- [Todos Created Over Time](https://us.posthog.com/project/483112/insights/LfYUdr7n)
- [Todos Completed Over Time](https://us.posthog.com/project/483112/insights/JoS1YMHK)
- [Todos Deleted Over Time](https://us.posthog.com/project/483112/insights/0FWfd8qP)
- [Todo Completion Funnel](https://us.posthog.com/project/483112/insights/GEULS6LA)
- [Completion vs Reopened Rate](https://us.posthog.com/project/483112/insights/URzSmwT1)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
