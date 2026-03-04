<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the CountryExplorer React Router v7 (Framework mode) application. The integration covers client-side analytics, user identification, server-side middleware, and error tracking.

## Summary of changes

- **`app/entry.client.tsx`** — Initialized PostHog with `posthog-js` and wrapped the app in `<PostHogProvider>`. Configured `__add_tracing_headers` to enable correlation of client and server events.
- **`app/lib/posthog-middleware.ts`** *(new file)* — Server-side PostHog middleware that creates a PostHog Node client per request, extracts `X-POSTHOG-SESSION-ID` / `X-POSTHOG-DISTINCT-ID` headers, and provides the client via `context.posthog` to all route handlers.
- **`app/root.tsx`** — Registered `posthogMiddleware` in the route middleware array. Added `captureException` in the global `ErrorBoundary` for automatic error tracking.
- **`app/routes/login.tsx`** — Calls `posthog.identify()` and captures `user_logged_in` on success; captures `login_failed` on failure.
- **`app/routes/signup.tsx`** — Calls `posthog.identify()` and captures `user_signed_up` with username and email after a successful signup.
- **`app/routes/profile.tsx`** — Captures `user_logged_out` and resets the PostHog session when the user logs out.
- **`app/routes/countries.tsx`** — Captures `country_claimed`, `country_liked`, and `country_visited` (each only on first action), `countries_searched` on each non-empty search input, and `countries_region_filtered` when the region selector changes.
- **`app/routes/country.tsx`** — Captures `country_detail_viewed` (with country name and region) when a country detail page loads.
- **`vite.config.ts`** — Added `ssr.noExternal: ['posthog-js', '@posthog/react']` to prevent SSR bundling issues.
- **`react-router.config.ts`** — Enabled `future.v8_middleware: true` to support the PostHog server-side middleware.
- **`.env.local`** — `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST` are set and excluded from git.

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | User successfully created a new account | `app/routes/signup.tsx` |
| `user_logged_in` | User authenticated via the login form | `app/routes/login.tsx` |
| `login_failed` | Login attempt failed (username not found) | `app/routes/login.tsx` |
| `user_logged_out` | User clicked the logout button | `app/routes/profile.tsx` |
| `country_claimed` | User claimed a country (first claim only) | `app/routes/countries.tsx` |
| `country_liked` | User liked a country (first like only) | `app/routes/countries.tsx` |
| `country_visited` | User marked a country as visited | `app/routes/countries.tsx` |
| `country_detail_viewed` | User viewed a country detail page | `app/routes/country.tsx` |
| `countries_searched` | User typed in the country search box | `app/routes/countries.tsx` |
| `countries_region_filtered` | User selected a region filter | `app/routes/countries.tsx` |

## Next steps

We've outlined five insights for an **Analytics basics** dashboard to track the most important user behaviors. You can create these in [PostHog Insights](https://us.posthog.com/project/2/insights):

1. **Signup + Login Trend** — Trend of `user_signed_up` and `user_logged_in` over time. Helps you track user acquisition and returning engagement.

2. **Country Claim Conversion Funnel** — Funnel: `country_detail_viewed` → `country_claimed`. Measures how effectively users convert from viewing a country to claiming it.

3. **Country Engagement Breakdown** — Trend of `country_claimed`, `country_liked`, and `country_visited` side-by-side. Shows which engagement actions are most popular.

4. **Churn Signal: Logout Rate** — Trend of `user_logged_out`. Spikes may correlate with UX issues or content gaps.

5. **Search & Filter Usage** — Trend of `countries_searched` and `countries_region_filtered`. Indicates how users navigate the countries list.

To build these:
- Go to [PostHog → Insights](https://us.posthog.com/project/2/insights)
- Create each insight and add them to a dashboard named **"Analytics basics"**

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
