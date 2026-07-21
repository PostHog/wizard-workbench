# PostHog post-wizard report

The wizard integrated PostHog into this Next.js Pages Router todo app. It installed the browser and Node SDKs, configured client initialization with automatic exception capture, added a short-lived-safe server client, correlated browser and API activity with PostHog distinct/session headers, captured critical todo lifecycle events on successful server operations, and added exception capture around client and API failures. Autocapture and session recording remain at their defaults. No authentication flow exists, so user identification was not added.

| Event | Description | File |
|---|---|---|
| `todo_created` | A new todo is successfully created through the API. | `pages/api/todos/index.ts` |
| `todo_completion_changed` | A todo is marked completed or returned to active through the API. | `pages/api/todos/[id].ts` |
| `todo_updated` | A todo's editable details are successfully updated through the API. | `pages/api/todos/[id].ts` |
| `todo_deleted` | A todo is successfully deleted through the API. | `pages/api/todos/[id].ts` |

## Next steps

Dashboard and insight creation is pending because the PostHog MCP endpoint was unavailable during setup. Once access is restored, create the required **Analytics basics (wizard)** dashboard with todo creation, completion, update, and deletion insights.

## Verify before merging

- [ ] Run a full production build and fix any lint or type errors introduced by the generated code. The wizard's production build passed, but CI may apply additional checks.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or the bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
