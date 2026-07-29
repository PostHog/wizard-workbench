# PostHog setup report

PostHog product analytics and client-side error tracking were added to the Nuxt application, with six action events instrumented and a starter dashboard created.

## What was installed and initialized

- Installed `posthog-js` `^1.408.0` and `posthog-node` `^5.46.1` in `package.json` using pnpm; the lockfile was updated and `pnpm install` completed successfully.
- Added public runtime configuration in `nuxt.config.ts` using `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST`.
- Added the browser-only initializer in `plugins/posthog.client.ts`. It calls `posthog.init()` once, uses the configured host, enables tracing headers, fails loudly in development when configuration is missing, and is a production no-op when configuration is absent.
- The configured environment keys were confirmed present in `.env`; their secret values are intentionally not reproduced here. The names are documented in `.env.example`.
- Components access the initialized client through `useNuxtApp().$posthog`.

## Events instrumented

These are instrumented call sites, not confirmed deliveries. The run did not start the application or observe events arriving in PostHog.

| Event | What it measures | File |
|---|---|---|
| `login_succeeded` | A visitor completes the demo sign-in flow successfully. | `pages/login.vue:16` |
| `user_logged_out` | An authenticated visitor initiates logout. | `components/NavBar.vue:6` |
| `search_submitted` | A visitor submits a non-empty movie or TV search. | `pages/search.vue:20` |
| `media_selected` | A visitor selects a movie or TV title from a listing or carousel; includes `media_id` and `media_type`. | `components/media/Card.vue:12` |
| `video_played` | A visitor opens a media video to play it; includes `video_type`. | `components/video/Card.vue:12` |
| `photo_viewed` | A visitor opens a media image in the photo viewer; includes `photo_type`. | `components/media/Photos.vue:12` |

The capture handoff confirms these calls are inside the relevant submit, click, or action handlers. Event properties intentionally exclude usernames, search terms, titles, and other user-entered content.

## Identification status

User identification was **skipped**. The authentication state exposes only a username, and the run did not find an approved stable, non-PII account identifier. No `identify()` or `reset()` wiring was added, and the events currently use the browser's anonymous identity.

This remains an unresolved issue: until authentication exposes a stable non-PII user ID to the browser, events cannot be reliably attributed to accounts or joined across authenticated sessions. Do not substitute the username. When such an ID exists, wire identification after successful login and during session restoration, and reset on logout.

## Error tracking

`plugins/posthog.client.ts:28-34` forwards both Nuxt `vue:error` and `app:error` hook errors to `posthogClient.captureException`. Error handling is centralized in the client plugin; no manual component or route wrappers were added.

## Dashboard

The starter dashboard `Analytics basics (wizard)` was created with five insights covering authentication activity, search engagement, media selection, video/photo engagement, and a search-to-media-selection funnel. The definitions use the planned event names and are ready for future data arrival.

[Open the Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1926626)

The dashboard may initially show no data. The run did not verify event delivery or current dashboard data.

## Verification and conflicts

Verified by the run:

- `pnpm install` completed successfully with the lockfile current.
- `pnpm build` passed and produced the Nitro server bundle.
- Integration-specific plugin typecheck and lint issues were fixed; the plugin and manifest no longer report integration-caused errors.
- The dashboard and five attached insights were created successfully by PostHog MCP.

Not verified by the run:

- No browser session or running app was used to confirm that any of the six events arrived in PostHog.
- No identification flow was verified because no eligible stable ID exists.
- No tests were run.

Build and validation conflicts, in full: `pnpm typecheck` remains blocked by a pre-existing `proxy/nitro.config.ts` error because it imports a non-exported `defineNitroConfig` from `nitropack`. Full lint remains blocked by pre-existing style errors in `composables/useAuth.ts`, `middleware/auth.global.ts`, `pages/login.vue`, and `server/api/auth/login.post.ts`; `NavBar.vue` has attribute-order warnings. These issues are outside the PostHog integration changeset. The production build itself passed.

## Before you merge

- [ ] Run the full production build again in the target checkout and fix any errors introduced by generated integration code.
- [ ] Run the test suite; instrumented handlers may require updated mocks or fixtures.
- [ ] Set `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` in every deployment environment, not only local `.env`; verify the names against `.env.example` and `nuxt.config.ts:25-26`.
- [ ] Resolve the pre-existing typecheck conflict in `proxy/nitro.config.ts` and the pre-existing lint errors in `composables/useAuth.ts`, `middleware/auth.global.ts`, `pages/login.vue`, and `server/api/auth/login.post.ts` before treating validation as fully green.
- [ ] After deployment, exercise the handlers and confirm the six planned events appear in PostHog; this run only verified instrumentation, not delivery.
- [ ] If account-level attribution is required, expose a stable non-PII account ID and update the login/session-refresh/logout boundaries before relying on user-level analytics.
