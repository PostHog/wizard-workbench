<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Country Explorer React Router v7 (Framework mode) application. Here is a summary of all changes made:

**SDK installation**: `posthog-js`, `@posthog/react`, and `posthog-node` were added as dependencies.

**PostHog initialization** (`app/entry.client.tsx`): PostHog is initialised on the client side with the project token and host from environment variables. The `PostHogProvider` wraps the entire `HydratedRouter` so all components can access `usePostHog()`.

**Reverse proxy** (`vite.config.ts`): A Vite dev-server proxy was added for `/ingest/*` routes, routing analytics traffic through the local server to avoid ad-blocker interference. `ssr.noExternal` was set for `posthog-js` and `@posthog/react` to ensure correct SSR bundling.

**Error tracking** (`app/root.tsx`): The root `ErrorBoundary` now calls `posthog.captureException(error)` so all unhandled React Router errors are captured automatically.

**User identification & auth events** (`app/routes/login.tsx`, `app/routes/signup.tsx`, `app/routes/profile.tsx`): Users are identified via `posthog.identify()` on successful login and signup. Login, signup, and logout events are captured with relevant user properties, and `posthog.reset()` is called on logout to clear the session identity.

**Country engagement events** (`app/routes/countries.tsx`): Events are captured when a user claims, likes, or visits a country (including `country_name` and `region` properties). Search and filter activity is captured as `country_searched`.

**Exploration funnel** (`app/routes/country.tsx`): A `country_detail_viewed` event is fired when a user opens the country detail page, marking the top of the claim conversion funnel.

**Environment variables** (`.env`): `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` were written to `.env` and are covered by `.gitignore`.

## Events

| Event | Description | File |
|---|---|---|
| `user_signed_up` | Fired when a user successfully creates a new account | `app/routes/signup.tsx` |
| `user_logged_in` | Fired when a user successfully logs in; also identifies the user | `app/routes/login.tsx` |
| `user_logged_out` | Fired when a user clicks Logout; PostHog identity is reset | `app/routes/profile.tsx` |
| `country_claimed` | Fired when a user claims a country; includes `country_name` and `region` | `app/routes/countries.tsx` |
| `country_liked` | Fired when a user likes a country; includes `country_name` and `region` | `app/routes/countries.tsx` |
| `country_visited` | Fired when a user marks a country as visited; includes `country_name` and `region` | `app/routes/countries.tsx` |
| `country_searched` | Fired when a user searches or applies a region filter | `app/routes/countries.tsx` |
| `country_detail_viewed` | Top-of-funnel event when a user views a country detail page | `app/routes/country.tsx` |

## Next steps

We've designed five insights for an **Analytics basics** dashboard to monitor key user behavior. Create each insight in PostHog and add them to a new dashboard named "Analytics basics":

1. **Signup → Login trend** — Go to [Insights → New insight → Trends](https://us.posthog.com/project/2/insights/new) and add `user_signed_up` and `user_logged_in` as two series to compare daily signup vs login volume.

2. **Country claim funnel** — Go to [Insights → New insight → Funnel](https://us.posthog.com/project/2/insights/new) and add steps: `country_detail_viewed` → `country_claimed`. This shows the conversion rate from viewing a country to claiming it.

3. **Country engagement breakdown** — Go to [Insights → New insight → Trends](https://us.posthog.com/project/2/insights/new) and add `country_claimed`, `country_liked`, and `country_visited` as three series to track overall engagement volume.

4. **Daily active users** — Go to [Insights → New insight → Trends](https://us.posthog.com/project/2/insights/new), add `user_logged_in` with **count** set to **Unique users** to monitor daily active users.

5. **Logout / churn signal** — Go to [Insights → New insight → Trends](https://us.posthog.com/project/2/insights/new) and add `user_logged_out` to track session churn and identify drop-off patterns.

Once all five insights are saved, add them to a new dashboard at [Dashboards → New dashboard](https://us.posthog.com/project/2/dashboards) named **Analytics basics**.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
