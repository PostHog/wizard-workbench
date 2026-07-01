# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router todo application. The following changes were made:

- **`instrumentation-client.ts`** (new): Initializes PostHog on the client side using the `instrumentation-client.ts` pattern recommended for Next.js 15.3+. Configured with a reverse proxy at `/ingest`, exception capture, and debug mode in development.
- **`next.config.ts`**: Added reverse proxy rewrites for `/ingest/static/*`, `/ingest/array/*`, and `/ingest/*` to route PostHog requests through the Next.js server, avoiding ad blockers.
- **`lib/posthog-server.ts`** (new): Singleton server-side PostHog client using `posthog-node` for tracking events from API routes.
- **`components/todos/todo-list.tsx`**: Added `posthog.capture()` calls for `todo_created`, `todo_completed`, `todo_reopened`, and `todo_deleted` events in each action handler. Added `posthog.captureException()` in catch blocks for error tracking.
- **`app/api/todos/route.ts`**: Added server-side `todo_created` event capture on successful POST.
- **`app/api/todos/[id]/route.ts`**: Added server-side `todo_updated` event capture on successful PATCH, and `todo_deleted` on successful DELETE.
- **`.env.local`** (new): Created with `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`.

## Events

| Event Name | Description | File |
|---|---|---|
| `todo_created` | Fired when the user successfully adds a new todo item. | `components/todos/todo-list.tsx` |
| `todo_completed` | Fired when the user marks a todo item as completed. | `components/todos/todo-list.tsx` |
| `todo_reopened` | Fired when the user unchecks a completed todo item. | `components/todos/todo-list.tsx` |
| `todo_deleted` | Fired when the user deletes a todo item. | `components/todos/todo-list.tsx` |
| `todo_created` | Server-side event fired when a new todo is successfully created via the API. | `app/api/todos/route.ts` |
| `todo_updated` | Server-side event fired when a todo is updated via the API. | `app/api/todos/[id]/route.ts` |
| `todo_deleted` | Server-side event fired when a todo is deleted via the API. | `app/api/todos/[id]/route.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1787404)
- [Total todos created over time](https://us.posthog.com/project/483112/insights/gVBDrSPe)
- [Completion rate funnel](https://us.posthog.com/project/483112/insights/mLyCiEX5)
- [Todo lifecycle actions breakdown](https://us.posthog.com/project/483112/insights/cuyWIQRZ)
- [Daily active todo users](https://us.posthog.com/project/483112/insights/3IxRb9uF)
- [Todo deletion rate](https://us.posthog.com/project/483112/insights/lZckVYPV)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
