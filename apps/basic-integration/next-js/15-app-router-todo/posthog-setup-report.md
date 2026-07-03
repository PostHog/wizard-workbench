<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of this Next.js App Router todo application with PostHog. Client-side analytics now initialize through `instrumentation-client.ts`, server-side capture is available through a shared `posthog-node` helper, and a reverse proxy rewrite has been added in `next.config.ts`. The integration instruments key todo lifecycle behaviors on the client, mirrors critical business operations on the API routes, and captures exceptions around both client fetch flows and server mutations.

| Event name | Description | File |
| --- | --- | --- |
| todo_list_loaded | Captures when the todo list is successfully loaded in the client. | components/todos/todo-list.tsx |
| todo_created | Captures when a new todo is successfully created from the client form. | components/todos/todo-list.tsx |
| todo_completion_toggled | Captures when a todo is marked complete or incomplete from the client. | components/todos/todo-list.tsx |
| todo_deleted | Captures when a todo is deleted from the client. | components/todos/todo-list.tsx |
| about_page_viewed | Captures when the about page is viewed as a top-of-funnel product exploration step. | app/about/page.tsx |
| todo_created_api | Captures when the server successfully creates a new todo through the API. | app/api/todos/route.ts |
| todo_updated_api | Captures when the server successfully updates a todo through the API. | app/api/todos/[id]/route.ts |
| todo_deleted_api | Captures when the server successfully deletes a todo through the API. | app/api/todos/[id]/route.ts |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: https://us.posthog.com/project/483112/dashboard/1796148
- Insight: Todo creations over time — https://us.posthog.com/project/483112/insights/iXQ1FMjK
- Insight: Todo completion toggles over time — https://us.posthog.com/project/483112/insights/TXUfFLfZ
- Insight: Todo deletions over time — https://us.posthog.com/project/483112/insights/ljyAr75Y
- Insight: Todo lifecycle funnel — https://us.posthog.com/project/483112/insights/QInVrGwt
- Insight: About page views over time — https://us.posthog.com/project/483112/insights/6We7ItYb

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
