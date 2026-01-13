# PostHog post-wizard report

The wizard has completed a deep integration of your Country Explorer React Router v7 project with PostHog analytics. The integration includes:

- **Client-side PostHog initialization** via `entry.client.tsx` with `PostHogProvider` wrapping the app
- **Server-side middleware** in `lib/posthog-middleware.ts` for server-side event tracking with session/user context preservation
- **User identification** on login and signup to link events to specific users
- **Error tracking** in the ErrorBoundary component using `captureException()`
- **Event tracking** for key user actions including authentication, country interactions, search/filter usage, and navigation
- **PostHog reset** on logout to properly handle user sessions

## Events Implemented

| Event Name | Description | File Location |
|------------|-------------|---------------|
| `user_signed_up` | User successfully created a new account | `app/routes/signup.tsx` |
| `signup_form_started` | User began filling out the signup form | `app/routes/signup.tsx` |
| `user_logged_in` | User successfully logged in to their account | `app/routes/login.tsx` |
| `login_failed` | User failed to log in (invalid credentials) | `app/routes/login.tsx` |
| `login_form_started` | User began filling out the login form | `app/routes/login.tsx` |
| `user_logged_out` | User logged out of their account | `app/context/AuthContext.tsx` |
| `logout_clicked` | User clicked the logout button on profile page | `app/routes/profile.tsx` |
| `country_claimed` | User claimed ownership of a country (100 points) | `app/lib/utils/auth.ts` |
| `country_liked` | User liked a country (10 points) | `app/lib/utils/auth.ts` |
| `country_visited` | User marked a country as visited (50 points) | `app/lib/utils/auth.ts` |
| `achievement_unlocked` | User unlocked a new achievement | `app/lib/utils/auth.ts` |
| `countries_searched` | User searched for countries using the search filter | `app/routes/countries.tsx` |
| `region_filtered` | User filtered countries by region | `app/routes/countries.tsx` |
| `country_card_clicked` | User clicked on a country card to view details | `app/routes/countries.tsx` |
| `login_prompt_clicked` | Non-authenticated user clicked login prompt | `app/routes/countries.tsx` |
| `explore_cta_clicked` | User clicked 'Explore Now' CTA on home page | `app/routes/home.tsx` |
| `learn_more_clicked` | User clicked 'Learn More' CTA on home page | `app/routes/home.tsx` |
| `country_details_viewed` | User viewed details page for a specific country | `app/routes/country.tsx` |
| `profile_viewed` | User viewed their profile page | `app/routes/profile.tsx` |
| `stats_viewed` | User viewed the stats and leaderboard page | `app/routes/stats.tsx` |
| `leaderboard_rank_viewed` | User viewed their rank on the leaderboard | `app/routes/stats.tsx` |
| `navbar_login_clicked` | User clicked login button in navbar | `app/components/navbar.tsx` |
| `navbar_signup_clicked` | User clicked signup button in navbar | `app/components/navbar.tsx` |

## Files Modified/Created

| File | Change Type | Description |
|------|-------------|-------------|
| `.env` | Created | PostHog API key and host environment variables |
| `app/entry.client.tsx` | Existing | PostHog client initialization with PostHogProvider |
| `app/root.tsx` | Modified | Added PostHog middleware import and export |
| `app/lib/posthog-middleware.ts` | Created | Server-side PostHog middleware for context handling |
| `react-router.config.ts` | Modified | Enabled v8_middleware future flag |
| `vite.config.ts` | Existing | SSR noExternal for PostHog packages and proxy configuration |
| `app/routes/signup.tsx` | Modified | Added signup_form_started event |
| `app/routes/login.tsx` | Modified | Added login_form_started event |
| `app/context/AuthContext.tsx` | Existing | user_logged_out event and posthog.reset() |
| `app/lib/utils/auth.ts` | Existing | country_claimed, country_liked, country_visited, achievement_unlocked events |
| `app/routes/countries.tsx` | Modified | Added country_card_clicked, login_prompt_clicked events |
| `app/routes/home.tsx` | Modified | Added learn_more_clicked event |
| `app/routes/country.tsx` | Existing | country_details_viewed event |
| `app/routes/profile.tsx` | Modified | Added profile_viewed, logout_clicked events |
| `app/routes/stats.tsx` | Modified | Added stats_viewed, leaderboard_rank_viewed events |
| `app/components/navbar.tsx` | Modified | Added navbar_login_clicked, navbar_signup_clicked events |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

### Dashboard
- [Analytics basics](https://us.posthog.com/project/228144/dashboard/994820) - Core analytics dashboard with all key metrics

### Recommended Insights to Create

1. **Signup Conversion Funnel** - Track: `signup_form_started` → `user_signed_up` → `country_claimed`
2. **Login Conversion Funnel** - Track: `login_form_started` → `user_logged_in`
3. **User Engagement Trends** - Track: `country_claimed`, `country_liked`, `country_visited` over time
4. **Churn Indicators** - Monitor: `logout_clicked` and `user_logged_out` events
5. **Feature Discovery Flow** - Funnel: `explore_cta_clicked` → `country_card_clicked` → `country_details_viewed`

### Existing Insights
- [User Signup & Login Funnel](https://us.posthog.com/project/228144/insights/H8M5JqI2) - Tracks user journey from signup to first country claim
- [User Engagement: Country Actions](https://us.posthog.com/project/228144/insights/HMeS0XSz) - Tracks how users interact with countries (claims, likes, visits)
- [Explore CTA to Country View Funnel](https://us.posthog.com/project/228144/insights/sUyB53n7) - Conversion funnel from home page CTA to viewing country details
- [Achievement Unlocks](https://us.posthog.com/project/228144/insights/oRStSA9V) - Tracks achievement unlocks broken down by achievement type
- [User Session Activity](https://us.posthog.com/project/228144/insights/yAacsJPv) - Tracks login, logout, and failed login attempts

## Configuration

Environment variables used (set in `.env`):
- `VITE_PUBLIC_POSTHOG_KEY` - Your PostHog project API key
- `VITE_PUBLIC_POSTHOG_HOST` - PostHog instance host (https://us.i.posthog.com)

## Server-Side Integration

The middleware in `app/lib/posthog-middleware.ts` enables server-side event tracking with:
- Automatic session ID and distinct ID extraction from request headers
- Context preservation via `posthog.withContext()`
- Proper client shutdown after each request

This allows server-side events to be correlated with client-side user sessions.
