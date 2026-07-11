<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your project. PostHog was installed for both browser and server usage, initialized through `instrumentation-client.ts`, and routed through a Next.js reverse proxy in `next.config.ts`. Client-side captures were added for loading the todo list, submitting a todo, toggling completion, clicking delete, and using the about-page CTA. Server-side captures and exception tracking were added to the todo API routes for create, update, and delete success and failure paths, with PostHog distinct ID and session ID headers passed from the browser so client and server activity can be correlated.

| Event name | Description | File |
| --- | --- | --- |
| `todos_loaded` | Tracks when the todo list finishes loading in the client. | `components/todos/todo-list.tsx` |
| `todo_create_submitted` | Tracks when a user submits the add todo form from the client. | `components/todos/todo-form.tsx` |
| `todo_completion_toggled` | Tracks when a user toggles a todo completion state from the client. | `components/todos/todo-item.tsx` |
| `todo_delete_clicked` | Tracks when a user clicks delete for a todo from the client. | `components/todos/todo-item.tsx` |
| `about_page_cta_clicked` | Tracks when a user clicks the about page return call-to-action. | `app/about/page-client.tsx` |
| `todo_created` | Tracks successful todo creation on the server API. | `app/api/todos/route.ts` |
| `todo_create_failed` | Tracks todo creation failures on the server API. | `app/api/todos/route.ts` |
| `todo_updated` | Tracks successful todo updates on the server API. | `app/api/todos/[id]/route.ts` |
| `todo_update_failed` | Tracks todo update failures on the server API. | `app/api/todos/[id]/route.ts` |
| `todo_deleted` | Tracks successful todo deletion on the server API. | `app/api/todos/[id]/route.ts` |
| `todo_delete_failed` | Tracks todo deletion failures on the server API. | `app/api/todos/[id]/route.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1831217)
- [Todo creation funnel (wizard)](https://us.posthog.com/project/483112/insights/uIqddKwC)
- [Todo creation trend (wizard)](https://us.posthog.com/project/483112/insights/SR40ukVJ)
- [Todo completion trend (wizard)](https://us.posthog.com/project/483112/insights/CmMnWyuZ)
- [Todo deletion trend (wizard)](https://us.posthog.com/project/483112/insights/pwxujNUW)
- [Todo API failures (wizard)](https://us.posthog.com/project/483112/insights/DQJHH1YH)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
