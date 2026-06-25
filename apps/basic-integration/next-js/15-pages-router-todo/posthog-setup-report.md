<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js 15 Pages Router todo application. The following changes were made:

- **`instrumentation-client.ts`** (new): Initializes PostHog on the client side using the Next.js instrumentation hook. Configured with a reverse-proxy ingestion path, error tracking (`capture_exceptions`), and debug mode in development.
- **`next.config.ts`**: Added reverse-proxy rewrites so PostHog requests route through `/ingest/*` instead of hitting PostHog directly, improving ad-blocker resilience. Also added `skipTrailingSlashRedirect`.
- **`lib/posthog-server.ts`** (new): Singleton PostHog Node.js client for server-side event capture in API routes.
- **`components/todos/todo-list.tsx`**: Added client-side `posthog.capture()` calls for `todo_created`, `todo_completed`, `todo_uncompleted`, and `todo_deleted` events. Passes the PostHog distinct ID and session ID as request headers to correlate client and server events. Added `captureException` in error handlers.
- **`pages/api/todos/index.ts`**: Added server-side `todo_created` capture on successful POST, reading the distinct ID and session ID from request headers.
- **`pages/api/todos/[id].ts`**: Added server-side `todo_updated` capture on successful PATCH and `todo_deleted` capture on successful DELETE, reading identity headers from the request.
- **`.env.local`**: PostHog public token and host written via the wizard tools (never hardcoded in source).

| Event Name | Description | File |
|---|---|---|
| `todo_created` | User successfully adds a new todo item via the form. | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks a todo item as completed. | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | User marks a completed todo item as incomplete. | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item. | `components/todos/todo-list.tsx` |
| `todo_created` | Server-side: a new todo is successfully created via the API. | `pages/api/todos/index.ts` |
| `todo_updated` | Server-side: a todo is successfully updated via the API. | `pages/api/todos/[id].ts` |
| `todo_deleted` | Server-side: a todo is successfully deleted via the API. | `pages/api/todos/[id].ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) Dashboard](https://us.posthog.com/project/483112/dashboard/1761169)
- [Todos Created Over Time](https://us.posthog.com/project/483112/insights/HjHTEZ46)
- [Todo Completion Rate](https://us.posthog.com/project/483112/insights/mEB5H2eA)
- [Todo Actions Breakdown](https://us.posthog.com/project/483112/insights/TUe3wlSF)
- [Todo Deletion Funnel](https://us.posthog.com/project/483112/insights/6tg1kxGm)
- [Unique Users Taking Todo Actions](https://us.posthog.com/project/483112/insights/eJ9vZqS5)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`, `NEXT_PUBLIC_POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
