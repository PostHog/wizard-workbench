<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router todo application. The following changes were made:

- **`instrumentation-client.ts`** (new): Initializes the PostHog JS SDK client-side using the Next.js 15.3+ instrumentation hook. Configures a reverse proxy (`/ingest`), exception capture, and debug mode in development.
- **`next.config.ts`** (updated): Added reverse-proxy rewrites for `/ingest/*` → PostHog ingestion endpoints, along with `skipTrailingSlashRedirect: true`.
- **`lib/posthog-server.ts`** (new): Singleton server-side PostHog Node.js client used by API routes.
- **`components/todos/todo-list.tsx`** (updated): Added client-side `posthog.capture()` calls for `todo_created`, `todo_completed`, `todo_reopened`, and `todo_deleted` events, plus `posthog.captureException()` in error handlers.
- **`pages/api/todos/index.ts`** (updated): Added server-side `todo_created` event after a todo is successfully created via POST.
- **`pages/api/todos/[id].ts`** (updated): Added server-side `todo_updated` event after a PATCH and `todo_deleted` event after a DELETE.
- **`.env.local`** (updated): Added `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`.

| Event Name | Description | File |
|---|---|---|
| `todo_created` | Fired when the user successfully creates a new todo item. | `components/todos/todo-list.tsx` |
| `todo_completed` | Fired when the user marks an active todo as completed. | `components/todos/todo-list.tsx` |
| `todo_reopened` | Fired when the user unchecks a completed todo to mark it active again. | `components/todos/todo-list.tsx` |
| `todo_deleted` | Fired when the user deletes a todo item. | `components/todos/todo-list.tsx` |
| `todo_created` | Server-side event fired when a new todo is created via the API. | `pages/api/todos/index.ts` |
| `todo_updated` | Server-side event fired when a todo is updated via the API. | `pages/api/todos/[id].ts` |
| `todo_deleted` | Server-side event fired when a todo is deleted via the API. | `pages/api/todos/[id].ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.i.posthog.com/project/483112/dashboard/1760658)
- [Todo creation trend over time](https://us.i.posthog.com/project/483112/insights/DvFo7fkG)
- [Todo completion rate funnel](https://us.i.posthog.com/project/483112/insights/RAGs4WTM)
- [Todo deletion trend](https://us.i.posthog.com/project/483112/insights/xJOIcoKy)
- [Completion vs Reopened comparison](https://us.i.posthog.com/project/483112/insights/vdZB3wMJ)
- [Active todo actions breakdown](https://us.i.posthog.com/project/483112/insights/jOE9L8ue)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`, `NEXT_PUBLIC_POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
