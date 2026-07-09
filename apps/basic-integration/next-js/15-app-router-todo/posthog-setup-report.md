<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of this Next.js App Router todo application with PostHog. It installed the browser and server SDKs, initialized client-side analytics in `instrumentation-client.ts`, added a Next.js rewrite proxy for `/ingest`, created a reusable server PostHog client, instrumented client-side todo creation/completion/deletion events, added matching server-side API events for create/update/delete operations, enabled exception capture around the instrumented flows, configured the required environment variables, verified the integration with a production build, and created a starter analytics dashboard with related insights.

| Event name | Description | File |
| --- | --- | --- |
| `todo_created` | Captures when a user successfully creates a todo from the main form. | `components/todos/todo-list.tsx` |
| `todo_completion_toggled` | Captures when a user marks a todo complete or incomplete. | `components/todos/todo-list.tsx` |
| `todo_deleted` | Captures when a user removes a todo from the list. | `components/todos/todo-list.tsx` |
| `todo_created_server` | Captures when the server successfully creates a todo through the API route. | `app/api/todos/route.ts` |
| `todo_updated_server` | Captures when the server successfully updates a todo through the API route. | `app/api/todos/[id]/route.ts` |
| `todo_deleted_server` | Captures when the server successfully deletes a todo through the API route. | `app/api/todos/[id]/route.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: https://us.posthog.com/project/483112/dashboard/1825363
- Insight: Todos created over time (wizard) — https://us.posthog.com/project/483112/insights/VoKyLo1i
- Insight: Todo completion toggles over time (wizard) — https://us.posthog.com/project/483112/insights/mzvZ0OCI
- Insight: Todo lifecycle funnel (wizard) — https://us.posthog.com/project/483112/insights/VqpmnP0j
- Insight: Server-side todo operations (wizard) — https://us.posthog.com/project/483112/insights/HfuQrmbp
- Insight: Todo deletions share (wizard) — https://us.posthog.com/project/483112/insights/eXY9GjCy

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
