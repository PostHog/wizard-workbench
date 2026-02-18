# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your Nuxt 3 movies application. This integration includes comprehensive client-side and server-side event tracking, user identification, error capture, and session replay capabilities.

## Integration Summary

### Configuration Files Added/Modified

1. **nuxt.config.ts** - Added PostHog runtime configuration with environment variables
2. **plugins/posthog.client.ts** - Client-side PostHog plugin with Vue error hook
3. **types/nuxt-app.d.ts** - TypeScript declarations for PostHog
4. **.env** - Environment variables for PostHog API key and host

### Dependencies Installed

- `posthog-js` - Client-side JavaScript SDK
- `posthog-node` - Server-side Node.js SDK

## Events Tracking Table

| Event Name | Description | File Path |
|------------|-------------|-----------|
| `user_logged_in` | User successfully logged in to the application | `composables/useAuth.ts` |
| `user_logged_out` | User logged out of the application | `composables/useAuth.ts` |
| `login_failed` | User failed to log in due to an error | `pages/login.vue` |
| `search_performed` | User performed a search for movies/TV shows | `pages/search.vue` |
| `media_viewed` | User viewed a movie or TV show detail page | `pages/[type]/[id].vue` |
| `person_viewed` | User viewed a person/actor detail page | `pages/person/[id].vue` |
| `trailer_played` | User clicked to play a movie/TV show trailer | `components/media/Hero.vue` |
| `video_played` | User clicked to play a video from the video grid | `components/video/Card.vue` |
| `language_changed` | User changed the application language | `components/LanguageSwitcher.vue` |
| `media_card_clicked` | User clicked on a media card to view details | `components/media/Card.vue` |
| `server_login_success` | Server-side: User authentication succeeded | `server/api/auth/login.post.ts` |
| `server_login_failed` | Server-side: User authentication failed | `server/api/auth/login.post.ts` |
| `server_logout` | Server-side: User logged out | `server/api/auth/logout.post.ts` |
| `error_page_viewed` | User encountered an error page | `error.vue` |

## Error Tracking

Error tracking has been implemented in the following locations:

- **Global Vue Error Hook**: Captures all Vue component errors via `vue:error` hook in `plugins/posthog.client.ts`
- **Login Page**: Captures login failures with `captureException` in `pages/login.vue`
- **Search Page**: Captures search fetch errors in `pages/search.vue`
- **Error Page**: Captures and reports errors when users encounter error pages in `error.vue`

## User Identification

Users are identified on successful login with `posthog.identify(username)` in `composables/useAuth.ts`. On logout, `posthog.reset()` is called to clear the user identification.

## Server-Side Tracking

Server-side events use the PostHog Node SDK with session correlation via `X-POSTHOG-SESSION-ID` and `X-POSTHOG-DISTINCT-ID` headers. Events are properly flushed using `posthog.shutdown()` after each request.

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

### Recommended Dashboard Insights

Create these insights in your PostHog dashboard:

1. **Login Funnel** - Track conversion from login attempts to successful logins
   - Events: `login_failed` -> `user_logged_in`

2. **Content Engagement** - Track how users interact with media content
   - Events: `media_card_clicked` -> `media_viewed` -> `trailer_played`

3. **Search Behavior** - Monitor search patterns and engagement
   - Events: `search_performed` with `search_query` property breakdown

4. **User Retention** - Track login/logout patterns
   - Events: `user_logged_in`, `user_logged_out` over time

5. **Error Monitoring** - Track application errors
   - Events: `error_page_viewed`, `login_failed`

### PostHog Dashboard

Access your PostHog dashboard at: https://us.i.posthog.com

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nuxt-3.6/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

## Environment Variables

The following environment variables have been configured in `.env`:

```
NUXT_PUBLIC_POSTHOG_KEY=phc_sBGFIjin7AfcLwLJ4yc79wY84KHkvrTw5SnUeKD0SWE
NUXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

Make sure to add these to your production environment as well.
