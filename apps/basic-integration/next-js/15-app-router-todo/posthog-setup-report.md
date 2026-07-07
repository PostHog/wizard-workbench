<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 App Router todo application. The following changes were made:

- **`instrumentation-client.ts`** (new): Initialises `posthog-js` client-side via Next.js's instrumentation hook. Uses a reverse proxy (`/ingest`) to avoid ad-blockers, enables exception autocapture, and turns on debug mode in development.
- **`next.config.ts`**: Added `/ingest/static/*`, `/ingest/array/*`, and `/ingest/*` rewrites pointing to PostHog's US ingestion endpoints, plus `skipTrailingSlashRedirect: true`.
- **`lib/posthog-server.ts`** (new): Singleton `posthog-node` client for server-side event capture, with `flushAt: 1` / `flushInterval: 0` for reliable event delivery in Next.js API routes.
- **`components/todos/todo-list.tsx`**: Added four client-side `posthog.capture()` calls and three `posthog.captureException()` error-tracking calls. PostHog's distinct ID and session ID are forwarded to API routes via `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` headers to correlate client and server events.
- **`app/api/todos/route.ts`**: Added `server_todo_created` event capture via `posthog-node`.
- **`app/api/todos/[id]/route.ts`**: Added `server_todo_updated` and `server_todo_deleted` event captures via `posthog-node`.
- **`.env.local`**: Created with `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`.

| Event name | Description | File |
|---|---|---|
| `todo_created` | Fired when a user successfully creates a new todo item. | `components/todos/todo-list.tsx` |
| `todo_completed` | Fired when a user marks a todo item as completed. | `components/todos/todo-list.tsx` |
| `todo_reopened` | Fired when a user unchecks a completed todo, marking it active again. | `components/todos/todo-list.tsx` |
| `todo_deleted` | Fired when a user deletes a todo item. | `components/todos/todo-list.tsx` |
| `server_todo_created` | Server-side event fired when a todo is successfully created via the API. | `app/api/todos/route.ts` |
| `server_todo_updated` | Server-side event fired when a todo is successfully updated via the API. | `app/api/todos/[id]/route.ts` |
| `server_todo_deleted` | Server-side event fired when a todo is successfully deleted via the API. | `app/api/todos/[id]/route.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1811313)
- [Todo actions over time](https://us.posthog.com/project/483112/insights/xE1deUK3)
- [Todo creation to completion funnel](https://us.posthog.com/project/483112/insights/A6IjWvVM)
- [Todos deleted (completed vs active)](https://us.posthog.com/project/483112/insights/OUSoflMP)
- [Todo completion stickiness](https://us.posthog.com/project/483112/insights/gkLyi9n9)
- [Todos with description vs without](https://us.posthog.com/project/483112/insights/x28lGclU)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
