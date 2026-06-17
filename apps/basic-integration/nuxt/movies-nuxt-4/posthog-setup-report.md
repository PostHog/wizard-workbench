<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Nuxt 4 Movies application. The `@posthog/nuxt` module was installed and configured with automatic client-side and server-side error tracking enabled. User identification is performed on login, and a PostHog reset is called on logout to prevent session leakage. Events are tracked across the key user journeys: authentication, content discovery, media engagement, and personalisation.

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | User successfully logs in to the app | `pages/login.vue` |
| `user_logged_out` | User logs out from the navigation bar | `components/NavBar.vue` |
| `media_searched` | User performs a search for movies or TV shows | `pages/search.vue` |
| `media_viewed` | User views a movie or TV show detail page | `pages/[type]/[id].vue` |
| `media_trailer_played` | User plays a video or trailer on a media detail page | `components/video/Card.vue` |
| `language_changed` | User changes the application language | `components/LanguageSwitcher.vue` |
| `person_viewed` | User views a person or actor detail page | `pages/person/[id].vue` |
| `server_login` | Server-side event when user authenticates via login API | `server/api/auth/login.post.ts` |

## Next steps

A dashboard with insights for these events can be created in PostHog. Use the links below to get started:

- [Create a new dashboard](https://us.posthog.com/project/2/dashboard) — create one named "Analytics basics (wizard)"
- [New insight](https://us.posthog.com/project/2/insights/new) — suggested insights:
  - **Login trend**: `user_logged_in` over time (Trends)
  - **Content engagement funnel**: `user_logged_in` → `media_searched` → `media_viewed` → `media_trailer_played` (Funnel)
  - **Media views by type**: `media_viewed` broken down by `media_type` property (Trends)
  - **Search activity**: `media_searched` event count over time (Trends)
  - **Language adoption**: `language_changed` broken down by `to_locale` (Trends)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload into CI so production stack traces de-minify (see [PostHog source map docs](https://posthog.com/docs/error-tracking/source-maps)).
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
