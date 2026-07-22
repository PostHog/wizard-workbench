# PostHog post-wizard report

The wizard integrated PostHog into this React Router v7 Framework-mode application. It installed the browser SDK and React bindings, initialized analytics from environment variables at the client entry point, retained default autocapture and session recording behavior, identified authenticated users on login, signup, and returning visits, reset identity on logout, captured key country-exploration actions, and added exception capture to authentication failures and the root error boundary.

| Event | Description | File |
|---|---|---|
| `user_signed_up` | A visitor successfully creates an account. | `app/context/AuthContext.tsx` |
| `user_logged_in` | A returning user successfully logs in. | `app/context/AuthContext.tsx` |
| `user_logged_out` | An authenticated user logs out. | `app/context/AuthContext.tsx` |
| `country_claimed` | An authenticated user claims a country and earns points. | `app/routes/countries.tsx` |
| `country_liked` | An authenticated user likes a country. | `app/routes/countries.tsx` |
| `country_visited` | An authenticated user marks a country as visited. | `app/routes/countries.tsx` |
| `country_search_used` | A visitor searches the country catalog by name. | `app/routes/countries.tsx` |
| `country_region_filtered` | A visitor filters the country catalog by region. | `app/routes/countries.tsx` |

## Next steps

The PostHog dashboard and notebook could not be created because the PostHog MCP service was unavailable at the configured local endpoint during this run. Reconnect that service and create an **Analytics basics (wizard)** dashboard using the event contract above.

## Verify before merging

- [ ] Run a full production build and fix any lint or type errors introduced by the generated code. The wizard successfully ran both `npm run typecheck` and `npm run build` during setup.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or the bundler upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path calls `identify`; the integration currently restores and identifies the locally stored authenticated user during startup.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
