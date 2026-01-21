# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your React Router v7 Framework project. The integration includes:

- **Client-side SDK initialization** with PostHogProvider in `entry.client.tsx`
- **Server-side middleware** for capturing server events with session/user correlation
- **User identification** on login and signup for cross-session tracking
- **Error tracking** via the ErrorBoundary in `root.tsx`
- **Custom event tracking** for key user actions including country interactions, authentication flows, and search behavior

## Events Implemented

| Event Name | Description | File Path |
|------------|-------------|-----------|
| `user_signed_up` | User successfully created a new account | `app/routes/signup.tsx` |
| `user_logged_in` | User successfully logged into their account | `app/routes/login.tsx` |
| `user_logged_out` | User logged out from their account | `app/routes/profile.tsx` |
| `country_claimed` | User claimed ownership of a country | `app/routes/countries.tsx` |
| `country_liked` | User liked a country | `app/routes/countries.tsx` |
| `country_visited` | User marked a country as visited | `app/routes/countries.tsx` |
| `countries_searched` | User searched for countries using the search input | `app/routes/countries.tsx` |
| `countries_filtered_by_region` | User filtered countries by region | `app/routes/countries.tsx` |
| `country_details_viewed` | User viewed a specific country's details page | `app/routes/country.tsx` |

## Configuration Files Modified

| File | Changes |
|------|---------|
| `app/entry.client.tsx` | Added PostHog initialization with PostHogProvider |
| `app/root.tsx` | Added PostHog middleware export and error boundary with captureException |
| `app/lib/posthog-middleware.ts` | Created server-side PostHog middleware for context |
| `vite.config.ts` | Added SSR noExternal configuration for PostHog packages |
| `react-router.config.ts` | Enabled v8_middleware feature flag |
| `.env` | Created environment variables for PostHog API key and host |

## Next steps

### Create Your Dashboard

To create a dashboard in PostHog for these events:

1. Go to [PostHog Dashboards](https://us.posthog.com/dashboard)
2. Click "New dashboard" and name it "Analytics basics"
3. Add the following recommended insights:

**Recommended Insights:**

1. **User Signup Funnel**
   - Funnel: `user_signed_up` → `country_claimed` → `country_visited`
   - Purpose: Track new user activation and engagement

2. **Login Activity Trend**
   - Trend: `user_logged_in` over time
   - Purpose: Monitor daily active users

3. **Country Engagement**
   - Trend: `country_claimed`, `country_liked`, `country_visited` stacked
   - Purpose: Understand which country interactions are most popular

4. **Search & Discovery**
   - Trend: `countries_searched`, `countries_filtered_by_region`
   - Purpose: Understand how users discover content

5. **User Retention**
   - Retention: `user_logged_in` returning for `country_claimed`
   - Purpose: Measure user engagement over time

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

## Environment Variables

Make sure the following environment variables are set in your hosting provider:

```
VITE_PUBLIC_POSTHOG_KEY=<your-posthog-api-key>
VITE_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```
