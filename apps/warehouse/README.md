# Data Warehouse test apps

PostHog-less apps for testing `wizard warehouse` — the flow that scans a
project, detects connectable data sources, collects credentials in the
terminal, and creates the sources in PostHog.

These apps run **only** under `pnpm wizard-ci <app> --e2e`. The category is
marked `e2eOnly` in [`../manifest.json`](../manifest.json), so the diff-mode
runners (`wizard-run`, `wizard-benchmark`) hide it. A warehouse run is graded
by assertions over the run's structured result, not by a code diff — the flow
creates PostHog resources and writes a report, it does not edit the app.

**No real source is ever created.** The runner points the wizard at the stub
MCP server in [`../../services/mcp-stub`](../../services/mcp-stub) through
`MCP_URL`. The stub answers with fixtures recorded from production and writes
every tool call to a journal. The assertions read that journal.

## The apps

Each app exists to guard one regression the others cannot:

- `stripe-node/` — the baseline: one in-CLI source, a short ask batch
- `multi-source-next/` — the stress case: five kinds at once, ask batching,
  subjects, the Supabase-vs-Postgres split, the label-vs-kind trap, and a
  deep-link-only source
- `monorepo-env/` — env-key parity: the only signals live in nested `.env`
  files, and the reported signal must name the real file
- `zero-source/` — the negative case: no signal, a clean abort, zero creates

## Expectations

Each app carries a `.wizard-ci/expect.json`. It names the source kinds the run
must detect, the creates the stub must receive, the ask-batch bounds, and the
abort text where an abort is the correct outcome. The assertion layer reads
this file — see the cross-repo contract for the field list.

`minKinds` holds what detects on the wizard's `main` today. `optionalKinds`
holds kinds that only detect on an unmerged branch: they are reported, and
they never fail the run.

## Conventions

- Static fixtures. Nothing is installed, nothing runs, there are no lockfiles.
- Every `.env` value is an obvious placeholder. The detector reads key **names**
  only, never values, so a placeholder detects exactly like a real secret.
- Real imports and real structure. The agent reads this code, so filler
  changes what it does.
- Keep every manifest and `.env` file within 3 directory levels of the app
  root. The detector's walk stops there.

## Running

```bash
pnpm wizard-ci warehouse/<app> --e2e
```
