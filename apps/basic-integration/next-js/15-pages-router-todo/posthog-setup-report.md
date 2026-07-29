# PostHog setup report

PostHog was installed and initialized for the Next.js 15 Pages Router app, with anonymous todo-product events, client error tracking, and a starter dashboard configured.

## What was installed and initialized

- Installed `posthog-js` 1.408.0 and `posthog-node` 5.46.1 with pnpm; the versions are recorded in `package.json` and `pnpm-lock.yaml`.
- Added browser initialization in `instrumentation-client.ts` using the `posthog-js` singleton and the environment variables `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`.
- The initialization keeps PostHog defaults, initializes once, and uses the configured environment values. The real values were set in `.env`; `.env.example` documents the required variable names.
- No server-side PostHog client or server-side duplicate captures were added.

## Events instrumented

These captures are implemented after successful client-side API mutations. The run did **not** observe events arriving in PostHog, so event delivery remains unconfirmed.

| Event | What it measures | File |
|---|---|---|
| `todo_created` | A visitor successfully creates a todo item. | `components/todos/todo-list.tsx` |
| `todo_completion_changed` | A visitor successfully marks a todo complete or incomplete. | `components/todos/todo-list.tsx` |
| `todo_deleted` | A visitor successfully deletes a todo item. | `components/todos/todo-list.tsx` |

Event properties are limited to non-PII behavioral context. Todo IDs, titles, and descriptions are not sent.

## Identification

User identification was skipped. The application has no login, registration, session, account, or user model, and todo IDs identify resources rather than people. Events and client errors therefore remain anonymous. If authentication is added later, identify the authenticated stable user ID after login or registration and reset on logout; do not use a todo ID or raw PII as the person identity.

## Error tracking

Client-side global exception autocapture was enabled with `capture_exceptions: true` in `instrumentation-client.ts`, feeding PostHog Error Tracking. Server-side API exception handling was not added. The run did not trigger an exception and therefore did not verify an error arriving in PostHog.

## Dashboard

The dashboard **Analytics basics (wizard)** was created with three tagged insights: todo creation trends, completion-state breakdown trends, and a todo lifecycle funnel. The insights use the intended event names and may be empty until events arrive.

[Open the Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1926620)

## What the run verified

- `pnpm install` completed successfully and installed the declared PostHog SDK dependencies.
- `pnpm build` completed successfully, including Next.js type validation, static page generation, and output finalization.
- Capture calls are positioned after successful POST, PATCH, and DELETE responses, so failed mutations are not intentionally recorded.
- The dashboard and its three insights exist in PostHog.

## What the run did not verify

- No browser interaction or live PostHog ingestion was observed. The run cannot confirm that `todo_created`, `todo_completion_changed`, `todo_deleted`, or client exceptions arrive in PostHog.
- No authenticated identity exists to verify. Attribution remains anonymous by design.
- No standalone lint or test command was run; the project has no package lint or standalone typecheck script recorded by the review step.

## Build conflict

The production build passed. The only issue was a non-blocking Next.js warning that it inferred the ancestor workspace root because it found multiple lockfiles. This did not affect compilation, type validation, static page generation, or output finalization.

## Before you merge

- [ ] Run a full production build again and fix any lint or type errors introduced by the integration; the current verification was `pnpm build` and reported only the non-blocking multiple-lockfile workspace-root warning. Review `instrumentation-client.ts` and `components/todos/todo-list.tsx` if errors appear.
- [ ] Run the test suite and update any mocks or fixtures affected by the PostHog import or capture calls in `components/todos/todo-list.tsx`.
- [ ] Confirm `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` from `.env.example` are configured in every deployment environment, not only locally; review `instrumentation-client.ts` and deployment configuration.
- [ ] Exercise create, completion-change, and delete flows in a deployed or local environment and confirm the three events arrive in the linked dashboard; inspect the capture calls in `components/todos/todo-list.tsx`.
- [ ] Trigger a client exception in a safe test environment and confirm Error Tracking receives it; inspect `capture_exceptions: true` in `instrumentation-client.ts`.
