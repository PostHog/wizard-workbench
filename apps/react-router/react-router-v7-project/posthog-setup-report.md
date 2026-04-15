<wizard-report>
# PostHog post-wizard report

The wizard has completed a full PostHog integration for the CountryExplorer React Router v7 Framework app. Here is a summary of all changes made:

- **`app/entry.client.tsx`**: Initialized `posthog-js` with your project token and host from environment variables. Wrapped the app with `PostHogProvider` to make the PostHog client available via React hooks throughout the component tree. Enabled `__add_tracing_headers` to correlate client sessions with any future server-side events.
- **`vite.config.ts`**: Added `ssr.noExternal` configuration for `posthog-js` and `@posthog/react` to ensure they are bundled correctly for SSR.
- **`app/root.tsx`**: Added PostHog error tracking to the `ErrorBoundary` using `usePostHog()` and `captureException()` — unhandled React Router errors are now automatically reported to PostHog.
- **`app/routes/login.tsx`**: On successful login, calls `posthog.identify()` to associate the session with the user, then captures `user_logged_in`.
- **`app/routes/signup.tsx`**: On successful signup, calls `posthog.identify()` with the new user's ID, then captures `user_signed_up`.
- **`app/routes/profile.tsx`**: Captures `user_logged_out` and calls `posthog.reset()` when the user clicks Logout, resetting the session identity.
- **`app/routes/countries.tsx`**: Captures `country_claimed`, `country_liked`, and `country_visited` in the respective button click handlers, with `country` and `region` properties.
- **`app/routes/country.tsx`**: Captures `country_viewed` on page mount (top of engagement funnel), with `country` and `region` properties.
- **`.env`**: Created with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`.

| Event | Description | File |
|---|---|---|
| `user_signed_up` | User successfully creates a new account | `app/routes/signup.tsx` |
| `user_logged_in` | User successfully logs in to their account | `app/routes/login.tsx` |
| `user_logged_out` | User logs out of their account | `app/routes/profile.tsx` |
| `country_claimed` | User claims a country, earning 100 points | `app/routes/countries.tsx` |
| `country_liked` | User likes a country, earning 10 points | `app/routes/countries.tsx` |
| `country_visited` | User marks a country as visited, earning 50 points | `app/routes/countries.tsx` |
| `country_viewed` | User views a country detail page (top of engagement funnel) | `app/routes/country.tsx` |

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog with these five insights to monitor your key metrics:

1. **Signup funnel** — Funnel: `country_viewed` → `country_claimed` — tracks how many country viewers convert to claimers.
2. **New signups over time** — Trend of `user_signed_up` — monitors user acquisition day by day.
3. **Country engagement breakdown** — Trend comparing `country_claimed`, `country_liked`, `country_visited` — shows which interaction is most popular.
4. **Login vs Signup** — Bar chart comparing `user_logged_in` and `user_signed_up` — helps understand returning vs new user ratio.
5. **Logout (churn signal)** — Trend of `user_logged_out` — a proxy for session dissatisfaction or natural churn.

You can create this dashboard at: https://us.posthog.com/project/2/dashboard

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
