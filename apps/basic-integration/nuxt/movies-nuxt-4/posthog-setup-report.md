<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Nuxt 4 movies application. The `@posthog/nuxt` module was installed and configured, providing automatic client-side tracking (session replay, autocapture, exception capture) and server-side tracking via a shared `posthog-node` singleton. Users are identified on the client side at login, and both client and server events share the same distinct ID via `X-POSTHOG-SESSION-ID` / `X-POSTHOG-DISTINCT-ID` headers. Nine events were added across nine files covering the full user journey: authentication, search, content discovery, and engagement.

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | User successfully signs in to the app. | `pages/login.vue` |
| `user_logged_out` | User logs out of the app. | `composables/useAuth.ts` |
| `server_login` | Server-side tracking of a successful user login. | `server/api/auth/login.post.ts` |
| `server_logout` | Server-side tracking of a user logout. | `server/api/auth/logout.post.ts` |
| `search_performed` | User performs a search query for movies or TV shows. | `pages/search.vue` |
| `media_viewed` | User views the details page for a movie or TV show. | `pages/[type]/[id].vue` |
| `person_profile_viewed` | User views an actor or director profile page. | `pages/person/[id].vue` |
| `category_browsed` | User browses a category listing of movies or TV shows. | `pages/[type]/category/[query].vue` |
| `media_tab_switched` | User switches between the Overview, Videos, and Photos tabs on a media detail page. | `components/media/Details.vue` |

## Next steps

We've built a dashboard and five insights for you to keep an eye on user behavior:

- Dashboard: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1787445)
- Insight: [Login to content funnel](https://us.posthog.com/project/483112/insights/OhNImoj7)
- Insight: [Daily logins trend](https://us.posthog.com/project/483112/insights/d9Y8NmOC)
- Insight: [Search volume trend](https://us.posthog.com/project/483112/insights/SfcFtLMN)
- Insight: [Media views by type](https://us.posthog.com/project/483112/insights/Z8KEQIHo)
- Insight: [Content engagement overview](https://us.posthog.com/project/483112/insights/lsI2Rvgj)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload into CI so production stack traces de-minify (configure `sourcemaps` in `posthogConfig` in `nuxt.config.ts` with your `PROJECT_ID` and `PERSONAL_API_KEY`).
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
