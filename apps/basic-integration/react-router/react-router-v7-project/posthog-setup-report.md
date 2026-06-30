<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Router v7 Framework mode Country Explorer application. PostHog is initialized client-side in `entry.client.tsx` with `PostHogProvider` wrapping the hydrated router. A server-side PostHog middleware (`app/lib/posthog-middleware.ts`) is registered in `root.tsx` to correlate client and server events via `X-POSTHOG-SESSION-ID` and `X-POSTHOG-DISTINCT-ID` headers. Error tracking is wired into the root `ErrorBoundary`. User identification is performed on signup and login. Ten business-critical events are instrumented across six files.

| Event Name | Description | File |
|---|---|---|
| `user_signed_up` | Fired when a user successfully creates a new account | `app/routes/signup.tsx` |
| `user_logged_in` | Fired when a user successfully logs in | `app/routes/login.tsx` |
| `login_failed` | Fired when a login attempt fails | `app/routes/login.tsx` |
| `user_logged_out` | Fired when a user clicks the logout button | `app/routes/profile.tsx` |
| `country_claimed` | Fired when a user claims a country (earns 100 points) | `app/routes/countries.tsx` |
| `country_liked` | Fired when a user likes a country (earns 10 points) | `app/routes/countries.tsx` |
| `country_visited` | Fired when a user marks a country as visited (earns 50 points) | `app/routes/countries.tsx` |
| `country_detail_viewed` | Fired when a user views a country detail page (funnel entry point) | `app/routes/country.tsx` |
| `achievement_unlocked` | Fired when a user unlocks a new achievement milestone | `app/lib/utils/auth.ts` |
| `countries_searched` | Fired when a user applies a name or region filter on the countries list | `app/routes/countries.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics (wizard)](https://us.i.posthog.com/project/483112/dashboard/1777466)
- **Signup & Login Funnel**: [View insight](https://us.i.posthog.com/project/483112/insights/Phl0JFpl)
- **Country Engagement Actions**: [View insight](https://us.i.posthog.com/project/483112/insights/xA7T7mQW)
- **User Churn**: [View insight](https://us.i.posthog.com/project/483112/insights/1m2Viki8)
- **Achievement Unlocks**: [View insight](https://us.i.posthog.com/project/483112/insights/8BVdDiit)
- **Country Detail Viewed → Claimed Conversion**: [View insight](https://us.i.posthog.com/project/483112/insights/H5inUEm0)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
