<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Country Explorer React Router v7 app. The following changes were made:

- **`app/entry.client.tsx`** — Initialized PostHog with `posthog-js`, wrapped the app in `PostHogProvider`, and enabled the `__add_tracing_headers` option so client-side session and distinct IDs are automatically forwarded to server-side requests.
- **`app/lib/posthog-middleware.ts`** _(new)_ — Server-side PostHog middleware that creates a per-request PostHog Node client, extracts session/distinct ID from request headers, and shuts down cleanly after each request.
- **`app/root.tsx`** — Exported the `posthogMiddleware` as root middleware, and added `posthog.captureException(error)` in the `ErrorBoundary` for automatic error tracking.
- **`app/routes/login.tsx`** — Added `posthog.identify()` and `user_logged_in` event on successful login.
- **`app/routes/signup.tsx`** — Added `posthog.identify()` and `user_signed_up` event on successful signup.
- **`app/routes/profile.tsx`** — Added `user_logged_out` event and `posthog.reset()` on logout.
- **`app/routes/countries.tsx`** — Added `country_claimed`, `country_liked`, and `country_visited` events with `country` and `region` properties.
- **`app/routes/country.tsx`** — Added `country_detail_viewed` event on page load (top of the claim/like/visit funnel).
- **`react-router.config.ts`** — Enabled `v8_middleware: true` for middleware support.
- **`vite.config.ts`** — Added `ssr.noExternal` for `posthog-js`/`@posthog/react`, and configured a reverse proxy for `/ingest` routes.
- **`.env`** — Set `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`.

## Events

| Event | Description | File |
|---|---|---|
| `user_signed_up` | Fired when a user successfully creates a new account; also identifies the user | `app/routes/signup.tsx` |
| `user_logged_in` | Fired when a user successfully logs in; also identifies the user | `app/routes/login.tsx` |
| `user_logged_out` | Fired when a user logs out; also resets PostHog identity | `app/routes/profile.tsx` |
| `country_claimed` | Fired when a user claims a country, with `country` and `region` properties | `app/routes/countries.tsx` |
| `country_liked` | Fired when a user likes a country, with `country` and `region` properties | `app/routes/countries.tsx` |
| `country_visited` | Fired when a user marks a country as visited, with `country` and `region` properties | `app/routes/countries.tsx` |
| `country_detail_viewed` | Fired on country detail page load (top of conversion funnel), with `country`, `region`, `subregion`, `population` | `app/routes/country.tsx` |

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog with these five insights:

1. **Signup/Login funnel** — Funnel: `user_signed_up` → `user_logged_in` (conversion from signup to first login)
2. **Country claim funnel** — Funnel: `country_detail_viewed` → `country_claimed` (conversion from browsing to claiming)
3. **Daily active users** — Trends: unique users for `user_logged_in` per day
4. **Country engagement breakdown** — Trends: `country_claimed`, `country_liked`, `country_visited` on the same chart
5. **Logout / churn trend** — Trends: `user_logged_out` over time (churn signal)

To create this dashboard, visit your PostHog project at https://us.posthog.com/project/2/dashboard and add a new dashboard named "Analytics basics".

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
