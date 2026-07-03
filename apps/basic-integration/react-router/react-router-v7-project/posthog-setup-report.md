<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Router v7 (Framework mode) Country Explorer app. Here is a summary of all changes made:

- **`app/entry.client.tsx`** — Initialized `posthog-js` with the project token and host (via environment variables), configured reverse-proxy ingestion (`/ingest`), and wrapped the app in `<PostHogProvider>` for React hook access throughout the component tree.
- **`app/lib/posthog-middleware.ts`** *(new)* — Created a server-side PostHog middleware that creates a `posthog-node` client per request, reads the `X-POSTHOG-SESSION-ID` and `X-POSTHOG-DISTINCT-ID` headers (injected automatically by the client SDK), and uses `withContext()` to correlate client and server events.
- **`app/root.tsx`** — Registered the PostHog middleware array, and added `posthog.captureException(error)` in `ErrorBoundary` for automatic error tracking.
- **`react-router.config.ts`** — Enabled `future.v8_middleware: true` to allow the middleware pattern.
- **`vite.config.ts`** — Added `ssr.noExternal` for `posthog-js` and `@posthog/react`, and configured reverse-proxy routes (`/ingest/static`, `/ingest/array`, `/ingest`) to route PostHog traffic through the app server.
- **`app/routes/login.tsx`** — Added `posthog.identify()` and `posthog.capture('user_logged_in')` on successful login.
- **`app/routes/signup.tsx`** — Added `posthog.identify()` and `posthog.capture('user_signed_up')` on successful signup; added `posthog.captureException()` on signup errors.
- **`app/routes/profile.tsx`** — Added `posthog.capture('user_logged_out')` and `posthog.reset()` on logout.
- **`app/routes/countries.tsx`** — Added capture calls for `country_claimed`, `country_liked`, `country_visited`, `country_searched`, and `country_region_filtered` in their respective event handlers.
- **`app/routes/country.tsx`** — Added `posthog.capture('country_detail_viewed')` on country detail page render.

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `user_signed_up` | User successfully creates a new account via the signup form. | `app/routes/signup.tsx` |
| `user_logged_in` | User successfully logs in with their credentials. | `app/routes/login.tsx` |
| `user_logged_out` | User clicks the logout button on their profile page. | `app/routes/profile.tsx` |
| `country_claimed` | User claims a country, earning 100 points. | `app/routes/countries.tsx` |
| `country_liked` | User likes a country, earning 10 points. | `app/routes/countries.tsx` |
| `country_visited` | User marks a country as visited, earning 50 points. | `app/routes/countries.tsx` |
| `country_searched` | User types in the country search box to find a country by name. | `app/routes/countries.tsx` |
| `country_region_filtered` | User selects a region filter to narrow down the countries list. | `app/routes/countries.tsx` |
| `country_detail_viewed` | User views the detail page for a specific country. | `app/routes/country.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1793525)
- [Signups & Logins over time](https://us.posthog.com/project/483112/insights/y2Ragney)
- [Country engagement actions (claim / like / visit)](https://us.posthog.com/project/483112/insights/ogEfZo2a)
- [Country detail to claim funnel](https://us.posthog.com/project/483112/insights/NGpodaRw)
- [Signup to first country claim funnel](https://us.posthog.com/project/483112/insights/e0CdVV12)
- [User logouts (churn signal)](https://us.posthog.com/project/483112/insights/dGpZSoO2)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
