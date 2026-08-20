# Replay vision test apps

Fixtures for `wizard replay-vision`. On every supported app the run is expected to:

- make session replay record (server-side enable, plus fixing any client-side override)
- create three scanners named for the product (never the generic legacy names): a breakage monitor scoped to the app's completion flow, a rage-click frustration monitor (`$rageclick` as its only filter), and a sampled summarizer using the app's vocabulary
- write the run report to `./posthog-replay-vision-report.md`

Each app's README lists only what is specific to it.
