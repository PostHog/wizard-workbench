<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router todo application. Here is a summary of what was added:

- **`instrumentation-client.ts`** — Created to initialize PostHog on the client side using the `posthog-js` SDK. This file uses Next.js 15.3+ instrumentation hooks (the recommended pattern) so no custom provider component is needed. The reverse proxy (`/ingest`) is configured, and exception capture (Error Tracking) is enabled.
- **`next.config.ts`** — Added `rewrites` to proxy PostHog requests through `/ingest/*` and set `skipTrailingSlashRedirect: true` as required by PostHog.
- **`lib/posthog-server.ts`** — Created a singleton server-side PostHog client using `posthog-node` for use in API routes.
- **`components/todos/todo-list.tsx`** — Added `posthog.capture()` calls for `todo_created`, `todo_completed`, `todo_uncompleted`, and `todo_deleted` events, along with `posthog.captureException()` in all catch blocks.
- **`app/api/todos/route.ts`** — Added server-side `todo_created` event capture via `posthog-node` when a todo is successfully created.
- **`app/api/todos/[id]/route.ts`** — Added server-side `todo_updated` and `todo_deleted` event capture when a todo is updated or deleted.

| Event Name | Description | File |
|---|---|---|
| `todo_created` | Fired when a user successfully creates a new todo item. | `components/todos/todo-list.tsx` |
| `todo_completed` | Fired when a user marks a todo item as completed. | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | Fired when a user marks a completed todo item as incomplete. | `components/todos/todo-list.tsx` |
| `todo_deleted` | Fired when a user deletes a todo item. | `components/todos/todo-list.tsx` |
| `todo_created` | Server-side event fired when a new todo is persisted via the API. | `app/api/todos/route.ts` |
| `todo_updated` | Server-side event fired when a todo's fields are updated via the API. | `app/api/todos/[id]/route.ts` |
| `todo_deleted` | Server-side event fired when a todo is deleted via the API. | `app/api/todos/[id]/route.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics (wizard)](https://us.posthog.com/project/228144/dashboard/1792830)
- **Insight**: [Todo Creations Over Time](https://us.posthog.com/project/228144/insights/oOIKEcmz)
- **Insight**: [Todo Completions Over Time](https://us.posthog.com/project/228144/insights/n9aRXOyM)
- **Insight**: [Todo Completion Funnel](https://us.posthog.com/project/228144/insights/rcJHHFYP)
- **Insight**: [Todo Deletions Over Time](https://us.posthog.com/project/228144/insights/wvrzJxMI)
- **Insight**: [Active vs Completed Todos (Last 30 Days)](https://us.posthog.com/project/228144/insights/Amr5Lkhd)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
