# Metrics test apps

Apps for testing `wizard metrics` (`posthog.metrics` counters, gauges,
histograms). Each app pins one starting state the verify step has to handle,
so together they cover install, upgrade, and reuse.

Layout: `<docs-installation-slug>/<runtime>-<app-name>`, matching the pages
under [installation docs](https://posthog.com/docs/metrics/installation).

## The apps

- `python/flask-jobqueue` — PostHog installed at a **pre-metrics version** and
  initialized without metrics config, plus an existing capture call. Tests the
  upgrade path: bump the SDK, add `metrics={"service_name": ...}` to the
  existing client, leave the capture call alone.
- `nodejs/express-orders` — **no PostHog at all**. Tests the fresh path:
  install `posthog-node`, initialize with metrics config, instrument the
  request middleware, the background job, and the external call.
- `nextjs/nextjs-storefront` — **full-stack with `posthog-js` only**. Tests
  variant disambiguation: metrics measure service work, so the right pick is
  the server variant (fresh `posthog-node` for the route handlers), not
  bolting metrics onto the browser client.

Every app has obvious choke points (request handling, a background job, an
external call, a business commit site) so instrumentation quality is
comparable across runs.
