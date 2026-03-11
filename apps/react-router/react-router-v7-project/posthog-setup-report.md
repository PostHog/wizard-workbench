<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the CountryExplorer React Router v7 (Framework mode) application. The following changes were made:

- **`app/entry.client.tsx`**: Initialized `posthog-js` with the project API key and host from environment variables, wrapped the app in `<PostHogProvider>` to make PostHog available throughout the component tree. Added `__add_tracing_headers` so client-side session/distinct ID is automatically forwarded to the server.
- **`app/lib/posthog-middleware.ts`** *(new file)*: Created a server-side PostHog middleware using `posthog-node` that reads session and distinct IDs from request headers (set automatically by `posthog-js`) and passes them through `withContext()` so server-side events are correlated with the correct user session.
- **`app/root.tsx`**: Exported the `posthogMiddleware` as the root-level middleware array (requires `v8_middleware` future flag). Added `usePostHog()` in the `ErrorBoundary` to automatically capture unhandled React Router errors via `captureException`.
- **`react-router.config.ts`**: Enabled the `v8_middleware: true` future flag required by the middleware system.
- **`vite.config.ts`**: Added `ssr.noExternal` configuration for `posthog-js` and `@posthog/react` to prevent SSR bundling issues.
- **`app/routes/login.tsx`**: Calls `posthog.identify()` with the username on successful login, then captures `user_logged_in`.
- **`app/routes/signup.tsx`**: Calls `posthog.identify()` with the user ID, username, and email on successful signup, then captures `user_signed_up`.
- **`app/routes/profile.tsx`**: Added `handleLogout` handler that captures `user_logged_out` and calls `posthog.reset()` before logging out, so the PostHog identity is cleared.
- **`app/routes/countries.tsx`**: Captures `country_claimed`, `country_liked`, `country_visited` on button clicks (only for new actions, not repeat clicks), and `countries_searched` when the search or region filter is used.
- **`app/routes/country.tsx`**: Captures `country_detail_viewed` via `useEffect` when the country detail page loads with valid data.
- **`app/routes/home.tsx`**: Captures `explore_clicked` on the "Explore Now" CTA link.

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | User successfully created a new account | `app/routes/signup.tsx` |
| `user_logged_in` | User successfully logged in | `app/routes/login.tsx` |
| `user_logged_out` | User logged out of their account | `app/routes/profile.tsx` |
| `country_claimed` | User claimed a country as their own | `app/routes/countries.tsx` |
| `country_liked` | User liked a country | `app/routes/countries.tsx` |
| `country_visited` | User marked a country as visited | `app/routes/countries.tsx` |
| `country_detail_viewed` | User viewed the detail page for a specific country | `app/routes/country.tsx` |
| `countries_searched` | User searched or filtered the countries list | `app/routes/countries.tsx` |
| `explore_clicked` | User clicked the Explore Now CTA on the home page | `app/routes/home.tsx` |

## Next steps

We recommend building the following insights in your PostHog dashboard to monitor user behavior:

1. **Signup → Login conversion funnel** — Funnel: `user_signed_up` → `user_logged_in` → `country_claimed`
2. **Country engagement trend** — Trend: `country_claimed`, `country_liked`, `country_visited` over time
3. **Home page CTA conversion** — Funnel: `explore_clicked` → `country_detail_viewed` → `country_claimed`
4. **User retention** — Retention: users who trigger `user_logged_in` and return to trigger `country_claimed`
5. **Search and discovery** — Trend: `countries_searched` broken down by `filter_region` property

You can create these insights at: https://us.posthog.com/project/2/insights

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
</wizard-report>
