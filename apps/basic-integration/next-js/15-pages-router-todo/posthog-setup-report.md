# PostHog setup report

PostHog product analytics and exception tracking were added to the Next.js Pages Router todo app, with a starter dashboard for todo activity.

## Installed and initialized

- Installed `posthog-js` 1.407.5 and `posthog-node` 5.46.1 with pnpm; `package.json` and `pnpm-lock.yaml` were updated.
- Browser initialization is centralized in `instrumentation-client.ts`. It reads `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`, initializes `posthog-js` with the configured host, defaults, exception capture, and development debugging, and fails loudly in non-production when configuration is missing. Production safely remains a no-op when unconfigured.
- The documented environment keys are in `.env.example`; the real values were written to `.env.local` through wizard tooling. The run confirmed both keys were present, but deployment configuration was not verified.
- No provider or second browser initialization was added.

## Events instrumented

These captures are placed after successful API responses in `components/todos/todo-list.tsx`; the run did not observe events arriving in PostHog, so event delivery remains unconfirmed.

| Event | What it measures | File |
|---|---|---|
| `todo_created` | A todo was successfully created; includes the initial completion state. | `components/todos/todo-list.tsx` |
| `todo_completion_toggled` | A todo was successfully marked complete or active; includes the resulting completion state. | `components/todos/todo-list.tsx` |
| `todo_deleted` | A todo was successfully deleted. | `components/todos/todo-list.tsx` |

The events intentionally contain no todo title, description, or other user-entered content. No placeholder distinct ID was added.

## Identification

User identification was skipped. The app has no authentication, session, account, or user model; its API operates on a shared in-memory todo list. Fabricating an identifier would incorrectly attribute shared activity. If authentication is introduced later, identify at the real login/refresh boundary with the stable user primary key and reset on logout.

## Error tracking

- Browser uncaught exception capture is enabled through `capture_exceptions` in `instrumentation-client.ts`.
- `pages/_error.tsx` captures server-side/page errors with `posthog-node`, using environment configuration, `enableExceptionAutocapture`, and awaited shutdown.
- The run did not trigger an error and therefore did not observe an exception arriving in PostHog.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1919766)

The dashboard (ID 1919766) and four tagged insights were created successfully: creation trend, completion-toggle trend broken down by `completed`, deletion trend, and a creation-to-completion funnel. The dashboard is expected to populate as events arrive; its current data state was not verified.

## What the run verified

- pnpm installation completed successfully with the stated SDK versions.
- The final `pnpm build` passed compilation, Next.js type validation/linting, static generation, and trace collection.
- The review confirmed the server-only loading fix prevents `posthog-node` Node built-ins from entering the browser error-page bundle.
- The dashboard and four insights were created successfully in PostHog.

## What remains unconfirmed

- No browser or production interaction was run, so event delivery, event properties in received payloads, and dashboard population were not observed.
- No exception was triggered, so end-to-end error delivery was not observed.
- No test suite was run.
- Deployment environment variables were not verified beyond the local `.env.local` keys.

## Issues to follow up

- **No stable user attribution:** `components/todos/todo-list.tsx` captures personless events because no stable user identity exists. If the app is later given authentication, leaving this unresolved means todo activity cannot be reliably attributed to users; add identification at the actual auth boundary rather than inventing an ID.
- **Server error identity is anonymous:** `pages/_error.tsx` has no user model or stable distinct ID available. Server exceptions therefore remain anonymous until a real identity context exists.

## Before you merge

- [ ] Run a full production build and fix any lint or type errors introduced by the generated integration; the wizard build passed, but this should be repeated in the merge environment (`package.json`, `instrumentation-client.ts`, `components/todos/todo-list.tsx`, and `pages/_error.tsx`).
- [ ] Run the test suite and update any mocks or fixtures affected by the capture calls (`components/todos/todo-list.tsx`).
- [ ] Set `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` in every deployment environment, not only `.env.local`; verify the names documented in `.env.example`.
- [ ] Exercise create, toggle, and delete in a real browser and confirm `todo_created`, `todo_completion_toggled`, and `todo_deleted` arrive in PostHog and populate the dashboard (`components/todos/todo-list.tsx`, dashboard link above).
- [ ] Trigger a representative client and server error in a deployed environment and confirm exception events arrive (`instrumentation-client.ts`, `pages/_error.tsx`).

## Build conflict

The review reported two warnings: pnpm warned that some dependency build scripts were ignored, and Next.js warned about an outer workspace lockfile. Neither prevented the final build, and neither was attributed to the PostHog integration.
