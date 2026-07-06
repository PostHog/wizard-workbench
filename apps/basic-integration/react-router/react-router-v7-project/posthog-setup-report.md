<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your React Router v7 framework-mode project. PostHog client initialization was added at the app entry point with environment-variable configuration and React context wiring. Error tracking was added to the root error boundary. User identification now happens for returning authenticated users and after successful login and signup flows. Product analytics events were added for login, signup, logout, and the key country engagement actions: claim, like, and visit. Vite SSR configuration was also updated so the PostHog React packages work correctly in framework mode.

| Event name | Description | File |
| --- | --- | --- |
| `user_logged_in` | Captures when an existing user successfully logs into the app. | `app/routes/login.tsx` |
| `user_signed_up` | Captures when a new user successfully creates an account. | `app/routes/signup.tsx` |
| `country_claimed` | Captures when an authenticated user claims a country from the listing. | `app/routes/countries.tsx` |
| `country_liked` | Captures when an authenticated user likes a country from the listing. | `app/routes/countries.tsx` |
| `country_visited` | Captures when an authenticated user marks a country as visited. | `app/routes/countries.tsx` |
| `user_logged_out` | Captures when an authenticated user logs out from the navigation. | `app/context/AuthContext.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: https://us.posthog.com/project/483112/dashboard/1807677
- Insight: Signups (30d) — https://us.posthog.com/project/483112/insights/yOjrPJcE
- Insight: Logins (30d) — https://us.posthog.com/project/483112/insights/hngvx919
- Insight: Country engagement by day — https://us.posthog.com/project/483112/insights/sHTc4OCM
- Insight: Country action mix — https://us.posthog.com/project/483112/insights/27crQguw
- Insight: Signup to claim conversion proxy — https://us.posthog.com/project/483112/insights/fl8rwkKi

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
