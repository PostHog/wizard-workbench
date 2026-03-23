<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CountryExplorer React Router v7 application.

## Summary of changes

- **`app/entry.client.tsx`** — Initialized the PostHog JS SDK and wrapped the app with `PostHogProvider`, enabling client-side analytics, session recording, and automatic pageview tracking. The `__add_tracing_headers` option ensures client session context is automatically forwarded to any future server-side requests.
- **`app/root.tsx`** — Added `usePostHog` to the `ErrorBoundary` component so unhandled route errors are automatically captured via `captureException`.
- **`app/routes/login.tsx`** — On successful login, calls `posthog.identify()` to link the session to the username, and captures `user_logged_in`.
- **`app/routes/signup.tsx`** — On successful signup, calls `posthog.identify()` with username and email, and captures `user_signed_up`.
- **`app/routes/profile.tsx`** — On logout, captures `user_logged_out` and calls `posthog.reset()` to clear the session identity.
- **`app/routes/countries.tsx`** — Captures `country_claimed`, `country_liked`, and `country_visited` with `country` and `region` properties on each respective button click.
- **`app/routes/country.tsx`** — Captures `country_viewed` (top of engagement funnel) with country name, region, and subregion when a country detail page is loaded.
- **`vite.config.ts`** — Added `ssr.noExternal` for `posthog-js` and `@posthog/react` to ensure correct SSR behavior, and a dev proxy for PostHog ingestion.
- **`.env`** — Created with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`.

## Events

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | User successfully created a new account | `app/routes/signup.tsx` |
| `user_logged_in` | User successfully logged into their account | `app/routes/login.tsx` |
| `user_logged_out` | User clicked the logout button | `app/routes/profile.tsx` |
| `country_claimed` | User claimed a country as their own | `app/routes/countries.tsx` |
| `country_liked` | User liked a country | `app/routes/countries.tsx` |
| `country_visited` | User marked a country as visited | `app/routes/countries.tsx` |
| `country_viewed` | User viewed a specific country detail page | `app/routes/country.tsx` |

## Next steps

We've set up the event instrumentation. Here are suggested insights to build in PostHog based on the events above:

- **Signup → Engagement Funnel** — Track conversion from `user_signed_up` → `country_viewed` → `country_claimed`: [Build in PostHog](https://us.posthog.com/project/238460/insights/new?insight=FUNNELS)
- **Daily Active Users** — Trend of `user_logged_in` events over time: [Build in PostHog](https://us.posthog.com/project/238460/insights/new?insight=TRENDS)
- **Country Engagement Over Time** — Trend of `country_claimed` + `country_liked` + `country_visited`: [Build in PostHog](https://us.posthog.com/project/238460/insights/new?insight=TRENDS)
- **Top Claimed Countries** — `country_claimed` broken down by the `country` property: [Build in PostHog](https://us.posthog.com/project/238460/insights/new?insight=TRENDS)
- **Churn Signal** — Trend of `user_logged_out` events: [Build in PostHog](https://us.posthog.com/project/238460/insights/new?insight=TRENDS)

You can collect these into a new dashboard at: https://us.posthog.com/project/238460/dashboard

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
