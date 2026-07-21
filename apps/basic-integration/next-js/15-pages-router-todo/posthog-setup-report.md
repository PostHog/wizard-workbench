# PostHog post-wizard report

The wizard integrated PostHog into this Next.js Pages Router todo application. It installed the browser and Node.js SDKs, initialized browser analytics and exception autocapture from environment variables, added a short-lived server client with reliable flushing, correlated browser sessions with API events, and instrumented the core todo lifecycle without capturing todo titles, descriptions, or other user-entered content.

| Event | Description | File |
| --- | --- | --- |
| `todo_created` | A todo was successfully created through the API. | `pages/api/todos/index.ts` |
| `todo_completion_changed` | A todo was successfully marked complete or returned to active. | `pages/api/todos/[id].ts` |
| `todo_deleted` | A todo was successfully deleted through the API. | `pages/api/todos/[id].ts` |

## Next steps

Dashboard and notebook creation could not be completed because the PostHog MCP server was unavailable during setup. Once it is available, create **Analytics basics (wizard)** with lifecycle trends and a `todo_created` → `todo_completion_changed` funnel.

## Verify before merging

- [ ] Run a full production build and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or the bundler upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
