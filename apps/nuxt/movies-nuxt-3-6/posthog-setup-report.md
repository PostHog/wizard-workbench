# PostHog post-wizard report

The wizard has completed a deep integration of your Nuxt 3.6 Movies project with PostHog analytics. The integration includes:

- **Client-side initialization**: A PostHog plugin (`plugins/posthog.client.ts`) that initializes the PostHog JavaScript SDK on the client side
- **Server-side tracking**: PostHog Node.js SDK integration in API routes for server-side event capture
- **User identification**: Users are identified when logging in, with proper reset on logout
- **Error tracking**: Vue error hooks capture exceptions automatically, plus manual error tracking on the error page
- **Event tracking**: Comprehensive event tracking across key user interactions
- **TypeScript support**: Full type declarations for PostHog in Nuxt

## Events Instrumented

| Event Name | Description | File |
|------------|-------------|------|
| `user_logged_in` | User successfully logged in to the application | `composables/useAuth.ts` |
| `user_logged_out` | User logged out of the application | `composables/useAuth.ts` |
| `login_failed` | User login attempt failed with an error | `composables/useAuth.ts` |
| `search_performed` | User performed a search query for movies/TV shows | `pages/search.vue` |
| `media_viewed` | User viewed a movie or TV show detail page | `pages/[type]/[id].vue` |
| `video_played` | User clicked to play a video trailer | `components/video/Card.vue` |
| `external_link_clicked` | User clicked an external link (Twitter, Facebook, IMDB, etc.) | `components/ExternalLinks.vue` |
| `person_viewed` | User viewed a person/actor detail page | `pages/person/[id].vue` |
| `error_page_viewed` | User encountered an error page (404 or other error) | `error.vue` |
| `server_login_success` | Server-side: User login completed successfully | `server/api/auth/login.post.ts` |
| `server_login_error` | Server-side: User login failed with an error | `server/api/auth/login.post.ts` |
| `server_logout` | Server-side: User logged out | `server/api/auth/logout.post.ts` |

## Files Created/Modified

### Created
- `plugins/posthog.client.ts` - PostHog client-side plugin
- `types/posthog.d.ts` - TypeScript declarations for PostHog
- `.env` - Environment variables for PostHog configuration

### Modified
- `nuxt.config.ts` - Added PostHog runtime configuration
- `composables/useAuth.ts` - Added user identification and login/logout events
- `pages/search.vue` - Added search event tracking
- `pages/[type]/[id].vue` - Added media view tracking
- `pages/person/[id].vue` - Added person view tracking
- `components/video/Card.vue` - Added video play tracking
- `components/ExternalLinks.vue` - Added external link click tracking
- `error.vue` - Added error page tracking
- `server/api/auth/login.post.ts` - Added server-side login tracking
- `server/api/auth/logout.post.ts` - Added server-side logout tracking
- `package.json` - Added posthog-js and posthog-node dependencies

## Next steps

### Create insights and dashboards

With the events now instrumented, you can create insights in PostHog to track:

1. **User Authentication Funnel**: Track conversion from login attempts to successful logins
2. **Content Engagement**: Monitor which media types (movies vs TV) get more views
3. **Search Behavior**: Analyze search patterns and popular queries
4. **Video Engagement**: Track which trailers get the most plays
5. **Error Monitoring**: Keep track of error page views and types

Visit your PostHog dashboard at https://us.i.posthog.com to create these insights.

### Recommended Dashboard Structure

Create a dashboard called "Analytics Basics" with:
- **Login Funnel**: `user_logged_in` vs `login_failed` events
- **Content Views Trend**: `media_viewed` events over time
- **Search Activity**: `search_performed` events with query breakdown
- **Video Engagement**: `video_played` events count
- **User Sessions**: Active users and session duration

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nuxt-3.6/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
