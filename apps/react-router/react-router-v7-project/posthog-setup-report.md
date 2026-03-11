<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Country Explorer React Router v7 (Framework mode) project. The following changes were made:

- **`app/entry.client.tsx`**: Initialized the PostHog JS client with `posthog.init()` using environment variables. Wrapped the app in `<PostHogProvider>` to provide the client to all components via React context.
- **`app/lib/posthog-middleware.ts`** *(new)*: Created a server-side PostHog Node middleware that initializes a PostHog client per request, extracts `X-POSTHOG-SESSION-ID` and `X-POSTHOG-DISTINCT-ID` headers, and uses `withContext()` to correlate server events with the client session. Shuts down the client cleanly after each request.
- **`app/root.tsx`**: Exported the `posthogMiddleware` in the `middleware` array so it runs on all server-side requests. Added `usePostHog()` to `ErrorBoundary` to capture unhandled exceptions via `posthog.captureException(error)`.
- **`react-router.config.ts`**: Enabled `v8_middleware: true` in the `future` config to support the middleware export.
- **`vite.config.ts`**: Added `ssr.noExternal: ['posthog-js', '@posthog/react']` to prevent SSR bundling errors with the PostHog client-side libraries.
- **`app/routes/login.tsx`**: Added `posthog.identify(username)` and `posthog.capture('user_logged_in')` on successful login.
- **`app/routes/signup.tsx`**: Added `posthog.identify(newUser.id, { username, email })` and `posthog.capture('user_signed_up')` on successful signup.
- **`app/routes/profile.tsx`**: Added `posthog.capture('user_logged_out')` and `posthog.reset()` on logout button click.
- **`app/routes/countries.tsx`**: Added `posthog.capture('country_claimed')`, `posthog.capture('country_liked')`, and `posthog.capture('country_visited')` on their respective button clicks, with `country` and `region` properties.
- **`app/routes/country.tsx`**: Added a `useEffect` to capture `country_detail_viewed` when a user views a country's detail page (top of the exploration funnel).
- **`app/routes/home.tsx`**: Added `posthog.capture('explore_now_clicked')` on the primary CTA link click.
- **`.env`**: Set `VITE_PUBLIC_POSTHOG_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` environment variables.

## Events Instrumented

| Event Name | Description | File |
|---|---|---|
| `user_signed_up` | User successfully created a new account | `app/routes/signup.tsx` |
| `user_logged_in` | User successfully logged into their account | `app/routes/login.tsx` |
| `user_logged_out` | User logged out of their account | `app/routes/profile.tsx` |
| `country_claimed` | User claimed a country on the countries list page | `app/routes/countries.tsx` |
| `country_liked` | User liked a country on the countries list page | `app/routes/countries.tsx` |
| `country_visited` | User marked a country as visited on the countries list page | `app/routes/countries.tsx` |
| `country_detail_viewed` | User viewed the detail page for a specific country | `app/routes/country.tsx` |
| `explore_now_clicked` | User clicked the 'Explore Now' CTA on the homepage | `app/routes/home.tsx` |

## Next steps

We attempted to create a PostHog dashboard and insights automatically, but the API key available in this environment doesn't have the required `dashboard:write` and `insight:write` scopes. You can create the **"Analytics basics"** dashboard manually in your PostHog project with these recommended insights:

1. **Sign-up trend** — Trends chart for `user_signed_up` over time (daily). Tracks new user acquisition.
2. **User acquisition funnel** — Funnel: `explore_now_clicked` → `user_signed_up` → `country_claimed`. Measures conversion from landing to activation.
3. **Engagement: country actions** — Trends chart comparing `country_claimed`, `country_liked`, and `country_visited` over time. Measures core feature engagement.
4. **Country exploration funnel** — Funnel: `country_detail_viewed` → `country_claimed`. Shows how many users who view details go on to claim.
5. **Churn signal: logged-out users** — Trends chart for `user_logged_out` over time. A rising trend can signal dissatisfaction.

Navigate to [https://us.posthog.com/project/2/dashboards](https://us.posthog.com/project/2/dashboards) to create the dashboard.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
