# PostHog setup report

PostHog analytics, error tracking, and a starter todo analytics dashboard were added to the Next.js Pages Router application.

## Installed and initialized

- Installed `posthog-js` 1.407.2 and `posthog-node` 5.46.1 with pnpm; the dependency manifest and lockfile were updated.
- Added `instrumentation-client.ts` to initialize the browser singleton once using `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`.
- Added the corresponding public configuration names to `.env.example` and configured the real values in `.env` through the environment tooling.
- The initialization retains the documented defaults, exception capture, and development debugging. Missing configuration is reported during development and production becomes a no-op.
- Browser ingestion uses the configured PostHog host directly. No reverse proxy or CSP change was added.

## Instrumented events

These are the events recorded in `.posthog-wizard-cache/.posthog-events.json`. The run verified that each capture is in the matching successful todo API response path; it did not observe events arriving in PostHog.

| Event | What it measures | File |
|---|---|---|
| `todo_created` | A visitor successfully creates a todo; includes the non-PII `has_description` property. | `components/todos/todo-list.tsx` |
| `todo_completion_changed` | A visitor successfully marks a todo complete or active; includes the `completed` property. | `components/todos/todo-list.tsx` |
| `todo_deleted` | A visitor successfully deletes a todo. | `components/todos/todo-list.tsx` |

Captures are intentionally personless. Todo titles, descriptions, and IDs are not sent as event properties because they are user-entered content or resource identifiers.

## User identification

Identification was skipped. The application has no login, registration, logout, session, account, or user model; its only persisted domain model is an in-memory Todo. Todo IDs are not user identities. If authentication is added later, identify after successful login or registration with the stable authenticated user key and reset on logout.

## Error tracking

Added `pages/_error.tsx` as the global Pages Router error boundary. It dynamically loads the browser-only `posthog-js` client and calls `captureException` once for uncaught page-rendering errors while preserving Next.js error rendering. API route error handling was not modified.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1902648)

The dashboard contains four tagged insights: creation trend, completion-change trend broken down by `completed`, deletion trend, and a todo creation-to-completion funnel. The insights may initially be empty until events arrive.

## What the run verified

- pnpm installation completed successfully and dependencies were present.
- `pnpm build` completed successfully after the review corrected a nullability issue in `pages/_error.tsx`; compilation, linting/type validation, static generation, and trace collection passed.
- The dashboard and all four insights were created in PostHog project 483112.
- The event plan matches the three implemented browser capture names and source file.

## What the run did not verify

- No event delivery or event arrival in PostHog was observed. Exercise create, completion-change, and delete in the running application and confirm the events in PostHog.
- Tests were intentionally not run, and there is no standalone lint or typecheck script in `package.json`.
- Error events were not deliberately triggered and observed in PostHog.
- Production source-map upload is not configured, so production stack traces may remain minified.

## Build conflict

Next.js emits a pre-existing workspace-root warning because multiple pnpm lockfiles are present. The build succeeds and the warning does not affect PostHog integration behavior.

## Next steps

1. Set `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` in every deployment environment, not only the local `.env` file.
2. Run the application and perform create, completion-change, and delete actions; confirm all three events arrive in PostHog and populate the dashboard.
3. Trigger a representative page-rendering error and confirm Error Tracking receives it.
4. Decide whether to add source-map uploading to CI for readable production stack traces.
5. Add authentication-aware `identify` and logout `reset` only when the application gains a real stable user identity.

## Before you merge

- [ ] Run a full production build and fix any lint or type errors introduced by the generated integration; review `instrumentation-client.ts` and `pages/_error.tsx`.
- [ ] Run the test suite and update mocks or fixtures for the captures in `components/todos/todo-list.tsx`.
- [ ] Confirm `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` from `.env.example` are configured in each deployment environment; inspect `instrumentation-client.ts` for the exact names.
- [ ] Exercise the three handlers in `components/todos/todo-list.tsx` and confirm `todo_created`, `todo_completion_changed`, and `todo_deleted` arrive in PostHog.
- [ ] If production browser bundles are minified, wire source-map upload into CI so errors captured by `pages/_error.tsx` can be de-minified.
