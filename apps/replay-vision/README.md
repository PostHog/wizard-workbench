# Replay vision test apps

Fixtures for `wizard replay-vision`. On every supported app the run is expected to:

- make session replay record (server-side enable, plus fixing any client-side override)
- create three scanners named for the product (never the generic legacy names): a problems monitor (breakage and getting stuck), a key flow outcome classifier, and a summarizer using the app's vocabulary
- pick the query and sampling from the project's volume tier: with no recordings or under 250 sessions a month, all three have no filters and are `free_only`; on busier projects, the problems monitor and the classifier are scoped to the app's real completion flow
- write the run report to `./posthog-replay-vision-report.md`, leading with what blocks the first observation (replay off, or a deploy with the env var names)

Each app's README lists only what is specific to it.
