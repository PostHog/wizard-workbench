<wizard-report>
# PostHog post-wizard report

The wizard has completed a full PostHog integration for this Next.js 15 Pages Router todo application. The integration includes client-side analytics via `posthog-js`, server-side event tracking via `posthog-node`, a reverse proxy configuration to avoid ad-blockers, and correlation headers so client and server events are linked to the same user.

**Files created or modified:**

| File | Change |
|------|--------|
| `instrumentation-client.ts` | Created — initializes PostHog on the client with reverse proxy host, error tracking, and debug mode |
| `next.config.ts` | Updated — added `/ingest/*` reverse proxy rewrites and `skipTrailingSlashRedirect` |
| `lib/posthog-server.ts` | Created — singleton `posthog-node` client for server-side event capture |
| `.env.local` | Created — `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` |
| `components/todos/todo-list.tsx` | Updated — `posthog.capture()` calls for all todo user actions, plus `X-POSTHOG-DISTINCT-ID` / `X-POSTHOG-SESSION-ID` headers on every API fetch |
| `pages/api/todos/index.ts` | Updated — server-side `todo_created` event on successful POST |
| `pages/api/todos/[id].ts` | Updated — server-side `todo_updated` (PATCH) and `todo_deleted` (DELETE) events |

## Events tracked

| Event | Description | File |
|-------|-------------|------|
| `todo_created` | User successfully creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks a todo as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | User unchecks a completed todo | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item | `components/todos/todo-list.tsx` |
| `todo_created` | Server-side confirmation of todo creation via POST `/api/todos` | `pages/api/todos/index.ts` |
| `todo_updated` | Server-side confirmation of todo update via PATCH `/api/todos/[id]` | `pages/api/todos/[id].ts` |
| `todo_deleted` | Server-side confirmation of todo deletion via DELETE `/api/todos/[id]` | `pages/api/todos/[id].ts` |

## Next steps

We recommend building these insights in PostHog to monitor user behavior:

1. **Todo creation trend** — Trend of `todo_created` over time. Shows overall user engagement.
2. **Todo completion funnel** — Funnel from `todo_created` → `todo_completed`. Measures how many created todos get completed.
3. **Todo deletion rate** — Trend of `todo_deleted` over time. Highlights churn or dissatisfaction with tasks.
4. **Completion vs uncompleted toggle** — Bar chart comparing `todo_completed` vs `todo_uncompleted` event counts.
5. **Todos with descriptions** — Breakdown of `todo_created` by `has_description` property. Shows how users engage with the optional description field.

Navigate to your PostHog project to create these insights and a dashboard:

- **PostHog Project:** https://us.posthog.com/project/2/dashboards
- **New Insight:** https://us.posthog.com/project/2/insights/new

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
