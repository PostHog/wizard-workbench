# PostHog post-wizard report

The wizard has completed a full integration of PostHog into this Nuxt 3.6 movie browsing app. The integration covers client-side analytics via `posthog-js` (initialized in `plugins/posthog.client.ts`), server-side event capture via `posthog-node` in API route handlers, user identification on login, session reset on logout, and Vue error capture via the `vue:error` hook.

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user_logged_in` | Fires on the client when a user successfully completes the login form. | `pages/login.vue` |
| `login_failed` | Fires when a login attempt fails and an error message is displayed. | `pages/login.vue` |
| `user_logged_out` | Fires when a user clicks the logout button in the navigation bar. | `components/NavBar.vue` |
| `media_viewed` | Fires when a user opens the detail page for a movie or TV show. | `pages/[type]/[id].vue` |
| `search_performed` | Fires when a user executes a search query and results are fetched. | `pages/search.vue` |
| `video_played` | Fires when a user clicks to play a trailer or video in the media detail view. | `components/video/Card.vue` |
| `person_viewed` | Fires when a user opens a person (actor/director) detail page. | `pages/person/[id].vue` |
| `category_browsed` | Fires when a user navigates to a specific media category listing page. | `pages/[type]/category/[query].vue` |
| `server_login` | Server-side event fired when the login API endpoint processes a successful authentication. | `server/api/auth/login.post.ts` |
| `server_logout` | Server-side event fired when the logout API endpoint clears the user session. | `server/api/auth/logout.post.ts` |

## Next steps

We've built a dashboard and insights for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: https://us.i.posthog.com/project/483112/dashboard/1897383
- **Login funnel**: https://us.i.posthog.com/project/483112/insights/nuel9i1i
- **Daily logins**: https://us.i.posthog.com/project/483112/insights/2sYKpiS0
- **Media views by type**: https://us.i.posthog.com/project/483112/insights/irtYZZRi
- **Top user actions**: https://us.i.posthog.com/project/483112/insights/atjlVSS1
- **Login failures**: https://us.i.posthog.com/project/483112/insights/FNnUYv5e

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
