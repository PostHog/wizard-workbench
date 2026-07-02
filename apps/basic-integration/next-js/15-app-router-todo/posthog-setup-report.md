<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js 15 App Router todo application. The following changes were made:

- **`instrumentation-client.ts`** (new): Initializes PostHog on the client side using the Next.js 15.3+ instrumentation approach. Includes error tracking via `capture_exceptions: true` and reverse-proxy routing through `/ingest`.
- **`next.config.ts`** (updated): Added reverse-proxy rewrites to route PostHog requests through `/ingest`, including `/ingest/static/*` and `/ingest/array/*` for asset delivery.
- **`lib/posthog-server.ts`** (new): Singleton PostHog Node.js client for server-side event capture in API routes.
- **`components/todos/todo-list.tsx`** (updated): Added `todo_created`, `todo_toggled`, and `todo_deleted` client-side events with relevant properties. Passes `x-posthog-distinct-id` and `x-posthog-session-id` headers on API calls to correlate client and server events. Added `captureException` calls in error handlers.
- **`app/api/todos/route.ts`** (updated): Added `server_todo_created` server-side event on successful POST, using the distinct ID forwarded from the client header.
- **`app/api/todos/[id]/route.ts`** (updated): Added `server_todo_updated` and `server_todo_deleted` server-side events on successful PATCH and DELETE respectively.
- **`.env.local`** (new): Created with `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables.

| Event name | Description | File |
|---|---|---|
| `todo_created` | Fired when a user submits a new todo item via the form. | `components/todos/todo-list.tsx` |
| `todo_toggled` | Fired when a user checks or unchecks a todo item to change its completion status. | `components/todos/todo-list.tsx` |
| `todo_deleted` | Fired when a user deletes a todo item. | `components/todos/todo-list.tsx` |
| `server_todo_created` | Server-side event fired when a new todo is successfully created via the API. | `app/api/todos/route.ts` |
| `server_todo_updated` | Server-side event fired when a todo is successfully updated via the API. | `app/api/todos/[id]/route.ts` |
| `server_todo_deleted` | Server-side event fired when a todo is successfully deleted via the API. | `app/api/todos/[id]/route.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.i.posthog.com/project/483112/dashboard/1792402)
- [Daily todo creation trend](https://us.i.posthog.com/project/483112/insights/9gixmy4u)
- [Todo engagement overview](https://us.i.posthog.com/project/483112/insights/7WE9xEeD)
- [Active users creating todos](https://us.i.posthog.com/project/483112/insights/XXwFu9ut)
- [Todo deletion trend](https://us.i.posthog.com/project/483112/insights/mPmS7r8j)
- [Server-side todo events](https://us.i.posthog.com/project/483112/insights/2FlB6lrw)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`, `NEXT_PUBLIC_POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
