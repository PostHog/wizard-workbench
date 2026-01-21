# PostHog post-wizard report

The wizard has completed a deep integration of your React Router v7 Framework mode project with PostHog. The integration includes client-side analytics initialization, server-side middleware for correlating user sessions, user identification on login/signup, error tracking through the ErrorBoundary, and comprehensive event tracking for key user interactions.

## Summary of Changes

### Core Integration Files

| File | Changes |
|------|---------|
| `app/entry.client.tsx` | Added PostHog initialization with `PostHogProvider` wrapper, configured with environment variables and tracing headers for session correlation |
| `app/root.tsx` | Added PostHog middleware registration and error boundary exception capture using `captureException()` |
| `app/lib/posthog-middleware.ts` | Created server-side middleware to initialize PostHog Node client, extract session/distinct IDs from headers, and maintain user context |
| `vite.config.ts` | Added SSR `noExternal` configuration for `posthog-js` and `@posthog/react` |
| `react-router.config.ts` | Enabled `v8_middleware` future flag for middleware support |
| `.env` | Added `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST` environment variables |

### Event Tracking Implementation

| Event Name | Description | File |
|------------|-------------|------|
| `user_signed_up` | User completed signup and created a new account | `app/routes/signup.tsx` |
| `user_logged_in` | User successfully logged in to their account | `app/routes/login.tsx` |
| `user_logged_out` | User logged out of their account | `app/routes/profile.tsx` |
| `country_claimed` | User claimed ownership of a country | `app/routes/countries.tsx` |
| `country_liked` | User liked a country | `app/routes/countries.tsx` |
| `country_visited` | User marked a country as visited | `app/routes/countries.tsx` |
| `country_search_performed` | User searched for countries by name | `app/routes/countries.tsx` |
| `region_filter_applied` | User filtered countries by region | `app/routes/countries.tsx` |
| `country_detail_viewed` | User viewed detailed information about a specific country | `app/routes/country.tsx` |
| `explore_cta_clicked` | User clicked the Explore Now button on the home page | `app/routes/home.tsx` |
| `learn_more_clicked` | User clicked the Learn More button on the home page | `app/routes/home.tsx` |

### User Identification

- Users are identified on **login** using `posthog.identify()` with their username
- Users are identified on **signup** using `posthog.identify()` with their user ID, username, and email as person properties
- On **logout**, `posthog.reset()` is called to unlink future events from the user

### Error Tracking

- The `ErrorBoundary` in `app/root.tsx` captures all unhandled errors using `posthog.captureException(error)`
- This automatically tracks React Router errors and associates them with user sessions

## Next steps

We've configured PostHog to capture key user interactions. To get the most value from your analytics, create the following insights in your PostHog dashboard:

### Recommended Insights

1. **User Signup Funnel**
   - Track: `explore_cta_clicked` → `user_signed_up` → `country_claimed`
   - Purpose: Understand conversion from landing page to engaged user

2. **Feature Engagement**
   - Track: `country_claimed`, `country_liked`, `country_visited` over time
   - Purpose: Measure core feature adoption and engagement

3. **Search Behavior**
   - Track: `country_search_performed` with `search_term` property
   - Purpose: Understand what users are looking for

4. **User Retention**
   - Track: `user_logged_in` cohort analysis
   - Purpose: Measure returning user engagement

5. **Error Rate Monitoring**
   - Track: `$exception` events
   - Purpose: Monitor application health and error patterns

### Dashboard Setup

Visit your [PostHog Dashboard](https://us.i.posthog.com) to:
1. Create a new dashboard named "Analytics basics"
2. Add the recommended insights above
3. Set up alerts for critical events like errors or signup drops

## Agent skill

We've left an agent skill folder in your project at `.claude/skills/react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

## Environment Variables

Make sure to configure these environment variables in your deployment environment:

```bash
VITE_PUBLIC_POSTHOG_KEY=phc_sBGFIjin7AfcLwLJ4yc79wY84KHkvrTw5SnUeKD0SWE
VITE_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

## Packages Installed

- `posthog-js` - Client-side JavaScript SDK
- `@posthog/react` - React-specific hooks and components (PostHogProvider, usePostHog)
- `posthog-node` - Server-side Node.js SDK for middleware
