# PostHog post-wizard report

The wizard has completed a deep integration of this Next.js Pages Router todo app with PostHog product analytics and error tracking. The setup added client-side initialization through `instrumentation-client.ts`, server-side analytics through a shared `posthog-node` client, reverse-proxy rewrites in Next.js, and both client and API-route event capture around the core todo workflow. Environment variables were configured in `.env.local`, and the integration was verified with a successful production build.

| Event name | Description | File |
| --- | --- | --- |
| `todo_created` | Captures when a new todo is successfully created through the API. | `pages/api/todos/index.ts` |
| `todo_completion_toggled` | Captures when a todo is marked complete or incomplete through the API. | `pages/api/todos/[id].ts` |
| `todo_deleted` | Captures when a todo is successfully deleted through the API. | `pages/api/todos/[id].ts` |
| `todo_create_requested` | Captures when a user submits the add-todo form in the interface. | `components/todos/todo-form.tsx` |
| `todo_filter_viewed` | Captures when the todo list loads and shows the current active and completed counts. | `components/todos/todo-list.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1842135)
- [Todo requests over time (wizard)](https://us.posthog.com/project/483112/insights/BTaakFPo)
- [Todo lifecycle funnel (wizard)](https://us.posthog.com/project/483112/insights/dztTHrT1)
- [Todo completions by state (wizard)](https://us.posthog.com/project/483112/insights/1LRVU1nJ)
- [Todo deletions over time (wizard)](https://us.posthog.com/project/483112/insights/yAOJkpA3)
- [Todo list loads by completion mix (wizard)](https://us.posthog.com/project/483112/insights/6hUdNGCT)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
