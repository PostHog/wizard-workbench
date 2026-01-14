# PostHog post-wizard report

The wizard has completed a deep integration of your React Router v7 Country Explorer project with PostHog analytics. The integration includes:

- **Client-side PostHog initialization** in `entry.client.tsx` with the `PostHogProvider` wrapper
- **User identification** on login and signup flows
- **Error tracking** via `captureException` in the error boundary
- **Event tracking** for key user actions including authentication, country interactions, and navigation

## Events Implemented

| Event Name | Description | File |
|------------|-------------|------|
| `user_signed_up` | User completed the signup process and created a new account | `app/routes/signup.tsx` |
| `user_logged_in` | User successfully logged into their account | `app/routes/login.tsx` |
| `login_failed` | User attempted to log in but credentials were invalid | `app/routes/login.tsx` |
| `user_logged_out` | User logged out of their account | `app/routes/profile.tsx` |
| `country_claimed` | User claimed ownership of a country, earning 100 points | `app/routes/countries.tsx` |
| `country_liked` | User liked a country, earning 10 points | `app/routes/countries.tsx` |
| `country_visited` | User marked a country as visited, earning 50 points | `app/routes/countries.tsx` |
| `countries_searched` | User performed a search query on the countries list | `app/routes/countries.tsx` |
| `countries_filtered_by_region` | User filtered countries by a specific region | `app/routes/countries.tsx` |
| `explore_cta_clicked` | User clicked the Explore Now call-to-action button on the home page | `app/routes/home.tsx` |
| `error_boundary_triggered` | An error occurred and the error boundary was triggered (via captureException) | `app/root.tsx` |

## Configuration

Environment variables have been set up in `.env`:
- `VITE_PUBLIC_POSTHOG_KEY` - Your PostHog project API key
- `VITE_PUBLIC_POSTHOG_HOST` - PostHog API host (https://us.i.posthog.com)

## Next steps

To monitor user behavior based on the events instrumented above, create the following insights in your PostHog dashboard:

### Recommended Insights

1. **Signup to First Country Claim Funnel**
   - Funnel: `user_signed_up` -> `country_claimed`
   - Purpose: Measure activation rate

2. **User Engagement Trend**
   - Trend: `country_claimed`, `country_liked`, `country_visited` over time
   - Purpose: Track daily/weekly engagement

3. **Search & Filter Usage**
   - Trend: `countries_searched`, `countries_filtered_by_region`
   - Purpose: Understand how users discover countries

4. **Authentication Funnel**
   - Funnel: `explore_cta_clicked` -> `user_signed_up` -> `user_logged_in`
   - Purpose: Track conversion from homepage to registered user

5. **Session Churn Indicator**
   - Trend: `user_logged_out` with breakdown by `total_points`
   - Purpose: Identify if users with low engagement are churning

### Create Your Dashboard

Visit your PostHog project to create a new dashboard with these insights:
- [PostHog Dashboard](https://us.i.posthog.com/project/dashboards)

## Files Modified

- `app/entry.client.tsx` - PostHog initialization and provider setup
- `app/root.tsx` - Error boundary with captureException
- `app/routes/login.tsx` - Login tracking and user identification
- `app/routes/signup.tsx` - Signup tracking and user identification
- `app/routes/profile.tsx` - Logout tracking with PostHog reset
- `app/routes/countries.tsx` - Country interaction and search/filter tracking
- `app/routes/home.tsx` - CTA click tracking
