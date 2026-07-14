# PostHog post-wizard report

The wizard has completed a deep integration of this Next.js App Router todo application with PostHog product analytics, server-side event capture, and client-side error tracking support. It installed `posthog-js` and `posthog-node`, added client initialization in `instrumentation-client.ts`, added a server helper in `lib/posthog-server.ts`, configured a Next.js reverse proxy in `next.config.ts`, set `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` in `.env.local`, instrumented client interactions in the todo list and About CTA, and added server-side API success/failure tracking plus exception capture in the todo route handlers.

| Event name | Description | File |
| --- | --- | --- |
| `todo_list_loaded` | Captures when the todo list loads successfully in the client. | `components/todos/todo-list.tsx` |
| `todo_created` | Captures when a user creates a new todo from the client form. | `components/todos/todo-list.tsx` |
| `todo_completion_toggled` | Captures when a user marks a todo complete or incomplete from the client. | `components/todos/todo-list.tsx` |
| `todo_deleted` | Captures when a user deletes a todo from the client. | `components/todos/todo-list.tsx` |
| `todo_create_api_succeeded` | Captures when the server successfully creates a todo through the API. | `app/api/todos/route.ts` |
| `todo_create_api_failed` | Captures when todo creation fails validation or server processing in the API. | `app/api/todos/route.ts` |
| `todo_update_api_succeeded` | Captures when the server successfully updates a todo through the API. | `app/api/todos/[id]/route.ts` |
| `todo_update_api_failed` | Captures when todo updates fail validation, lookup, or server processing in the API. | `app/api/todos/[id]/route.ts` |
| `todo_delete_api_succeeded` | Captures when the server successfully deletes a todo through the API. | `app/api/todos/[id]/route.ts` |
| `todo_delete_api_failed` | Captures when todo deletion fails lookup or server processing in the API. | `app/api/todos/[id]/route.ts` |
| `about_page_cta_clicked` | Captures when a visitor clicks the About page call-to-action to return to the todo app. | `app/about/page.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1846744)
- Insight: [Todos created over time (wizard)](https://us.posthog.com/project/483112/insights/kpk80QzR)
- Insight: [Todo completion rate funnel (wizard)](https://us.posthog.com/project/483112/insights/xoxxsyHb)
- Insight: [Todo deletions over time (wizard)](https://us.posthog.com/project/483112/insights/mCQH62dW)
- Insight: [API failures by event (wizard)](https://us.posthog.com/project/483112/insights/BT0VozMR)
- Insight: [Todo list loads vs creations (wizard)](https://us.posthog.com/project/483112/insights/eobiFLOB)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

> Note: Notebook mirroring could not be completed because the current PostHog MCP authentication is missing `notebook:write` scope.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
