<wizard-report>
# PostHog post-wizard report

The wizard has completed a full client-side PostHog integration for the CountryExplorer React Router v7 (Framework mode) app. Here is a summary of all changes made:

- **`package.json`** — Added `posthog-js`, `@posthog/react`, and `posthog-node` as dependencies.
- **`.env`** — Created with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` environment variables.
- **`vite.config.ts`** — Added `ssr.noExternal` for `posthog-js` and `@posthog/react`; added a `/ingest` proxy for PostHog event ingestion.
- **`app/entry.client.tsx`** — Initialized PostHog with `posthog.init()` and wrapped the app with `<PostHogProvider>` to make the PostHog client available throughout the React tree.
- **`app/root.tsx`** — Added `usePostHog` in the `ErrorBoundary` to automatically capture unhandled React Router errors via `posthog.captureException()`.
- **`app/routes/login.tsx`** — On successful login, calls `posthog.identify()` to link the session to the user, then captures `user_logged_in`.
- **`app/routes/signup.tsx`** — On successful signup, calls `posthog.identify()` with user ID and properties, then captures `user_signed_up`.
- **`app/routes/profile.tsx`** — On logout button click, captures `user_logged_out` and calls `posthog.reset()` to clear the identity.
- **`app/routes/countries.tsx`** — Captures `country_claimed`, `country_liked`, and `country_visited` on the respective button clicks (only on first action, not on duplicates).
- **`app/routes/country.tsx`** — Captures `country_viewed` (with country name and region) when the country detail page mounts — the top of the engagement funnel.

## Events

| Event | Description | File |
|---|---|---|
| `user_signed_up` | Fired when a user successfully creates a new account | `app/routes/signup.tsx` |
| `user_logged_in` | Fired when a user successfully logs in; also identifies the user | `app/routes/login.tsx` |
| `user_logged_out` | Fired when a user logs out; also resets the PostHog identity | `app/routes/profile.tsx` |
| `country_claimed` | Fired when a user claims a country; includes country name and region | `app/routes/countries.tsx` |
| `country_liked` | Fired when a user likes a country; includes country name and region | `app/routes/countries.tsx` |
| `country_visited` | Fired when a user marks a country as visited; includes country name and region | `app/routes/countries.tsx` |
| `country_viewed` | Fired when a user views the detail page of a country; top of the engagement funnel | `app/routes/country.tsx` |

## Next steps

To build an "Analytics basics" dashboard in PostHog with these events, navigate to your PostHog project and create the following insights:

1. **Sign-ups over time** — Trends chart for `user_signed_up`
2. **Logins over time** — Trends chart for `user_logged_in`
3. **Country engagement** — Trends chart showing `country_claimed`, `country_liked`, and `country_visited` as three series
4. **Country engagement funnel** — Funnel: `country_viewed` → `country_claimed` (measures view-to-claim conversion rate)
5. **Signup to first claim funnel** — Funnel: `user_signed_up` → `country_claimed` (measures onboarding conversion)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
