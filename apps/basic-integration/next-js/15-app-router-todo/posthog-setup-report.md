# PostHog Setup Report

PostHog is fully integrated into this Next.js 15 App Router todo app — client and server analytics, error tracking, and a complete event plan are all wired up and the build is clean.

---

## What was installed

| Package | Version | Purpose |
|---|---|---|
| `posthog-js` | 1.387.0 | Client-side analytics and error capture |
| `posthog-node` | 5.38.0 | Server-side event capture in API routes |

Installed via **pnpm**. Build passed in 5.9 s with no TypeScript or lint errors.

---

## How PostHog was initialized

**Client (`lib/posthog.ts`)** — `initPostHog()` calls `posthog.init()` with the public token and host from env vars, guarded by a `typeof window` check so it only runs in the browser. `capture_exceptions: true` is set so JS errors are autocaptured.

**Provider (`app/PostHogProvider.tsx`)** — A `'use client'` wrapper component calls `initPostHog()` on mount via `useEffect`.

**Layout (`app/layout.tsx`)** — `PostHogProvider` wraps the app's children so initialization fires once on first page load.

**Server (`lib/posthog-server.ts`)** — A `posthog-node` client configured with `flushAt: 1` and `flushInterval: 0` for serverless (each API route call flushes immediately and shuts down).

**Environment variables** (written to `.env.local`):

```
NEXT_PUBLIC_POSTHOG_KEY=sTMFPsFhdP1Ssg
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

---

## Events instrumented

| Event | What it measures | File |
|---|---|---|
| `todo_created` | User submits the form to create a new todo | `components/todos/todo-list.tsx` |
| `todo_completed` | User checks a todo as done | `components/todos/todo-list.tsx` |
| `todo_reopened` | User unchecks a completed todo | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo via the trash icon | `components/todos/todo-list.tsx` |
| `todo_api_created` | Server confirms a new todo persisted (POST `/api/todos`) | `app/api/todos/route.ts` |
| `todo_api_updated` | Server confirms a todo update (PATCH `/api/todos/[id]`) | `app/api/todos/[id]/route.ts` |
| `todo_api_deleted` | Server confirms a todo deletion (DELETE `/api/todos/[id]`) | `app/api/todos/[id]/route.ts` |

Client events carry enriching properties (e.g. `todo_id`, `was_completed`, `total_todos`). Server events use `distinctId: 'server'`.

---

## User identification

**Skipped.** This app has no authentication, login/signup flow, or user concept — it is an anonymous in-memory todo list. No `posthog.identify()` call was added.

**When you add auth:** call `posthog.identify(userId, { email, name, ... })` on successful login/signup, and `posthog.reset()` on logout.

---

## Error tracking

Two layers are active:

1. **`capture_exceptions: true`** in `posthog.init()` — autocaptures unhandled JS exceptions (`window.onerror`) and unhandled promise rejections.
2. **`app/global-error.tsx`** — Next.js App Router's global React error boundary. On mount it calls `posthog.captureException(error)` to forward any React render errors to PostHog.

---

## Dashboard

View your live data in PostHog:

- [Project events](https://us.posthog.com/project/2/events) — see incoming events in real time
- [Error tracking](https://us.posthog.com/project/2/error_tracking) — view captured exceptions

---

## Build

No conflicts. `pnpm build` compiled all 6 pages successfully in 5.9 s. TypeScript and lint checks passed. `pnpm-lock.yaml` has been updated.

---

## Next steps

1. **Run the app** and interact with todos — open the PostHog [Live Events](https://us.posthog.com/project/2/events) view to confirm events are arriving.
2. **Add user identification** when you introduce authentication. Call `posthog.identify()` on login and `posthog.reset()` on logout.
3. **Build a dashboard** in PostHog to track todo creation trends, completion rates, and delete frequency — the 7 instrumented events give you everything you need.
4. **Set up alerts** on error tracking if you want to be notified when exceptions spike.
5. **Consider server-side person association**: the current server events use `distinctId: 'server'`. If you add auth, replace this with the authenticated user's ID so server and client events are linked to the same person.
