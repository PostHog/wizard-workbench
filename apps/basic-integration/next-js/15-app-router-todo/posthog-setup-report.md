# PostHog post-wizard report

The wizard has integrated PostHog analytics into this Next.js App Router todo application. It installed the browser and Node.js SDKs, initialized client-side analytics through `instrumentation-client.ts`, and configured a short-lived server client for route-handler events. The application captures successful todo creation, completion-state changes, and deletion from the browser and the API, while forwarding the browser's anonymous distinct ID and session ID to correlate server-side events. Exception capture is enabled in the browser and added to the instrumented API failure paths.

The required PostHog environment variables were written to `.env.local` using the Next.js public-variable convention. No tokens or hosts were placed in source code.

| Event name | Description | Files |
| --- | --- | --- |
| `todo_created` | Captures successful todo creation with completion and description-presence context. | `components/todos/todo-list.tsx`, `app/api/todos/route.ts` |
| `todo_completion_toggled` | Captures a successful completion-state change made from the UI. | `components/todos/todo-list.tsx` |
| `todo_updated` | Captures a successful todo update from the API. | `app/api/todos/[id]/route.ts` |
| `todo_deleted` | Captures successful todo deletion from the UI and API. | `components/todos/todo-list.tsx`, `app/api/todos/[id]/route.ts` |

## Next steps

The PostHog MCP dashboard and notebook service was unavailable during this run, so no dashboard, insights, or shareable notebook could be created. After the service is available, create **Analytics basics (wizard)** using the events above and add trends for `todo_created`, `todo_completion_toggled`, and `todo_deleted`, plus a funnel from `todo_created` to `todo_completion_toggled`.

## Verify before merging

- [ ] Run a full production build and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

An agent skill folder was added under `.claude/skills/integration-nextjs-app-router`. Use it for future agent development to preserve the current PostHog integration approach.
