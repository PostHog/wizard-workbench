<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js 15 App Router todo application. Here is a summary of what was done:

- **`posthog-js`** and **`posthog-node`** were installed as dependencies.
- **`instrumentation-client.ts`** was created at the project root to initialize PostHog on the client side using the Next.js 15.3+ instrumentation API. This enables autocapture, session replay, and error tracking automatically.
- **`next.config.ts`** was updated to add PostHog reverse proxy rewrites (`/ingest/*`), which improves event delivery reliability by routing PostHog requests through your own domain.
- **`lib/posthog-server.ts`** was created as a singleton server-side PostHog client helper using `posthog-node`.
- **`components/todos/todo-list.tsx`** was updated to capture client-side events on todo create, complete, reopen, and delete — with error tracking on failures.
- **`app/api/todos/route.ts`** was updated to capture a server-side `todo_created` event on POST.
- **`app/api/todos/[id]/route.ts`** was updated to capture server-side `todo_updated` and `todo_deleted` events on PATCH and DELETE.
- **`.env.local`** was created with `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables.

| Event | Description | File |
|---|---|---|
| `todo_created` | User successfully creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks an active todo as completed | `components/todos/todo-list.tsx` |
| `todo_reopened` | User marks a completed todo as active again | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item | `components/todos/todo-list.tsx` |
| `todo_created` | Server-side: new todo created via POST API | `app/api/todos/route.ts` |
| `todo_updated` | Server-side: todo updated via PATCH API | `app/api/todos/[id]/route.ts` |
| `todo_deleted` | Server-side: todo deleted via DELETE API | `app/api/todos/[id]/route.ts` |

## Next steps

We recommend building an **"Analytics basics"** dashboard in PostHog with insights like:

1. **Total todos created** — Trend on `todo_created`
2. **Todo completion rate** — Funnel: `todo_created` → `todo_completed`
3. **Completed vs reopened** — Trend comparing `todo_completed` and `todo_reopened`
4. **Todo deletion trend** — Trend on `todo_deleted`
5. **All todo activity** — Trend showing all events together

Create these at: [https://us.posthog.com/project/238460/dashboard](https://us.posthog.com/project/238460/dashboard)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
