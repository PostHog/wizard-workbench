# PostHog post-wizard report

PostHog has been integrated into this React Router v7 framework-mode application. The browser SDK is initialized from environment variables, supplied through the React integration context, and configured for automatic client-side analytics. The Vite SSR configuration now externalizes the PostHog packages. Authenticated users are identified with their stable application ID; email and username are saved as person properties only. Error-boundary exceptions are captured, and meaningful country-explorer actions are tracked without putting user-entered PII in event properties.

| Event name | Description | File |
| --- | --- | --- |
| `user_signed_up` | A visitor successfully creates a new country explorer account. | `app/context/AuthContext.tsx` |
| `user_logged_in` | An existing user successfully signs in. | `app/context/AuthContext.tsx` |
| `user_logged_out` | An authenticated user signs out. | `app/context/AuthContext.tsx` |
| `country_claimed` | An authenticated user claims a country. | `app/routes/countries.tsx` |
| `country_liked` | An authenticated user adds a country to their favorites. | `app/routes/countries.tsx` |
| `country_visited` | An authenticated user marks a country as visited. | `app/routes/countries.tsx` |

## Next steps

The local typecheck passed. A dashboard and shareable notebook could not be created because the configured PostHog MCP server was unreachable during this run.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
