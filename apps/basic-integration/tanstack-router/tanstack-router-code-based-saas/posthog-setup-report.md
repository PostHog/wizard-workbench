<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into CloudFlow, a React + TanStack Router (code-based) SaaS application. Here is a summary of every change made:

- **`vite.config.js`** — Switched to a factory function and added a reverse-proxy configuration that routes `/ingest/*` to `https://us.i.posthog.com` and `/ingest/static` + `/ingest/array` to `https://us-assets.i.posthog.com`. This keeps PostHog traffic first-party and avoids ad-blocker interference.
- **`.env`** — Created with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`. Both are read via `import.meta.env.*` in code; the token is never hardcoded.
- **`src/useMutation.tsx`** — Added an `onError` callback option so mutation callers can react to failures without coupling the hook to PostHog.
- **`src/main.tsx`** — Wrapped `RootComponent` with `PostHogProvider` (reverse-proxy host, `defaults: '2026-01-30'`, `capture_exceptions: true`, pageview capture disabled in favour of router-driven tracking). Added `PostHogPageViewTracker` — a zero-render component that subscribes to `router.subscribe('onResolved', ...)` and fires `$pageview` on every navigation. Added `posthog.identify(username)` + `posthog.reset()` on login/logout. Instrumented 11 business events across six components (see table below).

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User submits the login form and signs in | `src/main.tsx` |
| `user_logged_out` | User clicks Sign Out (profile page or login page) | `src/main.tsx` |
| `invoice_created` | New invoice form submitted successfully | `src/main.tsx` |
| `invoice_create_failed` | Invoice creation fails after form submission | `src/main.tsx` |
| `invoice_updated` | User saves changes to an existing invoice | `src/main.tsx` |
| `invoice_update_failed` | Saving invoice changes fails | `src/main.tsx` |
| `invoice_notes_toggled` | User opens or closes the internal notes section on an invoice | `src/main.tsx` |
| `upgrade_plan_clicked` | User clicks the Upgrade button on Account Settings | `src/main.tsx` |
| `team_member_searched` | User applies a text filter to the team member list (on blur) | `src/main.tsx` |
| `team_member_sort_changed` | User changes the sort order of the team member list | `src/main.tsx` |
| `dashboard_viewed` | User lands on the dashboard overview (top of engagement funnel) | `src/main.tsx` |

## Next steps

We've built five insights and a dashboard to keep an eye on user behaviour based on the events just instrumented:

- **Dashboard — Analytics basics (wizard):** https://us.posthog.com/project/483112/dashboard/1829378
- **Login → Invoice Created funnel (wizard):** https://us.posthog.com/project/483112/insights/8NX058er
- **Invoices created over time (wizard):** https://us.posthog.com/project/483112/insights/zr3D1xRX
- **Upgrade plan clicks (wizard):** https://us.posthog.com/project/483112/insights/C9gUXLfP
- **Invoice errors (wizard):** https://us.posthog.com/project/483112/insights/CoWSMwvm
- **User logins vs logouts (wizard):** https://us.posthog.com/project/483112/insights/1SLzo0M9

A dashboard **subscription** (weekly email snapshot of the dashboard sent to your inbox) and **alerts** (one-off emails the moment a metric crosses a threshold) were not configured because the interactive prompt was unavailable in this environment. You can set them up manually in PostHog: open the dashboard → **Share** → **Subscriptions** for the email digest, and open each insight → **Alerts** for threshold-based notifications. Recommended alerts: a relative decrease on the Login → Invoice Created funnel (conversion dropping is a revenue signal) and a spike on Invoice errors (users blocked from billing).

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify in PostHog error tracking.
- [ ] Confirm the returning-visitor path also calls `identify` — currently `identify` is called only on the login form submit. If you add session persistence (localStorage/cookie), call `identify` on app load too so returning sessions are not left on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
