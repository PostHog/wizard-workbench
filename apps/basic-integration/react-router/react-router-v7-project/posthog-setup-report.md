<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Router v7 (Framework mode) Country Explorer application. PostHog is now initialized client-side via `entry.client.tsx` with the `PostHogProvider` wrapping the entire app, enabling `usePostHog()` hooks in all route components. The Vite dev server proxy is configured to route PostHog ingestion traffic through `/ingest/*`. Ten events are instrumented across six route files covering the full user lifecycle: signup, login, country engagement (claiming, liking, visiting), and logout. Users are identified by username on login and signup, and `posthog.reset()` is called on logout to disassociate the session. Error tracking is active in the root error boundary.

| Event Name | Description | File |
|---|---|---|
| `user_signed_up` | User successfully created a new account via the signup form. | `app/routes/signup.tsx` |
| `signup_error` | An error occurred while the user attempted to sign up. | `app/routes/signup.tsx` |
| `user_logged_in` | User successfully logged into their account. | `app/routes/login.tsx` |
| `login_failed` | User login attempt failed because the username was not found. | `app/routes/login.tsx` |
| `user_logged_out` | User clicked the logout button on their profile page. | `app/routes/profile.tsx` |
| `country_viewed` | User viewed the detail page for a specific country (top of conversion funnel). | `app/routes/country.tsx` |
| `country_claimed` | User claimed a country as their own, earning 100 points. | `app/routes/countries.tsx` |
| `country_liked` | User liked a country, earning 10 points. | `app/routes/countries.tsx` |
| `country_visited` | User marked a country as visited, earning 50 points. | `app/routes/countries.tsx` |
| `region_filter_applied` | User filtered the countries list by a specific world region. | `app/routes/countries.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) Dashboard](https://us.posthog.com/project/2/dashboard/1720023)
  - Signup to First Country Claim Funnel (`user_signed_up` → `country_viewed` → `country_claimed`)
  - Country Engagement Trend (`country_claimed`, `country_liked`, `country_visited` over time)
  - Login Success vs Failure (`user_logged_in` vs `login_failed`)
  - Top Country Actions Breakdown (pie chart of claim/like/visit)
  - User Retention — Returning Logins trend

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
