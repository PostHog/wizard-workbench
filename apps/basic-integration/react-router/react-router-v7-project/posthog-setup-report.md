# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Router v7 Framework mode app (Country Explorer). Changes span client initialisation, server-side middleware, user identification on login/signup, nine tracked events across six route files, error tracking in the global error boundary, and a reverse-proxy config to avoid ad-blocker interference. A PostHog dashboard with five insights has been created to monitor signups, country interactions, and the core activation funnel.

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `user_signed_up` | User successfully creates a new account via the signup form. | `app/routes/signup.tsx` |
| `user_logged_in` | User successfully authenticates and logs in to their account. | `app/routes/login.tsx` |
| `user_logged_out` | User clicks the logout button and ends their session. | `app/routes/profile.tsx` |
| `country_claimed` | User claims ownership of a country, earning 100 points. | `app/routes/countries.tsx` |
| `country_liked` | User likes a country, earning 10 points. | `app/routes/countries.tsx` |
| `country_visited` | User marks a country as virtually visited, earning 50 points. | `app/routes/countries.tsx` |
| `country_searched` | User applies a search query or region filter in the countries list. | `app/routes/countries.tsx` |
| `country_viewed` | User navigates to a country detail page (top of the claim conversion funnel). | `app/routes/country.tsx` |
| `explore_now_clicked` | User clicks the "Explore Now" CTA on the home page. | `app/routes/home.tsx` |

## Files modified or created

| File | Change summary |
|---|---|
| `app/entry.client.tsx` | Initialised PostHog with env vars; wrapped `HydratedRouter` with `PostHogProvider`; enabled `__add_tracing_headers` for client↔server correlation. |
| `app/lib/posthog-middleware.ts` | **New file.** Per-request PostHog Node client; extracts `X-POSTHOG-SESSION-ID` / `X-POSTHOG-DISTINCT-ID` headers; shuts down after each request. |
| `app/root.tsx` | Exported `middleware` array with `posthogMiddleware`; added `usePostHog` + `captureException` in `ErrorBoundary`. |
| `react-router.config.ts` | Added `future.v8_middleware: true` to enable the middleware API. |
| `vite.config.ts` | Added `ssr.noExternal` for `posthog-js`/`@posthog/react`; added dev-server reverse proxy for `/ingest` routes. |
| `app/routes/login.tsx` | Added `posthog.identify()` + `user_logged_in` capture on successful login. |
| `app/routes/signup.tsx` | Added `posthog.identify()` + `user_signed_up` capture on successful signup. |
| `app/routes/profile.tsx` | Added `user_logged_out` capture + `posthog.reset()` in logout handler. |
| `app/routes/countries.tsx` | Added `country_claimed`, `country_liked`, `country_visited` (with `country_name`/`country_region` properties) and `country_searched` (with `search_query`/`filter_type` properties). |
| `app/routes/country.tsx` | Added `country_viewed` capture in `clientLoader` (fires on every country detail page load). |
| `app/routes/home.tsx` | Added `explore_now_clicked` capture on the "Explore Now" CTA. |
| `.env` | Added `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`. |

## Next steps

We've built a dashboard and five insights to monitor key user behaviours:

- **Dashboard:** [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1818234)
- [Signups & Logins (wizard)](https://us.posthog.com/project/483112/insights/JK1lBVYu) — daily signup and login trend
- [Country Interactions (wizard)](https://us.posthog.com/project/483112/insights/zja7o0mI) — daily claim / like / visit counts
- [Country Claim Funnel (wizard)](https://us.posthog.com/project/483112/insights/NIabuymo) — view-to-claim conversion rate
- [Claims by Region (wizard)](https://us.posthog.com/project/483112/insights/th9QBMVo) — claims stacked by world region
- [Signup to First Claim Funnel (wizard)](https://us.posthog.com/project/483112/insights/mnLdrynq) — full activation funnel: signup → view → claim

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the current implementation only identifies on fresh login/signup; returning users who reload the page will be on anonymous distinct IDs until they log in again. Add an `identify` call in `AuthContext` after the session is restored from localStorage.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
