# PostHog post-wizard report

The wizard integrated PostHog into this Next.js Pages Router todo app. It installed the browser and Node SDKs, added browser initialization through `instrumentation-client.ts`, configured server-side client creation with immediate flushing for short-lived API routes, and enabled exception capture. The API routes now capture the core todo lifecycle events without recording todo titles, descriptions, or other user-entered content. Client requests pass the browser's anonymous distinct ID to the API so client and server activity remains correlated.

| Event name | Description | File |
| --- | --- | --- |
| `todo_created` | Records when a todo is successfully created through the API. | `pages/api/todos/index.ts` |
| `todo_completion_changed` | Records when a todo's completion status is successfully updated through the API. | `pages/api/todos/[id].ts` |
| `todo_deleted` | Records when a todo is successfully deleted through the API. | `pages/api/todos/[id].ts` |

## Next steps

A dashboard and shareable notebook could not be created because the configured PostHog MCP server was unavailable in this environment. Once the connection is available, create **Analytics basics (wizard)** and add trends for `todo_created`, `todo_completion_changed`, and `todo_deleted`.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

An agent skill folder remains in the project for future PostHog-related agent development. It contains the current Next.js Pages Router integration guidance.
