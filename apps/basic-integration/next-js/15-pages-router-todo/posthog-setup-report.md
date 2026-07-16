# PostHog post-wizard report

The wizard completed a PostHog integration for this Next.js Pages Router todo app. It installed `posthog-js` and `posthog-node`, configured browser initialization through `instrumentation-client.ts`, and added a shared server-side client configured to flush API-route events before a response returns. The public browser configuration is read from `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` in `.env.local`.

Client and API route tracking now capture successful todo creation, completion changes, and deletions. Event properties use non-PII operational context only. Browser request failures and server-side API failures are captured as exceptions. The client passes its anonymous PostHog distinct ID to API routes so browser and server events remain correlated.

| Event name | Description | Files |
| --- | --- | --- |
| `todo_created` | A visitor or API request successfully creates a todo item. | `components/todos/todo-list.tsx`, `pages/api/todos/index.ts` |
| `todo_completion_changed` | A visitor or API request successfully marks a todo active or complete. | `components/todos/todo-list.tsx`, `pages/api/todos/[id].ts` |
| `todo_deleted` | A visitor or API request successfully deletes a todo item. | `components/todos/todo-list.tsx`, `pages/api/todos/[id].ts` |

## Next steps

The production build completed successfully with the integration in place.

A dashboard and shareable PostHog notebook could not be created because the configured PostHog MCP endpoint was unavailable from this environment. Create an **Analytics basics (wizard)** dashboard in PostHog after the MCP service is available, with trends for `todo_created`, `todo_completion_changed`, and `todo_deleted` over the last 30 days.

## Verify before merging

- [ ] Run a full production build and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

An agent skill folder remains in the project under `.claude/skills/` for future agent development. It provides current PostHog integration guidance.
