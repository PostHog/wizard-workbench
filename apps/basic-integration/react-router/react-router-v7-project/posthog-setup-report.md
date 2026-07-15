# PostHog post-wizard report

PostHog was integrated into the React Router v7 Framework application. The browser SDK is initialized at the client entry point with the React provider, using environment variables for the public project token and host. Authentication flows identify users with stable IDs and person properties, logout resets the identity, meaningful country interactions are captured, and the route error boundary reports exceptions. The integration preserves PostHog defaults, including autocapture and session recording.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | Track a successful user login so activation and returning-user behavior can be measured. | `app/routes/login.tsx` |
| `user_signed_up` | Track successful account creation as the primary conversion event. | `app/routes/signup.tsx` |
| `user_logged_out` | Track when an authenticated user ends their session. | `app/components/navbar.tsx` |
| `country_claimed` | Track when an authenticated user claims a country. | `app/routes/countries.tsx` |
| `country_liked` | Track when an authenticated user likes a country. | `app/routes/countries.tsx` |
| `country_visited` | Track when an authenticated user marks a country as visited. | `app/routes/countries.tsx` |
| `country_details_viewed` | Track a user opening a country detail page at the top of the exploration funnel. | `app/routes/country.tsx` |

## Next steps

Dashboard and insight creation could not be completed because the PostHog MCP server was unavailable during this run.

- Dashboard: Not created (PostHog MCP connection refused)
- Insights: Not created (PostHog MCP connection refused)

## Verify before merging

- [ ] Run a full production build and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and deployment configuration.
- [ ] Wire source-map upload into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path identifies an already authenticated user.

### Agent skill

We've left an agent skill folder in the project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
