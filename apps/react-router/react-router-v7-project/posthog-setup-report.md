<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the RESTExplorer React Router v7 (Framework mode) application. Here's a summary of all changes made:

- **`app/entry.client.tsx`** — Initialized `posthog-js` with the project token and host from environment variables. Wrapped the app with `<PostHogProvider>` to make PostHog available throughout the component tree. Added `__add_tracing_headers` to automatically correlate client and server-side events.
- **`app/lib/posthog-middleware.ts`** *(new file)* — Created a React Router v7 middleware that instantiates a server-side `posthog-node` client per request, extracts `X-POSTHOG-SESSION-ID` and `X-POSTHOG-DISTINCT-ID` headers from the client, and uses `withContext()` to associate all server-side events with the correct user session.
- **`app/root.tsx`** — Added the PostHog middleware export so it runs on every server request. Added `usePostHog()` with `captureException()` in the `ErrorBoundary` to automatically capture unhandled React Router errors.
- **`app/routes/login.tsx`** — On successful login, calls `posthog.identify()` with the username and captures the `user_logged_in` event.
- **`app/routes/signup.tsx`** — On successful signup, calls `posthog.identify()` with the new user's ID, username, and email, then captures the `user_signed_up` event.
- **`app/routes/profile.tsx`** — Added a `handleLogout` function that captures `user_logged_out` and calls `posthog.reset()` before logging out, ensuring the user session is properly ended.
- **`app/routes/countries.tsx`** — Added `country_claimed`, `country_liked`, and `country_visited` captures on the respective action buttons, with `country` and `region` properties.
- **`app/routes/home.tsx`** — Added `explore_now_clicked` capture on the "Explore Now" CTA link, tracking the top of the user acquisition funnel.
- **`vite.config.ts`** — Added `ssr.noExternal` for `posthog-js` and `@posthog/react` to ensure correct SSR bundling.
- **`react-router.config.ts`** — Enabled `future.v8_middleware` to support React Router v7 middleware.

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | Fired when a new user successfully creates an account | `app/routes/signup.tsx` |
| `user_logged_in` | Fired when a user successfully logs in; also identifies the user | `app/routes/login.tsx` |
| `user_logged_out` | Fired when a user clicks the logout button | `app/routes/profile.tsx` |
| `country_claimed` | Fired when a user claims a country; includes `country` and `region` properties | `app/routes/countries.tsx` |
| `country_liked` | Fired when a user likes a country; includes `country` and `region` properties | `app/routes/countries.tsx` |
| `country_visited` | Fired when a user marks a country as visited; includes `country` and `region` properties | `app/routes/countries.tsx` |
| `explore_now_clicked` | Fired when a visitor clicks the "Explore Now" CTA — top of the conversion funnel | `app/routes/home.tsx` |

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog with these insights:

1. **Signup-to-login conversion funnel** — Funnel: `user_signed_up` → `explore_now_clicked` → `country_claimed`. Tracks how well new users complete the core loop.
2. **User signups over time** — Trends chart of `user_signed_up` to monitor growth.
3. **Country engagement breakdown** — Stacked bar chart of `country_claimed`, `country_liked`, and `country_visited` to see which actions users take most.
4. **Explore Now CTA clicks** — Trends chart of `explore_now_clicked` to monitor homepage-to-countries funnel entry.
5. **User retention** — Retention insight using `user_logged_in` as the start event to see how many users return over time.

Visit your PostHog project to create these insights:
- [PostHog Project Dashboard](https://us.posthog.com/project/238460/dashboard)
- [Create new insight](https://us.posthog.com/project/238460/insights/new)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
