<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Router v7 (Framework mode) project. PostHog is initialized client-side in `entry.client.tsx` using `posthog-js` and `@posthog/react`, with the `PostHogProvider` wrapping the application. A reverse proxy is configured in `vite.config.ts` to route analytics requests through `/ingest` to avoid ad-blockers. Error tracking is wired into the root `ErrorBoundary`. Users are identified by username at login and by user ID at signup. Seven events are tracked across key user flows: authentication, country engagement (claim/like/visit), and country discovery.

| Event Name | Description | File |
|---|---|---|
| `user_signed_up` | Fired when a new user successfully creates an account. | `app/routes/signup.tsx` |
| `user_logged_in` | Fired when an existing user successfully logs in. | `app/routes/login.tsx` |
| `user_logged_out` | Fired when a user logs out from their profile page. | `app/routes/profile.tsx` |
| `country_claimed` | Fired when a user claims a country as their own. | `app/routes/countries.tsx` |
| `country_liked` | Fired when a user likes a country. | `app/routes/countries.tsx` |
| `country_visited` | Fired when a user marks a country as virtually visited. | `app/routes/countries.tsx` |
| `country_viewed` | Fired when a user opens the detail page for a specific country. | `app/routes/country.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1760761)
  - [Signup to login funnel](https://us.posthog.com/project/483112/insights/9586820)
  - [Country engagement](https://us.posthog.com/project/483112/insights/9586822)
  - [Country discovery](https://us.posthog.com/project/483112/insights/9586836)
  - [User retention](https://us.posthog.com/project/483112/insights/9586837)
  - [Churn signal](https://us.posthog.com/project/483112/insights/9586841)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
