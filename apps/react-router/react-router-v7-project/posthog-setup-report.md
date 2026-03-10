<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this React Router v7 Framework mode application (CountryExplorer). The following changes were made:

- **Installed packages**: `posthog-js`, `@posthog/react`, and `posthog-node` were added as dependencies.
- **Environment variables**: `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST` were added to `.env`.
- **`vite.config.ts`**: Added `ssr.noExternal` for `posthog-js` and `@posthog/react` to ensure correct SSR bundling.
- **`react-router.config.ts`**: Enabled the `v8_middleware` future flag to support React Router v7 middleware.
- **`app/entry.client.tsx`**: PostHog is now initialized client-side with `posthog.init()`, including the `__add_tracing_headers` option for client-server session correlation. The app is wrapped with `PostHogProvider`.
- **`app/lib/posthog-middleware.ts`**: Created a server-side middleware using `posthog-node` that attaches a PostHog server client to the request context and runs requests within `withContext()` for full client-server event correlation via `X-POSTHOG-SESSION-ID` / `X-POSTHOG-DISTINCT-ID` headers.
- **`app/root.tsx`**: The middleware is exported here and `captureException` is called in the `ErrorBoundary` to capture unhandled errors.
- **`app/routes/login.tsx`**: User is identified on successful login (`posthog.identify()`), `user_logged_in` is captured on success, and `login_failed` on credential mismatch.
- **`app/routes/signup.tsx`**: User is identified with their new ID on successful signup, `user_signed_up` is captured.
- **`app/routes/profile.tsx`**: `user_logged_out` is captured and `posthog.reset()` is called when the user logs out.
- **`app/routes/countries.tsx`**: `country_claimed`, `country_liked`, `country_visited`, `countries_searched`, and `countries_filtered_by_region` are captured in the respective event handlers.
- **`app/routes/country.tsx`**: `country_detail_viewed` is captured inline during render as a top-of-funnel "viewed" event.
- **`app/lib/utils/auth.ts`**: `achievement_unlocked` is captured when users unlock new achievements via country interactions.

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | User successfully created a new account | `app/routes/signup.tsx` |
| `user_logged_in` | User successfully logged into their account | `app/routes/login.tsx` |
| `login_failed` | User attempted to log in but credentials did not match any account | `app/routes/login.tsx` |
| `user_logged_out` | User clicked the logout button on their profile page | `app/routes/profile.tsx` |
| `country_claimed` | User claimed a country, earning 100 points | `app/routes/countries.tsx` |
| `country_liked` | User liked a country, earning 10 points | `app/routes/countries.tsx` |
| `country_visited` | User marked a country as visited, earning 50 points | `app/routes/countries.tsx` |
| `achievement_unlocked` | User unlocked a new achievement after performing an action | `app/lib/utils/auth.ts` |
| `country_detail_viewed` | User navigated to a country detail page — top of engagement funnel | `app/routes/country.tsx` |
| `countries_searched` | User typed in the country search box to filter the list | `app/routes/countries.tsx` |
| `countries_filtered_by_region` | User selected a region filter to narrow down the countries list | `app/routes/countries.tsx` |

## Next steps

We attempted to create an "Analytics basics" dashboard via the PostHog API, but the available API key does not have the `dashboard:write` scope required. To set up your dashboard manually, navigate to PostHog and create a new dashboard named **"Analytics basics"** with the following recommended insights:

1. **User Signups Over Time** — Trend of `user_signed_up` events to track acquisition
2. **Login Success vs Failure** — Trend comparison of `user_logged_in` vs `login_failed` to monitor authentication health
3. **Country Engagement Funnel** — Funnel from `country_detail_viewed` → `country_liked` → `country_claimed` to measure conversion
4. **Top Country Actions** — Bar chart of `country_claimed`, `country_liked`, `country_visited` counts to see engagement distribution
5. **Churn Signal: Logouts** — Trend of `user_logged_out` events as a churn signal

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
