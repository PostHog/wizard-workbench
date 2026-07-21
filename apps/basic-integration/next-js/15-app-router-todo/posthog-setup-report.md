# PostHog post-wizard report

The wizard integrated PostHog product analytics and exception tracking into this Next.js 15 App Router todo application. It installed the browser and Node.js SDKs, configured client initialization and a server client, correlated browser and API activity with PostHog distinct and session IDs, instrumented the todo lifecycle, and verified the integration with a successful production build. Dashboard and notebook creation were attempted but could not be completed because the PostHog MCP service was unavailable.

| Event | Description | File |
|---|---|---|
| `todo_create_submitted` | A user submitted the form to create a todo. | `components/todos/todo-list.tsx` |
| `todo_completion_toggled` | A user changed a todo's completion state. | `components/todos/todo-list.tsx` |
| `todo_delete_requested` | A user requested that a todo be deleted. | `components/todos/todo-list.tsx` |
| `todo_created` | The server successfully created and persisted a todo. | `app/api/todos/route.ts` |
| `todo_updated` | The server successfully updated a todo. | `app/api/todos/[id]/route.ts` |
| `todo_deleted` | The server successfully deleted a todo. | `app/api/todos/[id]/route.ts` |

## Next steps

Dashboard and insight creation could not be completed because the PostHog MCP service was unavailable. Once access is restored, create **Analytics basics (wizard)** with a todo creation funnel, completion-state trend, and deletion trend using the event names above. The setup notebook also remains to be created in PostHog.

## Verify before merging

- [ ] Run a full production build and fix any lint or type errors introduced by the generated code. The wizard's `pnpm build` verification passed.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo or bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or the bundler upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
