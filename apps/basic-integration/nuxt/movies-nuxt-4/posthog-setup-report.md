<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Nuxt 4 movies application. The `@posthog/nuxt` module was installed and configured with automatic client-side error tracking (`capture_exceptions: true`) and server-side error tracking (`enableExceptionAutocapture: true`). A server-side PostHog singleton utility (`server/utils/posthog.ts`) was created to share a `posthog-node` client across server routes. Environment variables were written to `.env` and referenced from `nuxt.config.ts`. PostHog tracing headers (`x-posthog-session-id` / `x-posthog-distinct-id`) are automatically forwarded to server API routes via `__add_tracing_headers`, and the server login route reads them to correlate client and server events. Users are identified on successful login via `posthog.identify()` and their session is reset on logout via `posthog.reset()`.

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | Fired on the client when a user successfully authenticates | `pages/login.vue` |
| `user_logged_out` | Fired when a user clicks the logout button in the navigation bar | `components/NavBar.vue` |
| `media_viewed` | Fired when a user opens the detail page for a movie or TV show | `pages/[type]/[id].vue` |
| `search_performed` | Fired when the user submits or triggers a debounced search query | `pages/search.vue` |
| `video_played` | Fired when a user clicks to play a trailer or video clip | `components/video/Card.vue` |
| `media_tab_changed` | Fired when a user switches between Overview, Videos, or Photos tabs | `components/media/Details.vue` |
| `person_viewed` | Fired when a user opens a person's profile page | `pages/person/[id].vue` |
| `category_browsed` | Fired when a user navigates to a specific category listing | `pages/[type]/category/[query].vue` |
| `server_login` | Server-side event capturing a successful login with session context | `server/api/auth/login.post.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) Dashboard](https://us.i.posthog.com/project/483112/dashboard/1792530)
- [Daily Active Users](https://us.i.posthog.com/project/483112/insights/RoYDEzj9)
- [Login to Media Viewed Funnel](https://us.i.posthog.com/project/483112/insights/vV0SORNp)
- [Search to Content Funnel](https://us.i.posthog.com/project/483112/insights/XlX93Twb)
- [Top Content Actions](https://us.i.posthog.com/project/483112/insights/TtUZlu2f)
- [User Churn](https://us.i.posthog.com/project/483112/insights/wWKu7J4T)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload into CI so production stack traces de-minify (see `posthogConfig.sourcemaps` options in `nuxt.config.ts`).
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
