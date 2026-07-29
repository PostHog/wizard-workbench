# PostHog setup report

**Summary:** PostHog browser analytics, anonymous interaction events, React error tracking, and a starter dashboard were added to the React Router app.

## Installed and initialized

- Installed `posthog-js` `1.407.8` and `@posthog/react` `1.10.3` with pnpm; both are recorded in `package.json` and `pnpm-lock.yaml`.
- `app/lib/posthog.ts` is the single initialization module. It reads `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` from Vite environment variables, initializes `posthog-js` once with default capture behavior, and throws a development-time configuration error when either key is missing while remaining a production no-op.
- `app/root.tsx` imports the shared client and mounts `PostHogProvider` plus a global `PostHogErrorBoundary` around the header, route content, and footer.
- The environment keys are present locally and documented in `.env.example`. Their values were not read by the run.

## Events instrumented

These are planned/instrumented call sites from `.posthog-wizard-cache/.posthog-events.json`. The run did **not** observe events arriving in PostHog; the dashboard was created ahead of traffic and may initially be empty.

| Event | What it measures | File |
|---|---|---|
| `post_liked` | A visitor likes a feed post. | `app/components/PostCard.tsx` |
| `post_unliked` | A visitor removes a like from a feed post. | `app/components/PostCard.tsx` |
| `follower_package_selected` | A visitor selects a fake follower package before purchasing. | `app/routes/buy-followers.tsx` |
| `follower_purchase_completed` | A visitor completes the simulated fake follower purchase. | `app/routes/buy-followers.tsx` |
| `follow_back_clicked` | A visitor follows back a listed follower. | `app/routes/profile.tsx` |

All captures use the shared client, occur in user-action handlers, use snake_case names, and avoid PII. The events are intentionally anonymous because no stable application-owned user ID exists.

## User identification

Identification was **skipped**. The app contains static demo data rather than authentication, login, registration, session hydration, account switching, or logout boundaries. The demo username is not a suitable stable distinct ID. No `identify()` or `reset()` wiring was added. If real authentication is introduced later, identify users after login and on known-user hydration, and reset on logout or direct account switching.

### Unresolved issue: attribution

The app has no stable user identity, so events cannot currently be attributed to application users or joined reliably across authenticated sessions. If left unresolved, engagement and purchase analysis remains anonymous and user-level funnels may fragment. No `DISTINCT_ID` placeholder was added to any call site.

## Error tracking

`app/root.tsx` wraps the rendered application with `PostHogErrorBoundary` inside `PostHogProvider`. The installed React SDK routes `componentDidCatch` errors through `captureException`. No runtime error was deliberately triggered, so delivery of an error event was not observed.

## Verification and conflicts

- `pnpm install` completed successfully.
- `pnpm build` passed and produced client and SSR bundles.
- `pnpm typecheck` passed.
- Scoped ESLint completed with 0 errors and 29 warnings. The warnings were reported as existing formatting and unused-import warnings; the project lint script was not run because it applies fixes project-wide and could create unrelated churn.
- No browser/network delivery check was performed. A passing build proves compilation, not that events or errors reached PostHog.
- No CSP was found or changed in the reviewed app configuration.

**Build conflict:** There was no build or typecheck conflict. The only reported conflict is 29 non-blocking scoped-lint warnings: existing Prettier formatting across the three instrumented UI files plus pre-existing unused imports `WATERMARK` in `app/root.tsx` and `setFollowing` in `app/routes/profile.tsx`.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1924733)

The dashboard contains four insights covering post engagement, follower package selection, follow-back activity, and package-selection-to-purchase conversion. Its definitions use the instrumented event names and the last 30 days; initial empty results are expected until traffic arrives.

## Before you merge

- [ ] Set `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` in every deployment environment, not only `.env`; verify the names in `.env.example` and the reads in `app/lib/posthog.ts`.
- [ ] Run the full production build and fix any integration-related lint or type errors; the run verified `pnpm build` and `pnpm typecheck`, but did not prove runtime delivery. Review the PostHog wrapper in `app/root.tsx`.
- [ ] Run the test suite and update mocks or fixtures for the new captures in `app/components/PostCard.tsx`, `app/routes/buy-followers.tsx`, and `app/routes/profile.tsx`.
- [ ] In a real browser session, trigger each handler in `app/components/PostCard.tsx`, `app/routes/buy-followers.tsx`, and `app/routes/profile.tsx`, then confirm the five events arrive in PostHog and populate the dashboard.
- [ ] If authentication is added, wire stable-ID `identify()` and logout/account-switch `reset()` at those auth boundaries before relying on user-level attribution; no such boundary exists today.
- [ ] Review and optionally clean the 29 scoped ESLint warnings, especially the existing unused imports in `app/root.tsx` and `app/routes/profile.tsx`, without applying project-wide autofixes unintentionally.
