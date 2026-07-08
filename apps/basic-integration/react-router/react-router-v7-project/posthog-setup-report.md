<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Country Explorer React Router v7 application. The SDK (`posthog-js` and `@posthog/react`) was installed and initialized in `entry.client.tsx` with a reverse proxy configured in `vite.config.ts`. The app is wrapped with `PostHogProvider` for context-based access throughout. Twelve events were instrumented across six files covering the full user journey: authentication (signup, login, logout), home page CTA engagement, all three country interaction types (claim, like, visit), search and filter usage, and country detail views. User identification via `posthog.identify()` is called on both signup and login, with `posthog.reset()` called on logout. Error tracking via `captureException` was added to the root `ErrorBoundary`.

| Event Name | Description | File |
|---|---|---|
| `user_signed_up` | User successfully created a new account. | `app/routes/signup.tsx` |
| `signup_failed` | User attempted to sign up but the signup process failed. | `app/routes/signup.tsx` |
| `user_logged_in` | User successfully logged in to their account. | `app/routes/login.tsx` |
| `login_failed` | User attempted to log in but authentication failed. | `app/routes/login.tsx` |
| `user_logged_out` | User clicked the logout button and ended their session. | `app/routes/profile.tsx` |
| `explore_cta_clicked` | User clicked the 'Explore Now' CTA on the home page. | `app/routes/home.tsx` |
| `country_claimed` | User claimed a country, earning 100 points. | `app/routes/countries.tsx` |
| `country_liked` | User liked a country, earning 10 points. | `app/routes/countries.tsx` |
| `country_visited` | User marked a country as visited, earning 50 points. | `app/routes/countries.tsx` |
| `countries_searched` | User typed a search query to filter the countries list. | `app/routes/countries.tsx` |
| `countries_filtered_by_region` | User selected a region filter to narrow down the countries list. | `app/routes/countries.tsx` |
| `country_detail_viewed` | User navigated to a country's detail page. | `app/routes/country.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1816752)
- [Authentication Conversion Funnel](https://us.posthog.com/project/483112/insights/DUl11CuH) — Explore CTA → Signup conversion steps
- [Signups & Logins Over Time](https://us.posthog.com/project/483112/insights/yeej0zVg) — Daily trend of new users and returning logins
- [Country Engagement Actions](https://us.posthog.com/project/483112/insights/3JbJWrdr) — Claim, like, and visit actions compared over time
- [Country Claims by Region](https://us.posthog.com/project/483112/insights/puB1PxrO) — Which world regions users claim most
- [Login vs Signup Failure Rate](https://us.posthog.com/project/483112/insights/RBUwBcoh) — Auth success vs failure to spot friction

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — currently `identify` is only called on fresh login/signup; add it on app init for already-authenticated users (e.g. in `AuthContext` when the stored user is loaded from localStorage).

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
