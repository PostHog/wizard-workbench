<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of this Next.js App Router todo application. PostHog client initialization was added through `instrumentation-client.ts`, server-side capture support was added through `lib/posthog-server.ts`, reverse-proxy rewrites were configured in `next.config.ts`, and both client and server todo flows were instrumented with analytics and exception capture. Environment variables were written to `.env.local`, a starter dashboard was created in PostHog, and five saved insights were added to that dashboard.

| Event name | Description | File |
| --- | --- | --- |
| `todo_list_loaded` | Captured when the todo list loads successfully in the client application. | `components/todos/todo-list.tsx` |
| `todo_created` | Captured when a new todo is successfully created from the add todo form. | `components/todos/todo-list.tsx` |
| `todo_completion_toggled` | Captured when a todo is marked complete or returned to active status. | `components/todos/todo-list.tsx` |
| `todo_deleted` | Captured when a todo is successfully deleted from the list. | `components/todos/todo-list.tsx` |
| `about_page_viewed` | Captured when the about page is viewed as part of the product exploration funnel. | `app/about/page.tsx` |
| `todo_api_list_requested` | Captured when the server handles a request to list todos. | `app/api/todos/route.ts` |
| `todo_api_created` | Captured when the server successfully creates a new todo. | `app/api/todos/route.ts` |
| `todo_api_updated` | Captured when the server successfully updates a todo. | `app/api/todos/[id]/route.ts` |
| `todo_api_deleted` | Captured when the server successfully deletes a todo. | `app/api/todos/[id]/route.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: https://us.posthog.com/project/483112/dashboard/1796149
- Insight: Todo creation trend (wizard) — https://us.posthog.com/project/483112/insights/Ct0AqGTs
- Insight: Todo completion trend (wizard) — https://us.posthog.com/project/483112/insights/BvEtsxxt
- Insight: Todo deletion trend (wizard) — https://us.posthog.com/project/483112/insights/YHiGM3Lo
- Insight: About page views (wizard) — https://us.posthog.com/project/483112/insights/1qZjMiMu
- Insight: Todo funnel (wizard) — https://us.posthog.com/project/483112/insights/IEMHwaO8

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
