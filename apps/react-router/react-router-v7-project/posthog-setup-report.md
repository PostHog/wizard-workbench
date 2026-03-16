<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Router v7 Framework mode application. The following changes were made:

- **`app/entry.client.tsx`**: Initialized PostHog with `posthog-js`, configured the API host and tracing headers, and wrapped the app with `PostHogProvider` for React hook access throughout the component tree.
- **`vite.config.ts`**: Added `ssr.noExternal` config to ensure `posthog-js` and `@posthog/react` are correctly bundled for SSR.
- **`app/root.tsx`**: Added `usePostHog` import and `posthog.captureException(error)` in the `ErrorBoundary` to automatically capture all unhandled React Router errors.
- **`app/routes/login.tsx`**: Added `posthog.identify()` to associate the user with their PostHog profile, and `posthog.capture('user_logged_in')` on successful login.
- **`app/routes/signup.tsx`**: Added `posthog.identify()` with email and username properties, and `posthog.capture('user_signed_up')` on successful account creation.
- **`app/routes/profile.tsx`**: Added `posthog.capture('user_logged_out')` and `posthog.reset()` when the user logs out, clearing the session identity.
- **`app/routes/countries.tsx`**: Added `posthog.capture('country_claimed')`, `posthog.capture('country_liked')`, and `posthog.capture('country_visited')` in the respective action handlers, with `country` and `region` properties for filtering and analysis.
- **`.env`**: Created with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` environment variables.

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | User successfully creates a new account | `app/routes/signup.tsx` |
| `user_logged_in` | User successfully logs in to their account | `app/routes/login.tsx` |
| `user_logged_out` | User logs out of their account | `app/routes/profile.tsx` |
| `country_claimed` | User claims ownership of a country | `app/routes/countries.tsx` |
| `country_liked` | User likes a country | `app/routes/countries.tsx` |
| `country_visited` | User marks a country as visited | `app/routes/countries.tsx` |

## Next steps

To monitor user behavior, create an **"Analytics basics"** dashboard in PostHog with these suggested insights:

1. **Signup & Login Conversion Funnel** — Funnel from `user_signed_up` → `user_logged_in` to measure onboarding conversion
2. **New Signups Over Time** — Trend of `user_signed_up` events to track growth
3. **Country Actions Breakdown** — Stacked bar of `country_claimed`, `country_liked`, and `country_visited` to see engagement patterns
4. **Top Claimed Countries** — Breakdown of `country_claimed` by `country` property to see which countries are most popular
5. **User Retention** — Retention analysis based on `user_signed_up` returning to perform `country_claimed`

Create your dashboard at: https://us.posthog.com/project/2/dashboards

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
