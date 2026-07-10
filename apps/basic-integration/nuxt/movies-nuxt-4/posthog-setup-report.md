<wizard-report>
# PostHog post-wizard report

The wizard has completed a full PostHog integration for the Nuxt Movies app. The `@posthog/nuxt` module was installed and configured, providing automatic client-side analytics, session replay, and error tracking. A server-side PostHog singleton was added to capture events from API routes. Eight events are now tracked across six files, covering the full user journey from login through content discovery to video playback.

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | Fired on the client when a user successfully completes login. | `pages/login.vue` |
| `user_logged_out` | Fired on the client when a user clicks the logout button in the nav bar. | `components/NavBar.vue` |
| `search_performed` | Fired when a user submits a search query and results are fetched. | `pages/search.vue` |
| `media_viewed` | Fired when a user opens the detail page for a movie or TV show. | `pages/[type]/[id].vue` |
| `video_played` | Fired when a user clicks play on a video trailer or clip. | `components/video/Card.vue` |
| `language_changed` | Fired when a user switches the app language using the language switcher. | `components/LanguageSwitcher.vue` |
| `server_login` | Server-side event fired when the login API endpoint processes a successful login. | `server/api/auth/login.post.ts` |
| `server_logout` | Server-side event fired when the logout API endpoint processes a logout request. | `server/api/auth/logout.post.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1829259)
- [Daily Logins (wizard)](https://us.posthog.com/project/483112/insights/TV26x2s8) — line graph of daily logins over 30 days
- [Login to Media View Funnel (wizard)](https://us.posthog.com/project/483112/insights/WBqiCHYv) — conversion funnel from login to first media detail page viewed
- [Search to Media View Funnel (wizard)](https://us.posthog.com/project/483112/insights/pxAVUfJn) — conversion funnel from search performed to media viewed within 1 hour
- [Videos Played per Day (wizard)](https://us.posthog.com/project/483112/insights/mLFqzuOM) — bar chart of daily video plays
- [Searches per Day (wizard)](https://us.posthog.com/project/483112/insights/BAmqPSvz) — area graph of daily searches

Dashboard subscription and alerts were skipped because the interactive prompt was unavailable in this run. You can set these up manually from the PostHog dashboard.

## Verify before merging

- [ ] Run a full production build (`npm run build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite (`npm run test:unit`) — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo or bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload into CI so production stack traces de-minify (use `posthog-cli sourcemap` or configure the `sourcemaps` key in `posthogConfig` with your `PROJECT_ID` and `PERSONAL_API_KEY`).
- [ ] Confirm the returning-visitor path also calls `identify` — currently `identify` is only called on fresh login in `pages/login.vue`. Consider calling it on app mount when a user cookie is already present, so returning sessions are not left on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nuxt-4/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
