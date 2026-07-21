# PostHog post-wizard report

The wizard integrated PostHog into this Next.js 15 Pages Router todo application. Client analytics and exception autocapture initialize through `instrumentation-client.ts`; server analytics use a reusable `posthog-node` client configured for short-lived API requests. Todo mutations now send correlated server-side events using the browser distinct ID and session ID, and client request failures are captured as exceptions. The production build completed successfully.

| Event | Description | File |
|---|---|---|
| `todo_created` | A todo was successfully created through the API. | `pages/api/todos/index.ts` |
| `todo_completion_changed` | A todo was marked complete or returned to active through the API. | `pages/api/todos/[id].ts` |
| `todo_deleted` | A todo was successfully deleted through the API. | `pages/api/todos/[id].ts` |

## Next steps

The PostHog MCP endpoint was unavailable while the wizard ran, so the live dashboard, insights, and notebook could not be created. Retry that step when the MCP endpoint is available.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or the bundler upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
