<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Country Explorer React Router v7 (Framework mode) application. Here's a summary of all changes made:

**Packages installed:** `posthog-js`, `@posthog/react`, `posthog-node`

**`app/entry.client.tsx`** — PostHog is initialized with `posthog.init()` and the entire app is wrapped in `<PostHogProvider>`. This enables automatic pageview tracking and provides the `usePostHog()` hook to all components. The `__add_tracing_headers` option is enabled for client-server session correlation.

**`vite.config.ts`** — Added `ssr.noExternal` config for `posthog-js` and `@posthog/react` to ensure proper SSR bundling.

**`app/root.tsx`** — The `ErrorBoundary` now captures all unhandled React Router errors via `posthog.captureException()`.

**`app/routes/login.tsx`** — On successful login, the user is identified via `posthog.identify()` and a `user_logged_in` event is captured.

**`app/routes/signup.tsx`** — On successful signup, the user is identified via `posthog.identify()` with their username and email, and a `user_signed_up` event is captured. Errors during signup are also tracked via `captureException`.

**`app/routes/profile.tsx`** — The logout button now captures a `user_logged_out` event and calls `posthog.reset()` to clear the user identity before logging out.

**`app/routes/countries.tsx`** — Three action buttons now capture events: `country_claimed`, `country_liked`, and `country_visited`. Each event includes the country name and region as properties. Events are only captured for new actions (not already-claimed/liked/visited).

**`app/routes/country.tsx`** — A `country_detail_viewed` event is fired when a country detail page loads, capturing the country name and region. This marks the top of the exploration funnel.

**`app/routes/home.tsx`** — The "Explore Now" CTA button captures an `explore_now_clicked` event when clicked.

**.env** — `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` environment variables have been set.

## Events tracked

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | User successfully created a new account | `app/routes/signup.tsx` |
| `user_logged_in` | User successfully logged in (also identifies user) | `app/routes/login.tsx` |
| `user_logged_out` | User clicked the logout button | `app/routes/profile.tsx` |
| `country_claimed` | User claimed a country, earning 100 points | `app/routes/countries.tsx` |
| `country_liked` | User liked a country, earning 10 points | `app/routes/countries.tsx` |
| `country_visited` | User virtually visited a country, earning 50 points | `app/routes/countries.tsx` |
| `country_detail_viewed` | User viewed a country detail page (top of funnel) | `app/routes/country.tsx` |
| `explore_now_clicked` | User clicked the "Explore Now" CTA on home page | `app/routes/home.tsx` |

## Next steps

Visit your [PostHog project](https://us.posthog.com/project/2) to view incoming events once your app is running. We recommend creating an **"Analytics basics"** dashboard with these five insights:

1. **Signup conversion funnel** — Funnel: `explore_now_clicked` → `country_detail_viewed` → `country_claimed` — tracks the main conversion path from homepage CTA to first country claim.

2. **New signups over time** — Trend: `user_signed_up` count over time — monitors user growth.

3. **Country engagement** — Trend: `country_claimed`, `country_liked`, `country_visited` as separate series — tracks core engagement actions.

4. **Auth events** — Trend: `user_logged_in` vs `user_signed_up` — reveals new vs returning user activity.

5. **Top claimed countries** — Table: `country_claimed` broken down by `country` property — shows which countries are most popular.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
