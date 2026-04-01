<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 App Router todo application. Here is a summary of all changes made:

- **`instrumentation-client.ts`** (new): Initializes `posthog-js` on the client side using the Next.js 15.3+ `instrumentation-client` convention. Enables automatic exception capture, session replay, and debug mode in development. Uses the `/ingest` reverse proxy for improved reliability.
- **`lib/posthog-server.ts`** (new): Singleton server-side PostHog client using `posthog-node`. Used in API routes to capture server-side events with `flushAt: 1` and `flushInterval: 0` to ensure immediate event delivery.
- **`next.config.ts`** (updated): Added reverse proxy rewrites for `/ingest` to route PostHog requests through your Next.js server, reducing tracking-blocker interference.
- **`components/todos/todo-list.tsx`** (updated): Added client-side event capture for `todo_created`, `todo_completed`, `todo_uncompleted`, and `todo_deleted`. Passes `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` headers to API calls so server-side events can be correlated to the same user session.
- **`app/api/todos/route.ts`** (updated): Added server-side `todo_created` event in the POST handler using `posthog-node`.
- **`app/api/todos/[id]/route.ts`** (updated): Added server-side `todo_updated` (PATCH) and `todo_deleted` (DELETE) events using `posthog-node`.
- **`.env.local`** (new): Created with `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables.

## Events instrumented

| Event | Description | File |
|---|---|---|
| `todo_created` | User successfully creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks a todo as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | User marks a completed todo as incomplete | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item | `components/todos/todo-list.tsx` |
| `todo_created` | Server-side: new todo persisted via POST /api/todos | `app/api/todos/route.ts` |
| `todo_updated` | Server-side: todo updated via PATCH /api/todos/[id] | `app/api/todos/[id]/route.ts` |
| `todo_deleted` | Server-side: todo deleted via DELETE /api/todos/[id] | `app/api/todos/[id]/route.ts` |

## Next steps

We've set up event tracking. Head to your PostHog project to explore the data and build insights:

- **Project overview**: [https://us.posthog.com/project/238460](https://us.posthog.com/project/238460)
- **Create a new dashboard** named "Analytics basics": [https://us.posthog.com/project/238460/dashboards](https://us.posthog.com/project/238460/dashboards)
- **Todos created (trend)** – track how often users add new tasks: [https://us.posthog.com/project/238460/insights/new#{"insight":"TRENDS","events":[{"id":"todo_created","name":"todo_created","type":"events","order":0}]}](https://us.posthog.com/project/238460/insights/new)
- **Completion funnel** – `todo_created` → `todo_completed`: [https://us.posthog.com/project/238460/insights/new#{"insight":"FUNNELS","events":[{"id":"todo_created"},{"id":"todo_completed"}]}](https://us.posthog.com/project/238460/insights/new)
- **Todo deletion rate** – how often users abandon tasks: [https://us.posthog.com/project/238460/insights/new](https://us.posthog.com/project/238460/insights/new)
- **Active users** – unique users performing any todo action: [https://us.posthog.com/project/238460/insights/new](https://us.posthog.com/project/238460/insights/new)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
