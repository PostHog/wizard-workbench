# PostHog post-wizard report

The wizard integrated PostHog into this Next.js 15 App Router todo application. It installed the browser and Node.js SDKs, initialized browser analytics and exception capture through `instrumentation-client.ts`, added a server-side client configured for short-lived route handlers, correlated browser and server activity using PostHog distinct and session IDs, and instrumented successful create, completion-change, and delete operations. Event properties contain only operational metadata and exclude todo titles, descriptions, and other user-entered content.

| Event | Description | File |
| --- | --- | --- |
| `todo_created` | A todo was successfully created through the API. | `app/api/todos/route.ts` |
| `todo_completion_changed` | A todo was marked complete or returned to active through the API. | `app/api/todos/[id]/route.ts` |
| `todo_deleted` | A todo was successfully deleted through the API. | `app/api/todos/[id]/route.ts` |

## Next steps

Dashboard and notebook creation could not be completed because the PostHog MCP server was unavailable during setup. Once access is restored, create **Analytics basics (wizard)** with a creation-to-completion funnel, todo creation volume, completion-state breakdown, and deletion volume.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
