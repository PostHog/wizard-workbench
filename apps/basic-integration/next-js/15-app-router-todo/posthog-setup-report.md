<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router todo application. Here's what was added:

- **`instrumentation-client.ts`** — Initialises PostHog on the client side using the recommended Next.js 15.3+ pattern. Includes error tracking via `capture_exceptions: true` and a reverse-proxy `api_host`.
- **`next.config.ts`** — Configured reverse-proxy rewrites so all PostHog requests are sent through `/ingest/*`, avoiding ad-blocker interference.
- **`lib/posthog-server.ts`** — A singleton server-side PostHog client (`posthog-node`) used by API routes.
- **`app/api/todos/route.ts`** — Captures `server_todo_created` on every successful POST, forwarding the client's distinct ID via the `x-posthog-distinct-id` header.
- **`app/api/todos/[id]/route.ts`** — Captures `server_todo_updated` and `server_todo_deleted` on successful PATCH/DELETE requests, also forwarding the distinct ID.
- **`components/todos/todo-list.tsx`** — Captures `todo_created`, `todo_completed`, `todo_reopened`, and `todo_deleted` client-side after successful API responses. Also sends the PostHog distinct ID in all API request headers so client and server events are correlated under the same person. `captureException` is called in all error catch blocks.
- **`.env.local`** — `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` written (and covered by `.gitignore`).

| Event name | Description | File |
|---|---|---|
| `todo_created` | User creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks a todo as completed | `components/todos/todo-list.tsx` |
| `todo_reopened` | User unchecks a completed todo | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item | `components/todos/todo-list.tsx` |
| `server_todo_created` | Server confirms a new todo was persisted | `app/api/todos/route.ts` |
| `server_todo_updated` | Server confirms a todo update | `app/api/todos/[id]/route.ts` |
| `server_todo_deleted` | Server confirms a todo deletion | `app/api/todos/[id]/route.ts` |

## Next steps

Create the **"Analytics basics (wizard)"** dashboard in PostHog and add insights for the events above. The wizard was unable to create the dashboard automatically because the connected API key is missing the `dashboard:write`, `insight:write`, and `query:read` scopes.

- [Create a new dashboard](https://us.posthog.com/project/2/dashboard)
- [Create a new insight](https://us.posthog.com/project/2/insights/new)

Suggested insights to add to the dashboard:
1. **Todo creation trend** — Trends chart of `todo_created` over time
2. **Task completion rate** — Funnel from `todo_created` → `todo_completed`
3. **Todo deletions** — Trends chart of `todo_deleted` over time (churn signal)
4. **Completion vs reopened** — Trends chart comparing `todo_completed` and `todo_reopened`
5. **Server vs client event parity** — Trends chart comparing `todo_created` and `server_todo_created` to detect any client/server discrepancies

## Verify before merging

- [ ] Run a full production build (`pnpm build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` (or your team's bootstrap script) so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify in PostHog Error Tracking.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
