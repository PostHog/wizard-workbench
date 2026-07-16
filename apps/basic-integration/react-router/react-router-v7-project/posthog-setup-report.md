# PostHog post-wizard report

The wizard completed a PostHog integration for this React Router v7 Framework application. It installed the browser, React, and Node SDKs; initialized browser analytics at hydration; configured request tracing and a per-request server client; and enabled exception capture in the route error boundary. Authenticated users are identified with their stable application ID, with email stored only as a person property. Logout captures the action and resets the client identity.

The integration also captures the primary product actions in the country explorer: login, signup, logout, country claims, likes, virtual visits, and region filtering. Event properties intentionally use non-PII context only. PostHog variables are configured via `.env` as `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`.

| Event name | Description | File |
| --- | --- | --- |
| `user_logged_in` | Captures a successful login to an existing explorer account. | `app/routes/login.tsx` |
| `user_signed_up` | Captures successful creation of a new explorer account. | `app/routes/signup.tsx` |
| `user_logged_out` | Captures an authenticated explorer logging out. | `app/routes/profile.tsx` |
| `country_claimed` | Captures a country being claimed, including its region. | `app/routes/countries.tsx` |
| `country_liked` | Captures a country being added to an explorer's favorites. | `app/routes/countries.tsx` |
| `country_visited` | Captures a country being marked as virtually visited. | `app/routes/countries.tsx` |
| `country_filters_applied` | Captures an explorer applying a region filter to the country catalog. | `app/routes/countries.tsx` |

## Next steps

The PostHog MCP dashboard service was unavailable during this run, so the requested dashboard, insights, and shareable notebook could not be created. Once the service is available, create **Analytics basics (wizard)** with insights for signup conversion, country claims, likes, visits, and region-filter use.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
