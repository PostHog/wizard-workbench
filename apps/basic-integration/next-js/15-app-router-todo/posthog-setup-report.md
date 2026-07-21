# PostHog post-wizard report

The wizard integrated PostHog into this Next.js 15 App Router todo application. It installed the browser and Node.js SDKs, initialized browser analytics and exception capture through `instrumentation-client.ts`, configured a short-lived server client that flushes before API responses return, correlated browser and server activity with PostHog distinct/session IDs, captured non-PII todo lifecycle events, and added client exception reporting around todo mutations. PostHog configuration is read from `.env.local` through `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`.

| Event | Description | File |
|---|---|---|
| `todo_creation_submitted` | A user submits the form to create a todo, with non-sensitive form completeness context. | `components/todos/todo-form.tsx` |
| `todo_created` | The server successfully creates a todo. | `app/api/todos/route.ts` |
| `todo_completion_changed` | The server successfully changes a todo's completion status. | `app/api/todos/[id]/route.ts` |
| `todo_deleted` | The server successfully deletes a todo. | `app/api/todos/[id]/route.ts` |

## Next steps

The PostHog MCP endpoint was unavailable during dashboard creation, so no live dashboard, insights, or notebook could be created. Once MCP connectivity is restored, create **Analytics basics (wizard)** with a creation funnel and todo lifecycle trends using the exact event names above.

## Verify before merging

- [ ] Run a full production build and fix any lint or type errors introduced by the generated code. (The wizard successfully ran `pnpm build` during setup.)
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or the bundler upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
