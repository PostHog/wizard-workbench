<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CountryExplorer React Router v7 (Framework mode) project.

## What was added

- **Client-side SDK initialization** (`app/entry.client.tsx`): PostHog is initialized with `posthog-js` and wrapped in a `PostHogProvider` so all components have access via `usePostHog()`.
- **Server-side middleware** (`app/lib/posthog-middleware.ts`): A new PostHog Node middleware reads `X-POSTHOG-SESSION-ID` and `X-POSTHOG-DISTINCT-ID` headers automatically forwarded by the client SDK, ensuring server-side events are correlated with client-side sessions.
- **Middleware wired to root** (`app/root.tsx`): The middleware is exported so it runs on every request. The `ErrorBoundary` now captures unhandled errors via `posthog.captureException()`.
- **React Router v8 middleware flag** (`react-router.config.ts`): `future.v8_middleware: true` enabled.
- **Vite config** (`vite.config.ts`): Added SSR `noExternal` for `posthog-js` and `@posthog/react`, plus a `/ingest` proxy to forward PostHog requests.
- **Environment variables** (`.env`): `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` set.
- **User identification**: Login and signup both call `posthog.identify()` with the user's stable ID and properties. Logout calls `posthog.reset()`.
- **Event tracking**: 7 events instrumented across 5 files.

## Events

| Event | Description | File |
|---|---|---|
| `user_signed_up` | User successfully created a new account | `app/routes/signup.tsx` |
| `user_logged_in` | User successfully logged into their account | `app/routes/login.tsx` |
| `user_logged_out` | User logged out of their account | `app/routes/profile.tsx` |
| `country_claimed` | User claimed a country, earning 100 points | `app/routes/countries.tsx` |
| `country_liked` | User liked a country, earning 10 points | `app/routes/countries.tsx` |
| `country_visited` | User virtually visited a country, earning 50 points | `app/routes/countries.tsx` |
| `country_viewed` | User viewed a country detail page (top of engagement funnel) | `app/routes/country.tsx` |

## Next steps

We recommend building the following insights in your PostHog project to keep an eye on user behavior:

- **Signup-to-engagement funnel** — Funnel: `user_signed_up` → `country_viewed` → `country_claimed`. Reveals where new users drop off on their way to their first claim.
- **Country engagement trend** — Trend of `country_claimed`, `country_liked`, and `country_visited` over time. Shows overall engagement health.
- **User acquisition** — Trend of `user_signed_up` and `user_logged_in` per day. Track new vs. returning user activity.
- **Top claimed countries** — Bar chart of `country_claimed` grouped by `country` property. Discover which countries are most popular.
- **Session replay** — Automatically enabled via `posthog-js`. View replays at: https://us.posthog.com/project/2/replay

Build these insights and pin them to an **"Analytics basics"** dashboard at: https://us.posthog.com/project/2/dashboard

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
