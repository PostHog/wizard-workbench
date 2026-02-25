<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Router v7 (Framework mode) Country Explorer application. Here's a detailed summary of all changes made:

## Integration Summary

### New files created
- **`app/lib/posthog-middleware.ts`** — Server-side PostHog middleware that creates a PostHog Node client per request, extracts `X-POSTHOG-SESSION-ID` and `X-POSTHOG-DISTINCT-ID` headers (automatically set by the client SDK), and makes the client available via `context.posthog` for use in loaders/actions. This ensures client and server events can be correlated by session.
- **`.env`** — Environment variables `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST` added (and covered by `.gitignore`).

### Modified files
- **`vite.config.ts`** — Added `ssr: { noExternal: ['posthog-js', '@posthog/react'] }` to prevent SSR bundling errors with PostHog.
- **`react-router.config.ts`** — Enabled the `v8_middleware: true` future flag required for middleware support.
- **`app/entry.client.tsx`** — Initialised `posthog-js` with `VITE_PUBLIC_POSTHOG_KEY`, session/distinct ID tracing headers, and wrapped the app in `<PostHogProvider>` so all components can access PostHog via `usePostHog()`.
- **`app/root.tsx`** — Registered `posthogMiddleware` as a global middleware; added `usePostHog()` + `posthog?.captureException(error)` to the `ErrorBoundary` for automatic error tracking.
- **`app/routes/login.tsx`** — Added `posthog?.identify()` + `user_logged_in` on success; `user_login_failed` on failure.
- **`app/routes/signup.tsx`** — Added `posthog?.identify()` + `user_signed_up` on successful registration; `posthog?.captureException()` in the catch block.
- **`app/routes/profile.tsx`** — Wrapped the logout button in `handleLogout` which fires `user_logged_out` and calls `posthog?.reset()` to clear the identified user.
- **`app/routes/home.tsx`** — Added `explore_now_clicked` on the primary "Explore Now" CTA.
- **`app/routes/countries.tsx`** — Refactored inline click handlers into named handlers; added `country_claimed`, `country_liked`, `country_visited` with region/total properties; `country_list_filtered` on region select change; and `achievement_unlocked` automatically fired whenever a new achievement is earned as a side effect of any country action.
- **`app/routes/country.tsx`** — Added `country_detail_viewed` via `useEffect` on mount (valid use: syncing with an analytics external system), with country name, region, subregion, and population as properties.

## Tracked Events

| Event Name | Description | File |
|---|---|---|
| `user_signed_up` | Fired when a user successfully creates a new account | `app/routes/signup.tsx` |
| `user_logged_in` | Fired when a user successfully logs in | `app/routes/login.tsx` |
| `user_login_failed` | Fired when a login attempt fails (username not found) | `app/routes/login.tsx` |
| `user_logged_out` | Fired when a user clicks the Logout button | `app/routes/profile.tsx` |
| `explore_now_clicked` | Fired when the homepage "Explore Now" CTA is clicked | `app/routes/home.tsx` |
| `country_detail_viewed` | Fired when a user opens a country detail page (top of claim funnel) | `app/routes/country.tsx` |
| `country_claimed` | Fired when a user claims a country (primary conversion action) | `app/routes/countries.tsx` |
| `country_liked` | Fired when a user likes a country | `app/routes/countries.tsx` |
| `country_visited` | Fired when a user marks a country as visited | `app/routes/countries.tsx` |
| `country_list_filtered` | Fired when a user applies a region filter on the countries list | `app/routes/countries.tsx` |
| `achievement_unlocked` | Fired when a user earns a new achievement milestone | `app/routes/countries.tsx` |

## Next steps

We've recommended five insights for a new **"Analytics basics"** dashboard in your PostHog project. You can create these at:

👉 **PostHog Project Dashboard**: https://us.posthog.com/project/238460/dashboard

### Recommended insights to create:

1. **Signup & Login Funnel** — Tracks `user_signed_up` and `user_logged_in` over time. Baseline for understanding daily active growth and returning users.
   - https://us.posthog.com/project/238460/insights/new

2. **Country Claim Conversion Funnel** — A funnel from `explore_now_clicked` → `country_detail_viewed` → `country_claimed`. Shows where users drop off in the core engagement loop.
   - https://us.posthog.com/project/238460/insights/new

3. **Country Engagement Trends** — Trends chart comparing `country_claimed`, `country_liked`, and `country_visited` events per day. Shows overall engagement health.
   - https://us.posthog.com/project/238460/insights/new

4. **Achievement Unlock Rate** — Breakdown of `achievement_unlocked` by `achievement` property. Reveals which milestones users hit most (and least), indicating where engagement stalls.
   - https://us.posthog.com/project/238460/insights/new

5. **Churn Signal: Logouts** — Trends chart of `user_logged_out` over time. Spikes indicate friction or dissatisfaction events worth investigating with session replay.
   - https://us.posthog.com/project/238460/insights/new

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
