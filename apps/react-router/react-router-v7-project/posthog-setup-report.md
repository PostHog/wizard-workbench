<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the CountryExplorer React Router v7 (Framework mode) application. The following changes were made:

- **`app/entry.client.tsx`**: Initialized PostHog with `posthog-js` and wrapped the app in `<PostHogProvider>`. Enabled tracing headers (`__add_tracing_headers`) to correlate client-side and server-side events.
- **`app/lib/posthog-middleware.ts`** *(new file)*: Created a server-side PostHog middleware using `posthog-node`. It creates a PostHog client per request, extracts `X-POSTHOG-SESSION-ID` / `X-POSTHOG-DISTINCT-ID` headers, and uses `withContext()` to maintain user/session correlation between frontend and backend.
- **`app/root.tsx`**: Exported the `posthogMiddleware` for all routes. Added `posthog.captureException(error)` to the `ErrorBoundary` for automatic error tracking.
- **`react-router.config.ts`**: Added `future: { v8_middleware: true }` to enable middleware support.
- **`vite.config.ts`**: Added `ssr.noExternal: ['posthog-js', '@posthog/react']` for SSR compatibility.
- **`app/routes/login.tsx`**: Added `posthog.identify()` and `user_logged_in` event capture on successful login.
- **`app/routes/signup.tsx`**: Added `posthog.identify()` and `user_signed_up` event capture on successful signup.
- **`app/routes/profile.tsx`**: Added `user_logged_out` event capture and `posthog.reset()` on logout.
- **`app/routes/countries.tsx`**: Added `country_claimed`, `country_liked`, `country_visited`, and `country_searched` event capture with country name and region properties.
- **`.env`**: Set `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST` (added to `.gitignore`).

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | User successfully created a new account | `app/routes/signup.tsx` |
| `user_logged_in` | User successfully logged in; user is also identified | `app/routes/login.tsx` |
| `user_logged_out` | User logged out; PostHog session is reset | `app/routes/profile.tsx` |
| `country_claimed` | User claimed a country (earning 100 points) | `app/routes/countries.tsx` |
| `country_liked` | User liked a country (earning 10 points) | `app/routes/countries.tsx` |
| `country_visited` | User virtually visited a country (earning 50 points) | `app/routes/countries.tsx` |
| `country_searched` | User searched for a country (fires when query > 2 chars) | `app/routes/countries.tsx` |

## Next steps

We instrumented events to enable these key insights in PostHog. You can build them at [https://us.posthog.com/project/2/insights/new](https://us.posthog.com/project/2/insights/new):

1. **Signup-to-claim funnel** — Funnel from `user_signed_up` → `country_claimed` to see conversion rate of new users claiming their first country.
2. **Country engagement trends** — Trend chart with `country_claimed`, `country_liked`, `country_visited` to see daily engagement.
3. **User acquisition** — Trend chart with `user_signed_up` and `user_logged_in` over time.
4. **Search-to-claim conversion** — Funnel from `country_searched` → `country_claimed` to measure search effectiveness.
5. **Churn indicator** — Trend chart comparing `user_logged_in` vs `user_logged_out` over time.

You can view all your PostHog dashboards at: [https://us.posthog.com/project/2/dashboards](https://us.posthog.com/project/2/dashboards)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
