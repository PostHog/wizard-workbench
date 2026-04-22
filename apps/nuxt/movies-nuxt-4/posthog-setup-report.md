<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Nuxt Movies application. The `@posthog/nuxt` module was installed and configured, providing automatic client-side and server-side event tracking, session replay, and error capture. A `server/utils/posthog.ts` utility was created for shared server-side PostHog access. Environment variables are stored in `.env`.

## Changes summary

- **`nuxt.config.ts`** — Added `@posthog/nuxt` to modules, configured `runtimeConfig.public.posthog`, and added `posthogConfig` with `capture_exceptions: true` (client) and `enableExceptionAutocapture: true` (server).
- **`server/utils/posthog.ts`** — New singleton utility exposing `useServerPostHog()` for server routes.
- **`.env`** — Added `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST`.

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logs in; PostHog identity set via `posthog.identify()`. | `pages/login.vue` |
| `login_failed` | Login attempt fails; includes `error_message` property. | `pages/login.vue` |
| `user_logged_out` | User clicks logout; PostHog identity reset via `posthog.reset()`. | `components/NavBar.vue` |
| `media_viewed` | User opens a movie or TV show detail page; includes `media_type`, `media_id`, `media_title`. | `pages/[type]/[id].vue` |
| `search_performed` | User executes a search; includes `query`. | `pages/search.vue` |
| `video_played` | User plays a video/trailer; includes `video_name`, `video_type`. | `components/video/Card.vue` |
| `person_viewed` | User opens a person/cast detail page; includes `person_id`, `person_name`. | `pages/person/[id].vue` |
| `category_browsed` | User navigates to a media category listing; includes `category`, `media_type`. | `pages/[type]/category/[query].vue` |
| `server_login` | Server-side login event with session correlation headers. | `server/api/auth/login.post.ts` |
| `server_logout` | Server-side logout event with session correlation headers. | `server/api/auth/logout.post.ts` |

## Next steps

We've prepared five insights for an "Analytics basics" dashboard. Create them in PostHog at https://us.i.posthog.com/project/2/insights/new:

1. **Login trend** — Trends insight on `user_logged_in` over the last 30 days (daily interval). Tracks user acquisition and retention momentum.
2. **Login funnel** — Funnel insight: `user_logged_in` → `media_viewed` → `video_played`. Measures how many users progress from login to content engagement.
3. **Search activity** — Trends insight on `search_performed` over the last 30 days. Reveals how often users rely on search and discovery volume.
4. **Top media viewed** — Table insight on `media_viewed` grouped by `media_title`. Highlights which movies and TV shows drive the most interest.
5. **Login failures** — Trends insight on `login_failed` over the last 30 days. Acts as a churn and friction signal — spikes may indicate UX or auth issues.

Once created, group them into a dashboard named **"Analytics basics"** at https://us.i.posthog.com/project/2/dashboards.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nuxt-4/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
