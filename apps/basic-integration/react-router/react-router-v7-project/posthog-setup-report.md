<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Country Explorer React Router v7 app. The integration includes client-side SDK initialization with session replay, a server-side middleware using `posthog-node`, user identification on login and signup, event tracking for all key user actions, error boundary instrumentation, and a PostHog dashboard with five insights.

| Event Name | Description | File |
|---|---|---|
| `user_signed_up` | User successfully created a new account. | `app/routes/signup.tsx` |
| `user_logged_in` | User successfully logged in to an existing account. | `app/routes/login.tsx` |
| `user_logged_out` | User logged out of their account. | `app/components/navbar.tsx` |
| `country_claimed` | User claimed a country, earning 100 points. | `app/routes/countries.tsx` |
| `country_liked` | User liked a country, earning 10 points. | `app/routes/countries.tsx` |
| `country_visited` | User marked a country as visited, earning 50 points. | `app/routes/countries.tsx` |
| `country_searched` | User searched for countries by name. | `app/routes/countries.tsx` |
| `country_filtered_by_region` | User filtered countries by a specific region. | `app/routes/countries.tsx` |
| `country_detail_viewed` | User viewed the detail page for a specific country. | `app/routes/country.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1825424)
- **Insight**: [Signup to Login Funnel](https://us.posthog.com/project/483112/insights/zi5DcFd3)
- **Insight**: [Signups and Logins over time](https://us.posthog.com/project/483112/insights/RBQnbbzU)
- **Insight**: [Country Interactions](https://us.posthog.com/project/483112/insights/t4EaGp9W)
- **Insight**: [Top Countries Viewed](https://us.posthog.com/project/483112/insights/IWTr41Tk)
- **Insight**: [User Retention after Signup](https://us.posthog.com/project/483112/insights/K60X6ktv)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
