<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Router v7 (Framework mode) CountryExplorer application. Here is a summary of all changes made:

**New packages installed:** `posthog-js`, `@posthog/react`, `posthog-node`

**Environment variables configured:** `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN`, `VITE_PUBLIC_POSTHOG_HOST` in `.env`

**Files created or modified:**

- **`app/entry.client.tsx`** — Initializes PostHog (`posthog-js`) on the client side with `PostHogProvider` wrapping the app. Enables `__add_tracing_headers` to correlate client and server events.
- **`app/lib/posthog-middleware.ts`** *(new)* — Server-side PostHog middleware using `posthog-node`. Creates a per-request PostHog client, extracts `X-POSTHOG-SESSION-ID` / `X-POSTHOG-DISTINCT-ID` headers from the client SDK, and wires them via `withContext()` for session correlation.
- **`app/root.tsx`** — Registers `posthogMiddleware` for all routes. Adds `captureException` in `ErrorBoundary` for automatic error tracking.
- **`react-router.config.ts`** — Enables `v8_middleware: true` future flag required for middleware support.
- **`vite.config.ts`** — Adds `ssr.noExternal` for `posthog-js`/`@posthog/react`, dev-server proxy for `/ingest` routes (reverse proxy support).
- **`app/routes/login.tsx`** — Identifies the user (`posthog.identify`) and captures `user_logged_in` on successful login.
- **`app/routes/signup.tsx`** — Identifies the new user with their ID/email and captures `user_signed_up` on successful signup.
- **`app/routes/profile.tsx`** — Captures `user_logged_out` and calls `posthog.reset()` when the logout button is clicked.
- **`app/routes/countries.tsx`** — Captures `country_claimed`, `country_liked`, and `country_visited` with `country` and `region` properties when users interact with country cards.
- **`app/routes/country.tsx`** — Captures `country_viewed` with `country` and `region` properties when a user opens a country detail page (top of engagement funnel).

| Event | Description | File |
|---|---|---|
| `user_signed_up` | User successfully created a new account | `app/routes/signup.tsx` |
| `user_logged_in` | User successfully logged in (also identifies the user) | `app/routes/login.tsx` |
| `user_logged_out` | User clicked the logout button | `app/routes/profile.tsx` |
| `country_claimed` | User claimed a country, earning 100 points | `app/routes/countries.tsx` |
| `country_liked` | User liked a country, earning 10 points | `app/routes/countries.tsx` |
| `country_visited` | User virtually visited a country, earning 50 points | `app/routes/countries.tsx` |
| `country_viewed` | User viewed a country detail page (top of engagement funnel) | `app/routes/country.tsx` |

## Next steps

We've designed some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented. Visit your PostHog project to create these:

**[→ Open PostHog Project Dashboard](https://us.posthog.com/project/2/dashboard)**

Suggested "Analytics basics" dashboard insights:

1. **User Acquisition Trend** — Trends insight: `user_signed_up` and `user_logged_in` over time. Shows new user growth and returning user activity.
   [Create insight](https://us.posthog.com/project/2/insights/new)

2. **Sign-up Conversion Funnel** — Funnel insight with steps: `country_viewed` → `user_signed_up`. Measures what percentage of people who view a country go on to sign up.
   [Create funnel](https://us.posthog.com/project/2/insights/new)

3. **Country Engagement Over Time** — Trends insight: `country_claimed`, `country_liked`, `country_visited` as separate series. Shows which interactions are most popular.
   [Create insight](https://us.posthog.com/project/2/insights/new)

4. **Top Claimed Countries** — Trends insight: `country_claimed` broken down by `country` property. Shows which countries users claim most.
   [Create insight](https://us.posthog.com/project/2/insights/new)

5. **User Retention** — Retention insight: users who triggered `user_logged_in` and came back to trigger `country_claimed`. Identifies engaged, retained users vs. churn.
   [Create retention insight](https://us.posthog.com/project/2/insights/new)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
