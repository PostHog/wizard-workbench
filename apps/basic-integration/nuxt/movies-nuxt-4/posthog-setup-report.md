<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your project. PostHog was added with the Nuxt module, runtime configuration was wired to environment variables, client-side identify/capture/exception tracking was added for authentication and key media interactions, and server-side capture/exception tracking was added for login and logout API handlers using a shared Node client.

| Event | Description | File |
| --- | --- | --- |
| `login_submitted` | Tracks when a visitor submits the login form. | `pages/login.vue` |
| `login_succeeded` | Tracks when a visitor successfully logs into the application. | `composables/useAuth.ts` |
| `logout_completed` | Tracks when an authenticated user logs out of the application. | `composables/useAuth.ts` |
| `auth_login_api_succeeded` | Tracks when the server accepts a login request and creates an authenticated session. | `server/api/auth/login.post.ts` |
| `auth_logout_api_succeeded` | Tracks when the server clears an authenticated session during logout. | `server/api/auth/logout.post.ts` |
| `search_executed` | Tracks when a visitor performs a media search with a non-empty query. | `pages/search.vue` |
| `media_opened` | Tracks when a visitor opens a media details page from a listing or hero card. | `components/media/Card.vue` |
| `media_tab_selected` | Tracks when a visitor switches between overview, videos, and photos on a media page. | `components/media/Details.vue` |
| `video_play_started` | Tracks when a visitor starts playing a video from the media details experience. | `components/video/Card.vue` |
| `photo_gallery_opened` | Tracks when a visitor opens the photo gallery modal. | `components/photo/Modal.vue` |
| `photo_gallery_navigated` | Tracks when a visitor navigates between photos in the gallery modal. | `components/photo/Modal.vue` |
| `language_changed` | Tracks when a visitor changes the application language. | `components/LanguageSwitcher.vue` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: https://us.posthog.com/project/483112/dashboard/1831211
- Insight: https://us.posthog.com/project/483112/insights/ZiAlr6CW
- Insight: https://us.posthog.com/project/483112/insights/2JT2zSkX
- Insight: https://us.posthog.com/project/483112/insights/V4WdRnze
- Insight: https://us.posthog.com/project/483112/insights/lIrNlyB2
- Insight: https://us.posthog.com/project/483112/insights/6L7y7hZQ

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
