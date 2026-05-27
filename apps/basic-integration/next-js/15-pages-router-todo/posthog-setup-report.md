<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 Pages Router todo application. Here is a summary of all changes made:

- **`instrumentation-client.ts`** (new): Initializes posthog-js on the client side using Next.js 15.3+ instrumentation. Configures the reverse proxy (`/ingest`), enables exception capture for error tracking, and uses debug mode in development.
- **`next.config.ts`** (updated): Added rewrite rules to proxy PostHog requests through `/ingest`, routing both `/ingest/static/*` and `/ingest/array/*` to the assets CDN and `/ingest/*` to the ingestion endpoint. Also enabled `skipTrailingSlashRedirect` and `reactStrictMode`.
- **`lib/posthog-server.ts`** (new): Singleton server-side PostHog client using `posthog-node`, configured with `flushAt: 1` and `flushInterval: 0` for immediate event delivery in serverless API routes.
- **`components/todos/todo-list.tsx`** (updated): Added client-side event capture for all todo actions (`todo_created`, `todo_completed`, `todo_uncompleted`, `todo_deleted`). Also passes `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` headers to API calls for client–server correlation, and added `posthog.captureException()` in error handlers.
- **`pages/api/todos/index.ts`** (updated): Added server-side `todo_created` event capture on successful POST, reading the distinct/session IDs from request headers.
- **`pages/api/todos/[id].ts`** (updated): Added server-side `todo_updated` event capture on successful PATCH and `todo_deleted` on successful DELETE, reading the distinct/session IDs from request headers.
- **`.env.local`** (new): Created with `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables.

## Events

| Event name | Description | File |
|---|---|---|
| `todo_created` | Fired when a user successfully creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | Fired when a user marks a todo item as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | Fired when a user marks a completed todo item as active again | `components/todos/todo-list.tsx` |
| `todo_deleted` | Fired when a user deletes a todo item from the list | `components/todos/todo-list.tsx` |
| `todo_created` | Server-side event fired when the API successfully creates a new todo | `pages/api/todos/index.ts` |
| `todo_updated` | Server-side event fired when the API successfully updates an existing todo | `pages/api/todos/[id].ts` |
| `todo_deleted` | Server-side event fired when the API successfully deletes a todo | `pages/api/todos/[id].ts` |

## Next steps

Head to PostHog to explore your data and build insights for the "Analytics basics" dashboard:

- [PostHog Events — verify events are arriving](/events)
- [Create a new dashboard](/dashboard) named "Analytics basics" and add these suggested insights:
  1. **Todo creation trend** — Trends chart of `todo_created` over time
  2. **Todo completion rate** — Trends chart comparing `todo_completed` vs `todo_uncompleted`
  3. **Todo deletion trend** — Trends chart of `todo_deleted` over time
  4. **Create-to-complete funnel** — Funnel from `todo_created` → `todo_completed`
  5. **Todos with descriptions** — Trends chart of `todo_created` filtered by `has_description = true`

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
