<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 Pages Router todo application. The following changes were made:

- **`instrumentation-client.ts`** (new): Initializes the PostHog client-side SDK using the `instrumentation-client.ts` pattern recommended for Next.js 15.3+. Configured with a reverse proxy (`/ingest`) for reliable event delivery, exception capture for error tracking, and debug mode in development.
- **`next.config.ts`** (updated): Added PostHog reverse proxy rewrites for `/ingest/*`, `/ingest/static/*`, and `/ingest/array/*` routes, plus `skipTrailingSlashRedirect: true`.
- **`lib/posthog-server.ts`** (new): Singleton server-side PostHog client using `posthog-node` for API route event tracking, with `flushAt: 1` and `flushInterval: 0` for immediate delivery in serverless environments.
- **`components/todos/todo-list.tsx`** (updated): Added client-side `posthog.capture()` calls for all core todo actions. Passes PostHog `distinct_id` and `session_id` as request headers to enable correlation with server-side events. Also added `posthog.captureException()` in each error catch block.
- **`pages/api/todos/index.ts`** (updated): Added server-side `todo_created` event in the POST handler, using the distinct ID and session ID forwarded from the client.
- **`pages/api/todos/[id].ts`** (updated): Added server-side `todo_deleted` event in the DELETE handler, using the same header-forwarding pattern.
- **`.env.local`**: Created with `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` set to the correct values.

| Event | Description | File |
|---|---|---|
| `todo_created` | Fired client-side when a new todo is successfully created | `components/todos/todo-list.tsx` |
| `todo_completed` | Fired client-side when a todo is marked as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | Fired client-side when a todo is marked as incomplete | `components/todos/todo-list.tsx` |
| `todo_deleted` | Fired client-side when a todo is deleted | `components/todos/todo-list.tsx` |
| `todo_created` | Fired server-side on POST /api/todos with `source: 'server'` | `pages/api/todos/index.ts` |
| `todo_deleted` | Fired server-side on DELETE /api/todos/[id] with `source: 'server'` | `pages/api/todos/[id].ts` |

## Next steps

We weren't able to automatically create a PostHog dashboard because the API key used is missing the required `dashboard:write` and `insight:write` scopes. Create a **"Analytics basics (wizard)"** dashboard manually in PostHog with these suggested insights:

- [PostHog Dashboards](https://us.posthog.com/project/2/dashboards) — create a new dashboard named **"Analytics basics (wizard)"**

Suggested insights to add:

1. **Todos created over time** — Trends chart for the `todo_created` event (client-side)
2. **Todos deleted over time** — Trends chart for the `todo_deleted` event (client-side)
3. **Todo completion funnel** — Funnel: `todo_created` → `todo_completed` (measures what % of created todos get completed)
4. **Todo completion rate** — Trends: ratio of `todo_completed` vs `todo_created` using a formula insight
5. **Errors captured** — Trends chart for `$exception` events from error tracking

## Verify before merging

- [ ] Run a full production build (`pnpm build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
