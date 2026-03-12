<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the React Router v7 (Framework mode) countries app. Here is a summary of all changes made:

- **Installed packages**: `posthog-js`, `@posthog/react`, `posthog-node`
- **Environment variables**: `VITE_PUBLIC_POSTHOG_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` added to `.env`
- **Client-side initialization**: `app/entry.client.tsx` now initializes PostHog and wraps the app with `PostHogProvider`, enabling `__add_tracing_headers` for client-server session correlation
- **Server-side middleware**: `app/lib/posthog-middleware.ts` creates a per-request PostHog Node client, extracts session/distinct IDs from request headers, and is registered in `app/root.tsx`
- **Error tracking**: `ErrorBoundary` in `app/root.tsx` captures exceptions via `posthog?.captureException(error)`
- **User identification**: Users are identified on login (`app/routes/login.tsx`) and signup (`app/routes/signup.tsx`) using `posthog.identify()`
- **Logout tracking**: Profile page (`app/routes/profile.tsx`) captures logout events and calls `posthog.reset()` to clear the identity
- **Country actions**: `app/routes/countries.tsx` tracks claim, like, and visit actions; search and region filter also captured
- **Country detail views**: `app/routes/country.tsx` fires a `country_detail_viewed` event when a country detail page is loaded
- **Vite config**: `vite.config.ts` updated with `ssr.noExternal` for `posthog-js` and `@posthog/react`
- **React Router config**: `react-router.config.ts` updated to enable `v8_middleware` future flag

| Event Name | Description | File |
|---|---|---|
| `user_signed_up` | User successfully created a new account | `app/routes/signup.tsx` |
| `user_logged_in` | User successfully logged in | `app/routes/login.tsx` |
| `user_logged_out` | User logged out | `app/routes/profile.tsx` |
| `country_claimed` | User claimed a country | `app/routes/countries.tsx` |
| `country_liked` | User liked a country | `app/routes/countries.tsx` |
| `country_visited` | User marked a country as visited | `app/routes/countries.tsx` |
| `country_detail_viewed` | User viewed a country detail page (conversion funnel top) | `app/routes/country.tsx` |
| `countries_searched` | User searched or filtered the countries list | `app/routes/countries.tsx` |

## Next steps

Use these links to build insights and a dashboard in PostHog for the events above:

- [Create a new dashboard "Analytics basics"](https://us.posthog.com/project/2/dashboard/new)
- [Signup funnel: country_detail_viewed → country_claimed](https://us.posthog.com/project/2/insights/new#{"kind":"FunnelQuery","series":[{"kind":"EventsNode","event":"country_detail_viewed"},{"kind":"EventsNode","event":"country_claimed"}]})
- [Signup & login trend](https://us.posthog.com/project/2/insights/new#{"kind":"TrendsQuery","series":[{"kind":"EventsNode","event":"user_signed_up"},{"kind":"EventsNode","event":"user_logged_in"}]})
- [Country engagement: claims, likes, visits](https://us.posthog.com/project/2/insights/new#{"kind":"TrendsQuery","series":[{"kind":"EventsNode","event":"country_claimed"},{"kind":"EventsNode","event":"country_liked"},{"kind":"EventsNode","event":"country_visited"}]})
- [User churn (logout rate)](https://us.posthog.com/project/2/insights/new#{"kind":"TrendsQuery","series":[{"kind":"EventsNode","event":"user_logged_out"}]})
- [Countries search usage](https://us.posthog.com/project/2/insights/new#{"kind":"TrendsQuery","series":[{"kind":"EventsNode","event":"countries_searched"}]})

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
