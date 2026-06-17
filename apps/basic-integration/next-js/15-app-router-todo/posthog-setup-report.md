<wizard-report>
# PostHog post-wizard report

The wizard has completed a full integration of PostHog into this Next.js 15 App Router todo application. The following changes were made:

- **`instrumentation-client.ts`** (new): Initialises PostHog client-side using the `instrumentation-client` pattern, the recommended approach for Next.js 15.3+. Enables session replay, automatic exception capture, and event tracking via a reverse proxy.
- **`lib/posthog-server.ts`** (new): Singleton PostHog Node.js client used by API route handlers to capture server-side events.
- **`next.config.ts`** (updated): Added reverse-proxy rewrites routing `/ingest/*` and `/ingest/static/*` and `/ingest/array/*` to PostHog's ingestion and asset hosts, improving ad-blocker resilience.
- **`.env.local`** (new/updated): `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` are set.
- **`components/todos/todo-list.tsx`** (updated): Added `todo_created`, `todo_completed`, `todo_uncompleted`, and `todo_deleted` capture calls after each successful API response, plus `captureException` in each error handler.
- **`app/api/todos/route.ts`** (updated): Added server-side `todo_created` capture after a new todo is persisted.
- **`app/api/todos/[id]/route.ts`** (updated): Added server-side `todo_updated` and `todo_deleted` captures after PATCH and DELETE operations complete.

| Event | Description | File |
|---|---|---|
| `todo_created` | User successfully created a new todo item (client-side, after API success) | `components/todos/todo-list.tsx` |
| `todo_completed` | User marked a todo item as completed by checking the checkbox | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | User unchecked a todo item, marking it as no longer completed | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deleted a todo item (client-side, after API success) | `components/todos/todo-list.tsx` |
| `todo_created` | New todo created via the API (server-side capture) | `app/api/todos/route.ts` |
| `todo_updated` | Todo item updated via the API (server-side capture) | `app/api/todos/[id]/route.ts` |
| `todo_deleted` | Todo item deleted via the API (server-side capture) | `app/api/todos/[id]/route.ts` |

## Next steps

To create an "Analytics basics (wizard)" dashboard in PostHog, visit your [Dashboards page](https://us.posthog.com/project/2/dashboard) and create a new dashboard. Suggested insights to add:

1. **Todo creation trend** — Trends insight on `todo_created` over time. Shows how actively users are adding tasks.
2. **Task completion rate** — Trends insight comparing `todo_completed` vs `todo_created` counts. Key conversion metric.
3. **Todo deletion trend** — Trends insight on `todo_deleted`. Tracks churn (tasks abandoned before completion).
4. **Completion vs deletion breakdown** — Trends insight showing `todo_completed` and `todo_deleted` on the same chart to compare task fate.
5. **Task completion funnel** — Funnel insight with steps `todo_created` → `todo_completed`. Shows what fraction of created todos are completed.

Start building insights here: [New Insight](https://us.posthog.com/project/2/insights/new)

## Verify before merging

- [ ] Run a full production build (`pnpm build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
