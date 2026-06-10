<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this React Router v7 Framework mode project. Here's a summary of all changes made:

**New files created:**
- `app/lib/posthog-middleware.ts` — Server-side PostHog middleware that creates a PostHog Node client per request, extracts `X-POSTHOG-SESSION-ID` and `X-POSTHOG-DISTINCT-ID` headers from the client, and makes the client available as `context.posthog` in all route handlers.
- `.env` — Environment variables for `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`.

**Modified files:**
- `app/entry.client.tsx` — Initializes `posthog-js` and wraps `HydratedRouter` in `<PostHogProvider>` so all routes can use `usePostHog()`.
- `react-router.config.ts` — Enabled `future.v8_middleware: true` to activate middleware support.
- `vite.config.ts` — Added `ssr.noExternal` for PostHog packages and a reverse proxy for `/ingest` routes to tunnel events through the dev server.
- `app/root.tsx` — Exports the `posthogMiddleware` as the root middleware, and uses `posthog.captureException()` in `ErrorBoundary` for automatic error tracking.
- `app/routes/login.tsx` — Identifies the user and captures `user_logged_in` on successful login.
- `app/routes/signup.tsx` — Identifies the user with their ID and captures `user_signed_up` on successful signup.
- `app/routes/profile.tsx` — Captures `user_logged_out` and calls `posthog.reset()` when the user logs out.
- `app/routes/countries.tsx` — Captures `country_claimed`, `country_liked`, `country_visited`, `country_searched`, and `country_region_filtered` on the respective user interactions.

## Events tracked

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | User successfully creates a new account | `app/routes/signup.tsx` |
| `user_logged_in` | User successfully logs in to an existing account | `app/routes/login.tsx` |
| `user_logged_out` | User logs out of their account | `app/routes/profile.tsx` |
| `country_claimed` | User claims a country, earning 100 points | `app/routes/countries.tsx` |
| `country_liked` | User likes a country, earning 10 points | `app/routes/countries.tsx` |
| `country_visited` | User marks a country as visited, earning 50 points | `app/routes/countries.tsx` |
| `country_searched` | User searches countries by name (fires when query > 2 chars) | `app/routes/countries.tsx` |
| `country_region_filtered` | User filters countries by region | `app/routes/countries.tsx` |

## Next steps

We attempted to build a PostHog dashboard automatically, but the current API key lacks the necessary scopes (`dashboard:write`, `insight:write`, `query:read`). You can create the "Analytics basics (wizard)" dashboard manually in PostHog using the events above. Suggested insights:

1. **Signup → Login funnel** — Funnel from `user_signed_up` → `user_logged_in` to track new user activation.
2. **Country engagement over time** — Trends of `country_claimed`, `country_liked`, and `country_visited` side-by-side.
3. **Top regions claimed** — Breakdown of `country_claimed` by the `region` property.
4. **Search & filter usage** — Trends of `country_searched` and `country_region_filtered` to understand discovery behavior.
5. **User retention** — Retention analysis: users who triggered `user_signed_up` returning to perform `country_claimed`.

[Create a new dashboard in PostHog](https://us.posthog.com/project/2/dashboards)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
