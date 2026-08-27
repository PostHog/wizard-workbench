# Storefront, declined (Next.js + Stripe)

The decline half of the seeded warehouse scenario. It runs the source tree of
[`../next-stripe`](../next-stripe) — named by `sourceApp` in
`.wizard-ci/expect.json` — with the task notice answered **Skip**.

There is no code here on purpose. One fixture with two expectation files
cannot drift against itself; two copies of the same storefront would.

## The regression it guards

A decline must stop the whole warehouse step, not just the notice. The failure
this catches is a run that shows the notice, records the decline, and then asks
for credentials anyway or creates the source regardless.

Expected wizard outcome:

- installs PostHog into the app (the integration part of the run)
- shows **one** task notice covering Stripe, and records the decline
- asks **nothing** — zero credential batches
- creates **nothing** — the stub MCP journal holds no create
- ends the warehouse task skipped, with reason `user-declined`

## How the variation is selected

The runner reads `notice` from `expect.json` and sets `E2E_NOTICE`, which
overrides the wizard e2e profile's own notice policy (cross-repo contract §4).
`next-stripe` sets `keep`; this app sets `decline`.

A separate app directory, rather than a list of variations inside one
`expect.json`, because the CI matrix fans out per app path. Two directories
give the two outcomes two matrix legs, two sets of artifacts, two rows in the
source-PR results table, and two independent red/green signals. One directory
running both would double the leg's runtime and collapse both outcomes into one
cell.
