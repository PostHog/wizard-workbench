<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your React Router v7 (Framework mode) CountryExplorer project. Here is a summary of all changes made:

**Packages installed:** `posthog-js`, `@posthog/react`

**Environment configured:** `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` written to `.env`.

**Client-side initialization** (`app/entry.client.tsx`): PostHog is initialized with the project token and host, and the `HydratedRouter` is wrapped in `PostHogProvider` to make the PostHog client available throughout the React tree.

**SSR support** (`vite.config.ts`): Added `ssr.noExternal` for `posthog-js` and `@posthog/react` to ensure the packages are bundled correctly during server-side rendering.

**Error tracking** (`app/root.tsx`): The `ErrorBoundary` component now calls `posthog.captureException(error)` to automatically capture unhandled React Router errors.

**User identification**: On successful login (`app/routes/login.tsx`) and signup (`app/routes/signup.tsx`), `posthog.identify()` is called with the username and email to tie events to a specific user. On logout, `posthog.reset()` is called to clear the identity.

**Event tracking**: Nine events are now captured across six route files.

| Event Name | Description | File |
|---|---|---|
| `user_signed_up` | User successfully completes signup | `app/routes/signup.tsx` |
| `user_logged_in` | User successfully logs in | `app/routes/login.tsx` |
| `login_failed` | Login attempt fails due to invalid credentials | `app/routes/login.tsx` |
| `user_logged_out` | User clicks the logout button | `app/routes/profile.tsx` |
| `country_claimed` | User claims a country | `app/routes/countries.tsx` |
| `country_liked` | User likes a country | `app/routes/countries.tsx` |
| `country_visited` | User marks a country as visited | `app/routes/countries.tsx` |
| `country_viewed` | User views a country detail page (top of claim funnel) | `app/routes/country.tsx` |
| `explore_cta_clicked` | User clicks the Explore Now CTA on the home page | `app/routes/home.tsx` |

## Next steps

We've prepared an "Analytics basics" dashboard for you to keep an eye on user behavior, based on the events we just instrumented. Suggested insights to add:

1. **Signup conversion funnel** — `explore_cta_clicked` → `user_signed_up` (tracks top-of-funnel to registration)
2. **Country claim funnel** — `country_viewed` → `country_claimed` (tracks country discovery to claiming)
3. **User signups over time** — Trend of `user_signed_up` (monitors growth)
4. **Login success rate** — `user_logged_in` vs `login_failed` (monitors auth health)
5. **Country engagement breakdown** — `country_claimed`, `country_liked`, `country_visited` side by side (monitors core feature usage)

- [Analytics basics dashboard](https://us.posthog.com/project/2/dashboard/1346453)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
