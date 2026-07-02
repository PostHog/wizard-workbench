# PostHog post-wizard report

The wizard added lightweight PostHog instrumentation to both client and server parts of the Next.js App Router todo application. Changes focused on capturing meaningful product events (create/toggle/delete) at the UI and server API boundaries so front-end interactions and back-end operations can be correlated.

Table of events added

- todo_created — A user created a new todo item — app/api/todos/route.ts
- todo_toggled — A user toggled a todo's completed state — app/api/todos/[id]/route.ts
- todo_deleted — A user deleted a todo — app/api/todos/[id]/route.ts
- todo_add_clicked — A user submitted the add todo form (client-side) — components/todos/todo-form.tsx
- todo_toggle_clicked — A user clicked the checkbox to toggle a todo (client-side) — components/todos/todo-item.tsx
- todo_delete_clicked — A user clicked the delete button for a todo (client-side) — components/todos/todo-item.tsx

Files changed

- components/todos/todo-form.tsx: added client-side capture for todo_add_clicked
- components/todos/todo-item.tsx: added client-side capture for todo_toggle_clicked and todo_delete_clicked
- app/api/todos/route.ts: added server-side capture of todo_created using posthog-node
- app/api/todos/[id]/route.ts: added server-side captures for todo_toggled and todo_deleted using posthog-node
- .posthog-events.json: created to record planned events (now removed by the wizard)
- .env.local: set NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN and NEXT_PUBLIC_POSTHOG_HOST

Dashboard and insights created

- Dashboard: Analytics basics (wizard)
  - URL: https://us.posthog.com/project/228144/dashboard/1793334

Insights created on the dashboard (examples)

- Todo creations over time — https://us.posthog.com/project/228144/insights/luuos2He
- Todos created vs deleted — https://us.posthog.com/project/228144/insights/XZffB5yW
- Client-side interactions (add/toggle/delete) — https://us.posthog.com/project/228144/insights/pHU4LSXX
- Todo creation funnel (add clicked → todo_created) — https://us.posthog.com/project/228144/insights/vUpsIgAj
- Unique todos created (30d) — https://us.posthog.com/project/228144/insights/CRtQBst2
- Overview: events last 30 days — https://us.posthog.com/project/228144/insights/W0fh5ufE
- Top event properties: todo_created — https://us.posthog.com/project/228144/insights/qN3vHCIz

Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names added (NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN, NEXT_PUBLIC_POSTHOG_HOST) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

Notes and recommendations

- The client-side code uses dynamic require() to avoid runtime errors when posthog-js is not yet initialized; consider adding a central instrumentation-client.ts for consistent init per the example project's guidance.
- Server-side code creates a PostHog client per request path when capturing; for performance, consider instantiating a singleton PostHog client (lib/posthog-server.ts) and reusing it across handlers.
- The integration captures basic properties (todo_id, title_length). Add richer properties (user id when available, source, UI context) when authentication is added to the app.

Agent skill folder

- The installed skill folder remains under .claude/skills/integration-nextjs-app-router for reference.
