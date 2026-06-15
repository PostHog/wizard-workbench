# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router todo application. Here is a summary of what was done:

- **`instrumentation-client.ts`** (new): Initializes PostHog client-side using the Next.js 15.3+ instrumentation pattern. Enables automatic exception capture and debug mode in development.
- **`next.config.ts`** (updated): Added reverse proxy rewrites (`/ingest/*` → PostHog) and `skipTrailingSlashRedirect: true` so PostHog requests are routed through the app's own domain, avoiding ad-blocker interference.
- **`lib/posthog-server.ts`** (new): Singleton server-side PostHog client (`posthog-node`) used by API routes.
- **`app/api/todos/route.ts`** (updated): Captures `todo_created` server-side on POST, forwarding the `x-posthog-distinct-id` header from the browser to correlate client and server events.
- **`app/api/todos/[id]/route.ts`** (updated): Captures `todo_updated` server-side on PATCH and `todo_deleted` server-side on DELETE, with the same distinct-ID forwarding.
- **`components/todos/todo-list.tsx`** (updated): Captures `todo_created`, `todo_completed`, `todo_uncompleted`, and `todo_deleted` client-side after confirmed API responses. Also sends `posthog.captureException()` in error paths and forwards the PostHog distinct ID as an `x-posthog-distinct-id` request header to all mutating API calls.
- **`.env.local`** (updated): Set `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`.

| Event | Description | File |
|---|---|---|
| `todo_created` | User created a new todo item (client-side, after successful API response) | `components/todos/todo-list.tsx` |
| `todo_completed` | User marked a todo as done | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | User unchecked a completed todo | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deleted a todo (client-side) | `components/todos/todo-list.tsx` |
| `todo_created` | New todo created via API (server-side) | `app/api/todos/route.ts` |
| `todo_updated` | Todo updated via API — title, description, or completion (server-side) | `app/api/todos/[id]/route.ts` |
| `todo_deleted` | Todo deleted via API (server-side) | `app/api/todos/[id]/route.ts` |

## Next steps

The PostHog MCP API key used during this run did not have the `dashboard:write` or `query:read` scopes required to auto-create a dashboard. You can build one manually in PostHog using the events above. Suggested insights:

- **Todo creation rate** — trend of `todo_created` over time (overall productivity signal)
- **Completion rate** — `todo_completed` events vs `todo_created` (how many todos users actually finish)
- **Deletion rate** — `todo_deleted` vs `todo_created` (tasks abandoned vs completed)
- **Client vs server event volume** — compare `source=api` property to verify both pipelines are firing

[Open PostHog project](https://us.posthog.com/project/2)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify in PostHog Error Tracking.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
