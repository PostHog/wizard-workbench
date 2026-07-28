# PostHog setup report

PostHog was installed and initialized for the Next.js App Router todo app, with three successful todo-mutation events, global error capture, and a starter dashboard.

## What was installed and initialized

- Installed `posthog-js` `^1.407.5` and `posthog-node` `^5.46.1` with pnpm; the lockfile resolves `posthog-js` 1.407.5 and `posthog-node` 5.46.1.
- Initialized the browser SDK once in `instrumentation-client.ts` using `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`.
- The real environment values were configured in `.env`; `.env.example` documents both keys.
- Exception capture is enabled during initialization. No second client or provider was added.
- No server-side event instrumentation was added because the same mutations are captured after successful client API responses.

## Events instrumented

| Event | What it measures | File |
|---|---|---|
| `todo_created` | A todo was successfully created; the event records whether it had a description via `has_description`. | `components/todos/todo-list.tsx` |
| `todo_completion_changed` | A todo was successfully marked complete or incomplete; the event records the resulting `completed` state. | `components/todos/todo-list.tsx` |
| `todo_deleted` | A todo was successfully deleted. | `components/todos/todo-list.tsx` |

The run verified that each capture call is placed only in its corresponding successful API-response branch. It did **not** run the app in a browser or observe events arriving in PostHog, so event delivery and runtime volume remain unconfirmed. Events intentionally contain no todo IDs, titles, descriptions, or other user-entered content.

## User identification

Identification was skipped. The application has no authentication flow, session, user model, or stable user identifier. Todo IDs identify resources, not users, and must not be used as PostHog distinct IDs. Events are therefore currently personless. If authentication is added later, identify after login/registration, restore identification on an already-authenticated page load, and reset on logout.

## Error tracking

Added `app/global-error.tsx` as a client global error boundary. It reports the boundary error once with `posthog.captureException(error)` and provides the Next.js reset UI. No runtime error was intentionally triggered or observed during this run.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1918268)

The dashboard contains three tagged insights: daily todo creation, completion changes by completed state, and an ordered todo lifecycle funnel from creation through completion change to deletion. The insights may initially render empty until events arrive.

## Verification and conflicts

- `pnpm install` completed successfully with a current lockfile.
- `pnpm build` completed successfully, including compilation, linting, type validation, static page generation, and trace collection.
- No separate type-check or lint script is defined; `next build` performed those checks.
- No runtime browser delivery test was performed, so the run verified compilation and code placement, not that events flow to PostHog.
- **Build conflict (full):** Non-blocking Next.js warning: it inferred a workspace root from a parent `pnpm-lock.yaml` and detected this project's additional lockfile; build completed successfully.

## Next steps

1. Set `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` in every deployment environment, not only local `.env`; keep the names aligned with `.env.example`.
2. Run the app and create, complete/uncomplete, and delete a todo; confirm the three named events arrive in PostHog and populate the dashboard.
3. Run the project's test suite and update mocks or fixtures if the instrumented client handlers require it.
4. If authentication is introduced, add stable-user identification and logout reset at the authentication boundaries before relying on person-level analysis.
5. If the workspace-root warning is undesirable, review the parent and project lockfile layout used by the deployment build.

## Before you merge

- [ ] Run a full production build and fix any lint or type errors introduced by the integration; the wizard verified `pnpm build`, with the workspace-root warning noted above (`package.json`, build configuration if changed).
- [ ] Run the test suite and update any mocks or fixtures affected by the new capture calls (`components/todos/todo-list.tsx`).
- [ ] Confirm `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` are set in each deploy environment, not just local `.env` (`.env.example`, `instrumentation-client.ts`).
- [ ] Exercise the todo mutations in a running browser and verify `todo_created`, `todo_completion_changed`, and `todo_deleted` arrive in PostHog (`components/todos/todo-list.tsx`).
- [ ] If authentication is added before merge, wire stable-user identification and returning-session restoration; no auth exists in the current app (`instrumentation-client.ts`, future authentication boundary).
