# PostHog setup report

PostHog was added to the client-only TanStack Router app, initialized once at the root route, and connected to four invoice/auth activity events plus exception autocapture.

## Installed and initialized

- Installed `@posthog/react` 1.10.3 with pnpm; `posthog-js` is available transitively.
- Added the shared configuration in `src/posthog.ts`, reading `VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST`.
- The root route in `src/main.tsx` uses `PostHogProvider` with that shared configuration. Missing configuration fails loudly in development and becomes a production no-op.
- Documented `VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST` in `.env.example`; the run recorded both real environment values as configured through wizard tools.

## Events instrumented

The run verified that these capture calls are present in existing action handlers. It did **not** observe events arriving in PostHog, so delivery and event volume remain unconfirmed.

| Event | What it measures | File |
|---|---|---|
| `demo_login_completed` | A visitor completes the demo sign-in flow. | `src/main.tsx` |
| `demo_logout_completed` | A signed-in visitor completes the demo sign-out flow. | `src/main.tsx` |
| `invoice_creation_submitted` | A user submits the form to create an invoice. | `src/main.tsx` |
| `invoice_update_submitted` | A user submits changes to an existing invoice; the event includes numeric `invoice_id` only. | `src/main.tsx` |

Event properties intentionally exclude usernames, invoice titles, descriptions, and other user-entered content.

## User identification

Identification was skipped. The demo auth state exposes only a mutable, user-entered username; it has no stable user ID, UUID, primary key, persisted session identity, or legitimate email suitable for a distinct ID. No `identify()` or `reset()` calls were added. Consequently, the four custom events are currently personless/anonymous from this integration's perspective. Once a stable authenticated ID exists, identify it once after login and reset on logout without using `auth.username`.

### Unresolved issue: stable attribution

A stable identity is unavailable at `src/main.tsx`'s login boundary. If this remains unresolved, events and exceptions cannot be reliably attributed to returning or authenticated users, and user-level funnels may fragment across anonymous IDs. Every custom event currently inherits the anonymous SDK identity rather than an identified user.

## Error tracking

Error tracking was already configured centrally: `src/posthog.ts` sets `capture_exceptions: true`, and the root provider consumes that configuration. No manual exception calls or additional boundaries were added. The run verified the option is present; it did not trigger an exception and observe an exception event arriving in PostHog.

## Dashboard

[Analytics basics (wizard) dashboard](https://us.i.posthog.com/project/483112/dashboard/1918356)

The dashboard contains three wizard-tagged insights: Invoice submissions over time, Login and logout activity, and Invoice workflow conversion. They use the four exact event names above and a 30-day date range; the run notes they may initially be empty until events arrive.

## Build and verification

- `pnpm install` completed and the lockfile was current.
- The initial production build exposed two TypeScript issues: an unnecessary direct `posthog-js` type import in `src/posthog.ts` could not resolve because the package is only transitively installed, and Vite's `import.meta.env` types were absent.
- Those two targeted issues were fixed by removing the direct type import and adding `vite/client` types in `tsconfig.json`.
- The subsequent `pnpm build` completed successfully: Vite produced the production bundle and `tsc --noEmit` passed. Vite emitted only its existing advisory about a chunk above 500 kB.
- No lint script or standalone typecheck script exists in `package.json`. No test suite was run or recorded. A passing build proves compilation, not that events flow.
- No Content-Security-Policy was present or changed.

## Before you merge

- [ ] Run the full production build again and fix any lint or type errors introduced in `src/posthog.ts`, `src/main.tsx`, or `tsconfig.json`.
- [ ] Run the test suite (if available in the deployment environment) and update mocks or fixtures for the four capture calls in `src/main.tsx`.
- [ ] Confirm `VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST` are set in every deploy environment, not only locally, matching `.env.example`.
- [ ] Exercise login, logout, invoice creation, and invoice update in a real browser and confirm the four named events arrive in PostHog; the run itself did not verify delivery.
- [ ] Resolve stable identity attribution at the login/logout code in `src/main.tsx` before adding `identify()` and `reset()`; do not use the mutable username as the distinct ID.
