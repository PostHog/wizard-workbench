# PostHog post-wizard report

The wizard integrated PostHog into the React Router v7 Framework-mode client, configured environment-based initialization with default autocapture and session recording behavior, added returning-user identification, authentication lifecycle tracking, country engagement events, logout reset behavior, and route error capture. The PostHog SDK packages were installed, and both the project typecheck and production build passed.

| Event | Description | File |
|---|---|---|
| `user_signed_up` | A visitor successfully creates an account. | `app/routes/signup.tsx` |
| `user_logged_in` | A returning user successfully logs in. | `app/routes/login.tsx` |
| `user_logged_out` | An authenticated user logs out. | `app/routes/profile.tsx` |
| `country_claimed` | An authenticated user claims a country. | `app/routes/countries.tsx` |
| `country_liked` | An authenticated user likes a country. | `app/routes/countries.tsx` |
| `country_visited` | An authenticated user marks a country as visited. | `app/routes/countries.tsx` |

## Next steps

Dashboard and notebook creation could not be completed because the PostHog MCP endpoint was unavailable during setup. Once it is available, create an **Analytics basics (wizard)** dashboard using the event names above.

## Verify before merging

- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names added here to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or the bundler upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` in a browser session with a previously authenticated user.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
