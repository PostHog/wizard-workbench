# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Nuxt 3.6 movies application. The integration includes:

- **Client-side analytics**: Automatic pageview tracking, session replay, and custom event capture using `posthog-js`
- **Server-side tracking**: Server-side event capture for authentication using `posthog-node`
- **User identification**: Users are identified on login, with proper session correlation between client and server
- **Error tracking**: Vue errors are automatically captured via the `vue:error` hook, and error page events are tracked
- **Event tracking**: 11 custom events tracking user engagement across the application

## Events Implemented

| Event Name | Description | File Path |
|------------|-------------|-----------|
| `user_logged_in` | Tracks when a user successfully logs in, with user identification | `pages/login.vue` |
| `user_logged_out` | Tracks when a user logs out of the application | `components/NavBar.vue` |
| `server_login` | Server-side event tracking for user authentication | `server/api/auth/login.post.ts` |
| `search_performed` | Tracks when a user executes a search query | `pages/search.vue` |
| `media_viewed` | Tracks when a user views a movie or TV show detail page | `pages/[type]/[id].vue` |
| `trailer_played` | Tracks when a user plays a trailer from the hero section | `components/media/Hero.vue` |
| `video_played` | Tracks when a user plays a video from the video card list | `components/video/Card.vue` |
| `person_viewed` | Tracks when a user views a person/actor detail page | `pages/person/[id].vue` |
| `external_link_clicked` | Tracks when a user clicks an external link (social media, IMDb, etc.) | `components/ExternalLinks.vue` |
| `media_card_clicked` | Tracks when a user clicks on a media card to navigate to its detail page | `components/media/Card.vue` |
| `error_occurred` | Tracks application errors displayed to users on the error page | `error.vue` |

## Files Created/Modified

### New Files
- `plugins/posthog.client.ts` - PostHog client-side initialization plugin
- `types/nuxt-app.d.ts` - TypeScript declarations for PostHog
- `.env` - Environment variables for PostHog configuration

### Modified Files
- `nuxt.config.ts` - Added PostHog runtime configuration
- `pages/login.vue` - Added user identification and login tracking
- `components/NavBar.vue` - Added logout tracking with PostHog reset
- `server/api/auth/login.post.ts` - Added server-side login tracking
- `pages/search.vue` - Added search tracking
- `pages/[type]/[id].vue` - Added media viewed tracking
- `components/media/Hero.vue` - Added trailer play tracking
- `components/video/Card.vue` - Added video play tracking
- `pages/person/[id].vue` - Added person viewed tracking
- `components/ExternalLinks.vue` - Added external link click tracking
- `components/media/Card.vue` - Added media card click tracking
- `error.vue` - Added error tracking and exception capture

## Next steps

We've set up the PostHog integration with comprehensive event tracking. To view your analytics:

1. Visit [PostHog US](https://us.i.posthog.com) and log in to your account
2. Navigate to your project to see events flowing in
3. Create insights and dashboards based on the events above

### Suggested Insights to Create

1. **User Conversion Funnel**: `media_card_clicked` -> `media_viewed` -> `trailer_played`
2. **Search to Engagement**: `search_performed` -> `media_card_clicked`
3. **Authentication Metrics**: Daily active users based on `user_logged_in` events
4. **Content Engagement**: Most viewed media by `media_viewed` event properties
5. **External Link Engagement**: Click distribution across platforms

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nuxt-3.6/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

## Environment Variables

The following environment variables have been configured in `.env`:

```
NUXT_PUBLIC_POSTHOG_KEY=phc_sBGFIjin7AfcLwLJ4yc79wY84KHkvrTw5SnUeKD0SWE
NUXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

Make sure `.env` is included in your `.gitignore` to avoid committing sensitive keys.
