# PostHog Setup Report

**PostHog product analytics, event capture, and error tracking were added to this Next.js 15 Pages Router todo app.**

---

## What was installed

| Package | Version |
|---|---|
| `posthog-js` | ^1.387.0 |
| `posthog-node` | ^5.36.0 |

Both packages were declared in `package.json` and resolved via `pnpm install`. The build was clean with no errors or warnings.

---

## Initialization

PostHog is initialized once in `pages/_app.tsx` via a `useEffect` hook on the client side. Environment variables are stored in `.env.local`:

```
NEXT_PUBLIC_POSTHOG_KEY=<your project key>
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

A singleton server-side client (`lib/posthog-server.ts`) wraps `posthog-node` with `flushAt: 1` and `flushInterval: 0` so events flush immediately on each API request without blocking the response.

---

## Events instrumented

| Event | What it measures | File |
|---|---|---|
| `todo_created` | User successfully creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks a todo item as completed | `components/todos/todo-list.tsx` |
| `todo_reopened` | User marks a completed todo item as incomplete | `components/todos/todo-list.tsx` |
| `todo_deleted` | User successfully deletes a todo item | `components/todos/todo-list.tsx` |
| `todo_create_failed` | Client-side error when creating a todo item | `components/todos/todo-list.tsx` |
| `todo_toggle_failed` | Client-side error when toggling a todo item | `components/todos/todo-list.tsx` |
| `todo_delete_failed` | Client-side error when deleting a todo item | `components/todos/todo-list.tsx` |
| `todo_created_api` | Server-side: todo successfully created via API | `pages/api/todos/index.ts` |
| `todo_validation_error` | Server-side: request body failed Zod validation | `pages/api/todos/index.ts` |
| `todo_updated_api` | Server-side: todo successfully updated via API | `pages/api/todos/[id].ts` |
| `todo_deleted_api` | Server-side: todo successfully deleted via API | `pages/api/todos/[id].ts` |

Client-side events include properties such as `has_description`, `title_length`, `total_todos`, and `todo_id` where relevant.

---

## User identification

**Skipped.** This app has no authentication layer — no login, signup, session management, or concept of a named user. There are no user IDs to identify. If you add auth later, call `posthog.identify(userId, { email, name })` after a successful login.

---

## Error tracking

A React `ErrorBoundary` class component was added directly in `pages/_app.tsx`. It wraps the entire `<Component {...pageProps} />` tree and calls `posthog.captureException(error, { componentStack })` in `componentDidCatch`. This is the single global handler for all uncaught rendering errors in the Pages Router.

No additional packages were required.

---

## Dashboard

No dedicated PostHog dashboard was created as part of this run. You can build one at [PostHog — Dashboards](https://us.posthog.com/project/2/dashboards) using the events above.

---

## Build

No conflicts. `pnpm build` (Next.js) compiled all 4 pages cleanly with no TypeScript errors or PostHog-related warnings.

---

## Next steps

1. **Start the app** and perform a few todo actions — create, complete, delete. Open the [PostHog Live Events](https://us.posthog.com/project/2/activity/live) view to confirm events are arriving.
2. **Add user identification** if you introduce authentication. Call `posthog.identify()` after login with a stable user ID and any traits (email, name, plan).
3. **Build a dashboard** in PostHog to track key metrics: creation rate, completion rate, and error frequency.
4. **Review error tracking** — the ErrorBoundary will surface React rendering crashes in [PostHog Error Tracking](https://us.posthog.com/project/2/error_tracking).
5. **Check `.env.local`** is excluded from version control (`.gitignore` should already cover it) before pushing.
