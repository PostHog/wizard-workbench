<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your RESTExplorer React Router v7 (Framework mode) application. Here is a summary of all changes made:

- **`app/entry.client.tsx`** — Initialized `posthog-js` with your project token and host from environment variables. Wrapped `HydratedRouter` with `PostHogProvider` to make the PostHog client available throughout the app via React context.
- **`vite.config.ts`** — Added `ssr.noExternal` for `posthog-js` and `@posthog/react` (required for SSR), and added a `/ingest` proxy to route PostHog events through the local dev server (avoids CORS and ad-blockers).
- **`app/root.tsx`** — Added `posthog.captureException(error)` in the root `ErrorBoundary` to automatically capture all unhandled React Router errors.
- **`app/routes/login.tsx`** — Added `posthog.identify()` and `posthog.capture('user_logged_in')` on successful login.
- **`app/routes/signup.tsx`** — Added `posthog.identify()` and `posthog.capture('user_signed_up')` on successful signup.
- **`app/routes/profile.tsx`** — Added `posthog.capture('user_logged_out')` and `posthog.reset()` on logout to end the session.
- **`app/routes/countries.tsx`** — Added `posthog.capture('country_claimed')`, `posthog.capture('country_liked')`, and `posthog.capture('country_visited')` on respective button clicks, with `country` and `region` properties.
- **`app/routes/country.tsx`** — Added `posthog.capture('country_viewed')` when a country detail page loads (top of the claim/like/visit conversion funnel).
- **`.env`** — Created with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` environment variables.

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | Fired when a new user successfully creates an account. Also identifies the user in PostHog. | `app/routes/signup.tsx` |
| `user_logged_in` | Fired when an existing user successfully logs in. Also identifies the user in PostHog. | `app/routes/login.tsx` |
| `user_logged_out` | Fired when a user logs out. PostHog session is reset after this event. | `app/routes/profile.tsx` |
| `country_claimed` | Fired when a user claims a country. Includes `country` name and `region`. | `app/routes/countries.tsx` |
| `country_liked` | Fired when a user likes a country. Includes `country` name and `region`. | `app/routes/countries.tsx` |
| `country_visited` | Fired when a user marks a country as visited. Includes `country` name and `region`. | `app/routes/countries.tsx` |
| `country_viewed` | Fired when a user views a country detail page. Top of the claim/like/visit conversion funnel. | `app/routes/country.tsx` |

## Next steps

Here are some recommended insights to build in your [PostHog project](https://us.posthog.com/project/2):

1. **User signups trend** — Trend of `user_signed_up` over time to track growth.
2. **Country claim funnel** — Funnel from `country_viewed` → `country_claimed` to see conversion rate.
3. **Country engagement breakdown** — Stacked trend of `country_claimed`, `country_liked`, `country_visited` to see which action is most popular.
4. **Login vs Signup** — Compare `user_logged_in` and `user_signed_up` trends to understand returning vs new users.
5. **Most viewed countries** — Breakdown of `country_viewed` by `country` property to find the most popular countries.

You can create these at: https://us.posthog.com/project/2/insights/new

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
