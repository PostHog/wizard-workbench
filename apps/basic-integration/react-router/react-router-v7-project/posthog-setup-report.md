<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Router v7 (Framework mode) application — CountryExplorer. The integration covers client-side event tracking, user identification on login and page refresh, server-side middleware for request-correlated events, error boundary capture, and a PostHog dashboard with five insights.

**Files created:**
- `app/entry.client.tsx` — PostHog initialized with `posthog-js`, `PostHogProvider` wraps the React tree; tracing headers enabled for client↔server correlation.
- `app/lib/posthog-middleware.ts` — Server-side PostHog Node client created per request; extracts `X-POSTHOG-SESSION-ID` and `X-POSTHOG-DISTINCT-ID` headers to correlate server events with the client session.

**Files modified:**
- `react-router.config.ts` — Enabled `v8_middleware: true` (required for server-side PostHog middleware).
- `vite.config.ts` — Added `ssr.noExternal` for `posthog-js`/`@posthog/react`, and configured a reverse proxy for `/ingest` routes.
- `app/root.tsx` — Wired `posthogMiddleware` into the root middleware array; added `posthog.captureException()` in `ErrorBoundary`.
- `app/context/AuthContext.tsx` — Added `posthog.identify()` on page load when a user is already logged in (returning visitor path).
- `app/routes/login.tsx` — `identify()` + `user_logged_in` capture on successful login.
- `app/routes/signup.tsx` — `identify()` + `user_signed_up` capture on successful signup.
- `app/routes/profile.tsx` — `user_logged_out` capture + `posthog.reset()` on logout.
- `app/routes/countries.tsx` — Captured `country_claimed`, `country_liked`, `country_visited`, `achievement_unlocked`, `country_searched`, `country_region_filtered`.
- `app/lib/utils/auth.ts` — `claimCountry`, `likeCountry`, `visitCountry` now return newly unlocked achievement names so the UI can fire `achievement_unlocked` events.

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | User successfully creates a new account via the signup form. | `app/routes/signup.tsx` |
| `user_logged_in` | User successfully logs into their account. | `app/routes/login.tsx` |
| `user_logged_out` | User clicks the logout button and their session is ended. | `app/routes/profile.tsx` |
| `country_claimed` | User claims a country, earning 100 points and potentially unlocking achievements. | `app/routes/countries.tsx` |
| `country_liked` | User likes a country, earning 10 points. | `app/routes/countries.tsx` |
| `country_visited` | User marks a country as visited, earning 50 points. | `app/routes/countries.tsx` |
| `achievement_unlocked` | User earns a new achievement milestone based on their activity. | `app/routes/countries.tsx` |
| `country_searched` | User types a search query to filter countries by name. | `app/routes/countries.tsx` |
| `country_region_filtered` | User filters the countries list by selecting a region. | `app/routes/countries.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1824594)
- **Insight**: [Signup to first claim funnel](https://us.posthog.com/project/483112/insights/QLUi3DyL)
- **Insight**: [New signups and logins over time](https://us.posthog.com/project/483112/insights/1EVBAS31)
- **Insight**: [Country interactions by type](https://us.posthog.com/project/483112/insights/dsiJgFvi)
- **Insight**: [Achievements unlocked over time](https://us.posthog.com/project/483112/insights/VsSq8pIE)
- **Insight**: [User churn — logouts vs logins](https://us.posthog.com/project/483112/insights/knRkGUOw)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the wizard added an `identify` call in `AuthContext` on mount when a user is found in localStorage, but verify this fires correctly after a hard refresh.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
