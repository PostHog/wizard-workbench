<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the RESTExplorer Country Explorer app. PostHog is now initialized in `entry.client.tsx` and wrapped around the full app via `PostHogProvider`. User authentication events (`user_signed_up`, `user_logged_in`, `user_logged_out`) are captured with `posthog.identify()` calls to tie events to specific users. Core engagement actions (`country_claimed`, `country_liked`, `country_visited`) are tracked with contextual properties (country name, region, population). A funnel entry point (`country_detail_viewed`) fires when users open a country's detail page. The global `ErrorBoundary` in `root.tsx` calls `posthog.captureException()` for unhandled errors. The Vite config was updated with SSR externals and a reverse proxy so PostHog requests route through `/ingest`.

| Event | Description | File |
|---|---|---|
| `user_signed_up` | Fired when a new user creates an account; includes `username` and `email` | `app/routes/signup.tsx` |
| `user_logged_in` | Fired when an existing user logs in successfully; includes `username` | `app/routes/login.tsx` |
| `user_logged_out` | Fired when a user clicks Logout in the navbar; resets the PostHog identity | `app/components/navbar.tsx` |
| `country_claimed` | Fired when a user claims a country (+100 pts); includes `country_name`, `region`, `population` | `app/routes/countries.tsx` |
| `country_liked` | Fired when a user likes a country (+10 pts); includes `country_name`, `region` | `app/routes/countries.tsx` |
| `country_visited` | Fired when a user marks a country as virtually visited (+50 pts); includes `country_name`, `region` | `app/routes/countries.tsx` |
| `country_detail_viewed` | Fired when a user opens a country detail page; top of the claim/like/visit conversion funnel | `app/routes/country.tsx` |

## Next steps

The PostHog API key used by the wizard did not have `dashboard:write` or `query:read` scopes, so the dashboard could not be created automatically. You can create it manually in PostHog:

- [PostHog Dashboards](https://us.posthog.com/project/2/dashboard) — create a new dashboard named **"Analytics basics (wizard)"**
- [New Insight](https://us.posthog.com/project/2/insights/new) — suggested insights to add:

  1. **Signup → Login funnel** — Funnel insight with `user_signed_up` → `user_logged_in` to measure activation rate
  2. **Country engagement trend** — Trends insight with three series: `country_claimed`, `country_liked`, `country_visited` to see engagement over time
  3. **Country detail → claim conversion** — Funnel with `country_detail_viewed` → `country_claimed` to measure conversion from browsing to claiming
  4. **User acquisition** — Trends of `user_signed_up` over time to track growth
  5. **Churn signal** — Trends of `user_logged_out` to monitor logout frequency

## Verify before merging

- [ ] Run a full production build (`npm run build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the current implementation only identifies on fresh login/signup; returning users loaded from localStorage will be on anonymous distinct IDs until they log in again.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
