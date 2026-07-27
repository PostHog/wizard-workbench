# PostHog setup report

PostHog product analytics was initialized for the anonymous Next.js Pages Router todo app, with three client-side todo events, browser exception capture, and a starter dashboard.

## What was installed and initialized

- Installed `posthog-js` (`^1.407.3`) and `posthog-node` (`^5.46.1`) with pnpm; both are recorded in `package.json` and `pnpm-lock.yaml`.
- Added the single guarded browser initialization in `instrumentation-client.ts`, using `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`, with the documented defaults, development diagnostics, and `capture_exceptions: true`.
- Added the public configuration names to `.env.example`; the configured environment keys were also confirmed present during review.
- No CSP changes were needed because the inspected project files contain no Content-Security-Policy directives.

## Instrumented events

| Event | What it measures | File |
|---|---|---|
| `todo_created` | A todo was successfully created, including whether it has a description and its initial completion status. | `components/todos/todo-list.tsx` |
| `todo_completion_changed` | A todo was successfully marked complete or returned to active status, including the resulting completion status. | `components/todos/todo-list.tsx` |
| `todo_deleted` | A todo was successfully deleted. | `components/todos/todo-list.tsx` |

The captures run only after their corresponding API requests return successfully. The run verified the source placement and event contract, but did **not** observe events arriving in PostHog; the dashboard may therefore be empty until the app is exercised.

## User identification

Identification was skipped. The inspected app has no authentication, registration, logout, session, or user model, and todo IDs are resource IDs without an owner association. Events remain anonymous. If authentication is added later, identify at the successful login/registration boundary using a stable user primary key, identify returning authenticated sessions, and reset on logout.

## Error tracking

Browser-wide uncaught exception and rejection capture is enabled through `capture_exceptions: true` in `instrumentation-client.ts`. No additional error boundary or scattered manual exception calls were added. Server-side API exception handling was not added in this run.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1914271) contains four saved insights: daily creation, completion-change, and deletion trends, plus a 14-day creation-to-completion funnel. The insights use a `-30d` range and may initially be empty. Their existence and attachment were verified through PostHog MCP; event delivery was not verified.

## What the run verified—and what it did not

- `pnpm install` completed with an up-to-date lockfile and both SDK packages resolved.
- `pnpm build` completed successfully, including production compilation and Next.js type validation.
- No lint or standalone typecheck script is defined in `package.json`.
- The build emitted a pre-existing Next.js workspace-root/multiple-lockfile warning; this is unrelated to the PostHog integration.
- The run verified code structure, configuration-key presence, saved dashboard artifacts, and successful build compilation. It did not verify browser event delivery, server event delivery, or populated dashboard results.

## Issues to follow up

1. **Server-side route instrumentation remains unresolved.** The app has server API routes under `pages/api/todos`, but this run did not add `posthog-node` captures or awaited flushing for create, update, and delete route handlers. If left unresolved, server-side operations and route-level failures will not be represented independently in PostHog. Follow up in `pages/api/todos/index.ts` and `pages/api/todos/[id].ts`.
2. **No stable user attribution is available.** This is intentional for the current anonymous app, not a placeholder. If accounts are introduced, events in `components/todos/todo-list.tsx` will remain anonymous until the authenticated identity flow is wired.

## Before you merge

- [ ] Run a full production build and fix any lint or type errors introduced by the generated integration; the wizard verified `pnpm build`, but the deploy environment still needs confirmation. Review `instrumentation-client.ts` and `components/todos/todo-list.tsx` if errors appear.
- [ ] Run the test suite; instrumented call sites may require updated mocks or fixtures. This project has no test script in `package.json`, so add or run the repository’s applicable test command if one exists outside the inspected scripts.
- [ ] Set `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` in every deploy environment, not only locally, and verify the names match `.env.example`. Review `.env.example` and `instrumentation-client.ts`.
- [ ] Exercise create, completion-toggle, and delete actions in a real browser session and confirm `todo_created`, `todo_completion_changed`, and `todo_deleted` arrive in PostHog. Review the capture call sites in `components/todos/todo-list.tsx` and the dashboard.
- [ ] Decide whether to add server-side tracking and awaited flushing for the API routes before relying on route-level analytics. Review `pages/api/todos/index.ts` and `pages/api/todos/[id].ts`.
