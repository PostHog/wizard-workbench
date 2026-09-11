# Error tracking test apps

Fixtures for `wizard error-tracking`. On every supported app the run is expected to:

- install and initialize the PostHog SDK first when the app doesn't have it (the flow's seed queues install/init like `wizard replay-vision` does)
- wire up exception capture through the SDK's own mechanism (autocapture at init, the framework's error handler, or an error boundary at the app entry) — in one place, never sprinkled manual capture calls
- on platforms that ship minified bundles or stripped binaries, wire source-map / debug-symbol upload into the production build, credentials and CI included
- write the run report to `./posthog-error-tracking-report.md`

Each app's README lists only what is specific to it.
