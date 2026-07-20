# PostHog post-wizard report

The wizard integrated PostHog into this Next.js 15 Pages Router todo application. It installed the browser and Node.js SDKs, configured client initialization and server-side analytics through environment variables, correlated browser sessions with API events, enabled exception capture, and instrumented successful todo creation, status changes, and deletion. A production build completed successfully.

| Event | Description | File |
| --- | --- | --- |
| `todo_created` | A todo was successfully created through the API. | `pages/api/todos/index.ts` |
| `todo_status_changed` | A todo was successfully marked complete or active through the API. | `pages/api/todos/[id].ts` |
| `todo_deleted` | A todo was successfully deleted through the API. | `pages/api/todos/[id].ts` |

## Next steps

Dashboard and insight creation could not be completed because the PostHog MCP server was unavailable during this run. Once access is restored, create **Analytics basics (wizard)** with trends for the three events and a `todo_created` → `todo_status_changed` → `todo_deleted` lifecycle funnel.

## Verify before merging

- [ ] Run a full production build and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or the bundler upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
