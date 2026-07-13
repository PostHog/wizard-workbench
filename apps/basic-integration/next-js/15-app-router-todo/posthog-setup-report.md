# PostHog post-wizard report

The wizard completed a PostHog integration for this Next.js App Router todo app by installing the browser and server SDKs, initializing client-side PostHog in `instrumentation-client.ts`, adding a Next.js reverse proxy in `next.config.ts`, wiring server-side analytics through a shared Node client, capturing key todo lifecycle and navigation events, enabling exception capture in both client and server paths, and configuring the required environment variables in `.env.local`.

| Event name | Description | File |
| --- | --- | --- |
| `todo_list_loaded` | Captures when the todo list loads successfully in the client. | `components/todos/todo-list.tsx` |
| `todo_creation_submitted` | Captures when a user submits the form to create a new todo from the client. | `components/todos/todo-list.tsx` |
| `todo_created` | Captures when the API successfully creates a new todo. | `app/api/todos/route.ts` |
| `todo_completion_toggled` | Captures when a user changes a todo completion state from the client. | `components/todos/todo-list.tsx` |
| `todo_updated` | Captures when the API successfully updates an existing todo. | `app/api/todos/[id]/route.ts` |
| `todo_deleted` | Captures when the API successfully deletes a todo. | `app/api/todos/[id]/route.ts` |
| `about_page_cta_clicked` | Captures when a visitor clicks the navigation CTA from the about page back to the todo list. | `app/about/page.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1842138)
- [Todo creations over time (wizard)](https://us.posthog.com/project/483112/insights/h9VKxNhp)
- [Todo management funnel (wizard)](https://us.posthog.com/project/483112/insights/saoQF8RK)
- [Todo updates by outcome (wizard)](https://us.posthog.com/project/483112/insights/ydJ4NZGO)
- [Todo deletions over time (wizard)](https://us.posthog.com/project/483112/insights/DYu9vcaC)
- [About CTA clicks over time (wizard)](https://us.posthog.com/project/483112/insights/zmbXJiWb)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
