# PostHog setup report

PostHog browser analytics, anonymous product-event tracking, React error tracking, and a starter dashboard were added to the React Router app.

## What was installed and initialized

- Installed `posthog-js` 1.407.3 and `@posthog/react` 1.10.3 with pnpm.
- Configured `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` in the local environment, and documented the variable names in `.env.example`.
- Added the singleton in `app/lib/posthog.ts`. The final implementation initializes the browser-only SDK dynamically, guards capture until initialization, and keeps production working as a no-op when configuration is absent while reporting missing configuration during development.
- The root integration dynamically loads the React PostHog provider and error boundary after hydration, avoiding browser SDK imports in the SSR bundle.

## Events instrumented

These four events were added to direct user action handlers. The run verified that the calls exist in source; it did **not** observe any events arriving in PostHog.

| Event | What it measures | File |
|---|---|---|
| `follower_package_selected` | A visitor selects a fake follower package before purchase. | `app/routes/buy-followers.tsx` |
| `fake_followers_purchase_completed` | A visitor completes the simulated follower purchase and local follower totals are updated. | `app/routes/buy-followers.tsx` |
| `post_like_toggled` | A visitor likes or removes a like from a feed post. | `app/components/PostCard.tsx` |
| `follow_back_toggled` | A visitor starts or stops following a suggested bot account. | `app/routes/profile.tsx` |

The events intentionally remain anonymous. No event capture was observed during this run, so delivery and resulting event properties remain unconfirmed.

## User identification

Identification was skipped. The app contains only a static demo persona and no authentication flow, serialized session, or stable application-owned user identifier. The mutable/display username was not used as a distinct ID. If real authentication is added, identify a stable non-PII user ID after login and on authenticated hydration, and reset on logout.

## Error tracking

`app/root.tsx` now mounts `PostHogProvider` and `PostHogErrorBoundary` around the application transition tree. This is intended to send uncaught React render/lifecycle errors to PostHog Error Tracking. The run verified the integration compiles and builds; it did not trigger an application error or observe an error event arriving.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1914307)

The dashboard contains five wizard-tagged insights: daily trends for the four events above and a package-selection-to-purchase conversion funnel. The dashboard and insight definitions were created successfully, but they may be empty because the run did not observe these events.

## Verification and unresolved issues

- `pnpm typecheck` passed.
- `pnpm build` passed and produced client and server bundles after the SSR safety fix.
- The lint script was not run because it is configured with `--fix` and could not be safely scoped under the task constraints.
- No application Content-Security-Policy was found, so no CSP change was made.
- No build conflict remained after dependencies were installed and the browser-only initialization issue was fixed.
- Event delivery was not verified. This costs confidence that the configured deployment environment, SDK network requests, and production event ingestion are working.
- Attribution was not resolved because no stable user ID exists. If left unresolved after authentication is introduced, events will remain anonymous and user journeys will fragment across anonymous IDs.

## Next steps

1. Configure both PostHog environment variables in every deployment environment, not only the local `.env`; keep the exact names shown in `.env.example`.
2. Exercise each instrumented action in a real browser and confirm all four event names arrive in project 483112 and populate the dashboard.
3. Add identification only when the app has a stable non-PII authenticated user ID; wire login, authenticated hydration, account switching, and logout behavior as described above.
4. Trigger a representative React error in a safe environment and confirm it appears in PostHog Error Tracking.
5. Run the test suite and address any mocks or fixtures affected by the new capture calls.
6. Run the configured lint command in the project’s normal development workflow and review any generated-code issues before merging.

## Before you merge

- [ ] Run a full production build and fix any lint or type errors introduced by the integration; this run passed `pnpm build` and `pnpm typecheck`, but the lint script was not run.
- [ ] Run the test suite; instrumented action handlers may need updated mocks or fixtures.
- [ ] Confirm `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` are present in `.env.example` and configured in each deploy environment, not just locally.
- [ ] In `app/routes/buy-followers.tsx`, `app/components/PostCard.tsx`, and `app/routes/profile.tsx`, trigger each action and confirm the corresponding events arrive in PostHog; source presence alone does not prove delivery.
- [ ] If authentication is added before merge, wire stable-ID identification on login and authenticated hydration, plus `reset()` on logout, instead of using the demo persona.
