# PostHog setup report

PostHog was installed and initialized for the Nuxt 3.6 app with four product events, centralized Vue error capture, and a starter dashboard.

## What was installed and initialized

- Installed `posthog-js` `^1.407.3` and `posthog-node` `^5.46.1` with pnpm; the lockfile resolves those versions.
- Added environment-backed public runtime configuration in `nuxt.config.ts` for `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST`.
- Added the browser-only `plugins/posthog.client.ts` plugin. It initializes the shared `posthog-js` client, enables tracing headers, exposes it as `$posthog`, and guards missing configuration so production remains a no-op while development reports missing configuration.
- `.env.example` documents the required variable names. The real values were configured locally in `.env`; deploy environments still need their own configuration.
- No server-side capture call sites were added; `posthog-node` is installed but currently unused.
- Default capture behavior was retained, including autocapture and session recording. No application CSP was found or changed.

## Events instrumented

| Event | What it measures | File |
|---|---|---|
| `user_logged_in` | A visitor successfully completes the demo sign-in flow. | `pages/login.vue:15` |
| `user_logged_out` | An authenticated visitor initiates sign-out. | `components/NavBar.vue:6` |
| `search_submitted` | A visitor runs a movie or TV search without recording query text. | `pages/search.vue:19` |
| `media_opened` | A visitor selects a movie or TV title from a media card. | `components/media/Card.vue:12` |

These are planned and instrumented call sites. The run did **not** observe events arriving in PostHog, so event delivery and dashboard population remain unconfirmed.

## Identification status

User identification was skipped. The demo authentication model exposes only a mutable username and does not provide a durable primary key or UUID. No unsafe username-based distinct ID or placeholder was introduced. Logout does call `reset()` after the logout capture (`components/NavBar.vue:7`).

### Follow-up issue: stable attribution unresolved

Before these events can reliably represent authenticated users, authentication must expose and persist a stable identifier. The unresolved integration cost is fragmented anonymous attribution: login, search, media, and logout activity cannot currently be tied to a durable user. The future identity change must update `composables/useAuth.ts` and `server/api/auth/login.post.ts`, then identify after login and session restoration and reset before logout state is cleared.

## Error tracking

`plugins/posthog.client.ts:28-29` registers Nuxt’s global `vue:error` hook and calls `captureException(error)`. The run verified that this centralized client-side Vue/component error handler exists. No server-side error handler was added, and no exception arrival was observed in PostHog.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1914276)

The dashboard was created with four wizard-tagged insights: User activity trend, Search engagement trend, Media selection trend, and Login to search funnel. The dashboard and tiles were created successfully; the run did not verify incoming event data.

## Verification and known conflicts

- `pnpm install` completed successfully.
- `pnpm build` completed successfully and generated Nitro output.
- `pnpm typecheck` remains blocked by a pre-existing error in `proxy/nitro.config.ts`: `nitropack` does not export `defineNitroConfig`.
- `pnpm lint` remains blocked by pre-existing violations in `composables/useAuth.ts`, `middleware/auth.global.ts`, and `server/api/auth/login.post.ts`, plus pre-existing template whitespace/void-element warnings in `pages/login.vue`. Review found no integration-plugin or media-card lint violations.
- The run verified source wiring and build behavior only. It did not verify that any event, exception, session, or dashboard result was received by PostHog.

## Before you merge

- [ ] Run a full production build in the deployment environment and confirm the PostHog variables `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` are set from `.env.example` names, not only in local `.env` (`nuxt.config.ts:24-28`).
- [ ] Run the test suite and update mocks or fixtures for the four capture calls in `pages/login.vue:15`, `components/NavBar.vue:6-7`, `pages/search.vue:19`, and `components/media/Card.vue:12` if needed.
- [ ] Resolve the pre-existing typecheck conflict in `proxy/nitro.config.ts` and lint failures in `composables/useAuth.ts`, `middleware/auth.global.ts`, `server/api/auth/login.post.ts`, and the existing login template warnings.
- [ ] Add a durable user identifier in `composables/useAuth.ts` and `server/api/auth/login.post.ts`, then wire identify on login and session restoration before treating authenticated analytics as user-attributed.
- [ ] Exercise login, logout, search, media selection, and a Vue error in a real browser and confirm the corresponding events/errors arrive in PostHog; the wizard did not observe delivery.
