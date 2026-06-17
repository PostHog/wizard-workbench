# PostHog post-wizard report

The wizard has completed a PostHog integration for this React Router v7 (Framework mode) application — a "Country Explorer" game where users sign up, claim/like/visit countries, and compete on a leaderboard.

**Changes made:**

- `app/entry.client.tsx` — Initialized PostHog (`posthog-js`) with `PostHogProvider` wrapping the `HydratedRouter`, connecting to the `/ingest` reverse proxy with tracing headers enabled.
- `vite.config.ts` — Added `ssr.noExternal` for `posthog-js`/`@posthog/react` and a `/ingest` reverse proxy to route PostHog traffic through the app server.
- `app/root.tsx` — Added `captureException` in the `ErrorBoundary` to track unhandled route errors.
- `app/routes/login.tsx` — Added `posthog.identify()` and `user_logged_in` capture on successful login.
- `app/routes/signup.tsx` — Added `posthog.identify()` and `user_signed_up` capture on successful signup, plus `captureException` in the error catch.
- `app/routes/profile.tsx` — Added `user_logged_out` capture and `posthog.reset()` when the logout button is clicked.
- `app/routes/countries.tsx` — Added `country_claimed`, `country_liked`, `country_visited` captures on the respective action buttons, and `country_searched` on name/region filter changes.
- `.env` — Created with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`.

| Event | Description | File |
|---|---|---|
| `user_signed_up` | User successfully created a new account | `app/routes/signup.tsx` |
| `user_logged_in` | User successfully authenticated | `app/routes/login.tsx` |
| `user_logged_out` | User clicked the logout button | `app/routes/profile.tsx` |
| `country_claimed` | User claimed a country (earns 100 pts) | `app/routes/countries.tsx` |
| `country_liked` | User liked a country (earns 10 pts) | `app/routes/countries.tsx` |
| `country_visited` | User virtually visited a country (earns 50 pts) | `app/routes/countries.tsx` |
| `country_searched` | User searched/filtered the countries list | `app/routes/countries.tsx` |

## Next steps

A dashboard could not be auto-created in this run because the PostHog MCP API key is missing the `dashboard:write` and `insight:write` scopes. You can create it manually:

- [Create a new dashboard](https://us.posthog.com/project/2/dashboard) — name it **"Analytics basics (wizard)"**
- [New insight](https://us.posthog.com/project/2/insights/new) — suggested insights to add:

  1. **Signup → Login funnel** — Funnel with steps `user_signed_up` → `user_logged_in` to measure conversion.
  2. **Country actions over time** — Trends with `country_claimed`, `country_liked`, `country_visited` as three series.
  3. **Country search usage** — Trends for `country_searched` broken down by `filter_type` (name vs. region).
  4. **User signups over time** — Trends for `user_signed_up` to track acquisition.
  5. **Churn signal** — Trends for `user_logged_out` to watch for drop-off patterns.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
