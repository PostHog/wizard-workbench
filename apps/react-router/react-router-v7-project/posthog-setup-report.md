<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Router v7 Framework mode project (CountryExplorer). The following changes were made:

**Infrastructure setup:**
- `entry.client.tsx` — Initialised `posthog-js` and wrapped the app with `PostHogProvider` so all client-side components can access PostHog via `usePostHog()`.
- `app/lib/posthog-middleware.ts` — Created server-side PostHog middleware using `posthog-node`. It extracts `X-POSTHOG-SESSION-ID` and `X-POSTHOG-DISTINCT-ID` headers (automatically set by the client SDK) and makes the PostHog client available to all route handlers via request context.
- `root.tsx` — Registered the PostHog middleware, and added `posthog.captureException()` inside the `ErrorBoundary` for automatic unhandled error tracking.
- `react-router.config.ts` — Enabled the `v8_middleware: true` future flag required for middleware support.
- `vite.config.ts` — Added `ssr.noExternal` for `posthog-js` and `@posthog/react`, and a `/ingest` proxy for local development.
- `.env` — Added `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` environment variables.

**Event tracking added:**

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | Fired when a new user successfully creates an account. User is identified with `posthog.identify()` on success. | `app/routes/signup.tsx` |
| `user_logged_in` | Fired when a user successfully logs in. User is identified with `posthog.identify()` on success. | `app/routes/login.tsx` |
| `user_logged_out` | Fired when a user clicks logout. Followed by `posthog.reset()` to clear the session. | `app/routes/profile.tsx` |
| `country_claimed` | Fired when a user claims a country. Includes `country` and `region` properties. | `app/routes/countries.tsx` |
| `country_liked` | Fired when a user likes a country. Includes `country` and `region` properties. | `app/routes/countries.tsx` |
| `country_visited` | Fired when a user marks a country as visited. Includes `country` and `region` properties. | `app/routes/countries.tsx` |
| `country_detail_viewed` | Fired when a user views a country detail page (top of claim funnel). Includes `country` and `region` properties. | `app/routes/country.tsx` |
| `countries_searched` | Fired when a user types into the country search box. Includes `search_term` property. | `app/routes/countries.tsx` |
| `countries_region_filtered` | Fired when a user filters countries by region. Includes `region` property. | `app/routes/countries.tsx` |

## Next steps

We recommend building an **"Analytics basics"** dashboard in PostHog with the following five insights:

1. **Signup & Login trend** — Trend chart of `user_signed_up` and `user_logged_in` over time. Tracks user acquisition and returning engagement.
   - [Create this insight](https://us.posthog.com/project/238460/insights/new#{"insight":"TRENDS","events":[{"id":"user_signed_up","name":"user_signed_up","type":"events"},{"id":"user_logged_in","name":"user_logged_in","type":"events"}]})

2. **Country claim funnel** — Funnel from `country_detail_viewed` → `country_claimed`. Shows how many users who view a country go on to claim it.
   - [Create this insight](https://us.posthog.com/project/238460/insights/new#{"insight":"FUNNELS","events":[{"id":"country_detail_viewed","name":"country_detail_viewed","type":"events"},{"id":"country_claimed","name":"country_claimed","type":"events"}]})

3. **Engagement actions trend** — Trend chart of `country_claimed`, `country_liked`, and `country_visited` over time. Tracks core engagement actions.
   - [Create this insight](https://us.posthog.com/project/238460/insights/new#{"insight":"TRENDS","events":[{"id":"country_claimed","name":"country_claimed","type":"events"},{"id":"country_liked","name":"country_liked","type":"events"},{"id":"country_visited","name":"country_visited","type":"events"}]})

4. **Top searched terms** — Breakdown of `countries_searched` by `search_term` property. Shows which countries users are looking for.
   - [Create this insight](https://us.posthog.com/project/238460/insights/new)

5. **Churn signal: Logout trend** — Trend chart of `user_logged_out` over time. Spike in logouts can signal user dissatisfaction.
   - [Create this insight](https://us.posthog.com/project/238460/insights/new#{"insight":"TRENDS","events":[{"id":"user_logged_out","name":"user_logged_out","type":"events"}]})

[Go to your PostHog project dashboard](https://us.posthog.com/project/238460/dashboard)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
