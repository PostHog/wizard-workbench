# Data Warehouse (seeded) test apps

Apps for the **seeded** warehouse path: the warehouse step offered as a task
inside the default install run, not the standalone `wizard warehouse` command.

The standalone command is covered by [`../warehouse`](../warehouse). This
category exists because the two paths are different code. The standalone
command detects, then runs. The seeded path detects during the integration
run, queues a task, shows the user a notice, and only asks for credentials
minutes later, after the code changes are done. Every regression in that
sequence lives between the notice and the ask, and no standalone run touches it.

These apps run **only** under `pnpm wizard-ci <app> --e2e`. The category is
marked `e2eOnly` in [`../manifest.json`](../manifest.json).

**No real source is ever created.** The runner points the wizard at the stub
MCP server in [`../../services/mcp-stub`](../../services/mcp-stub) through
`MCP_URL`, exactly as the standalone category does.

## The apps

Both scenarios run the same storefront. `next-stripe-declined` carries only its
`.wizard-ci/expect.json`, which names `next-stripe` as its `sourceApp` — one
fixture, two matrix legs, no second copy to drift.

- `next-stripe/` — the notice is kept. The task runs, asks for the Stripe key,
  creates the source, and reaches a terminal status.
- `next-stripe-declined/` — the notice is declined. Nothing is asked, nothing
  is created, and the task ends skipped with reason `user-declined`.

## Why no PostHog dependency

Neither app has PostHog installed. That is the point: the full integration runs
first, and the warehouse task runs at the end of the same queue. An app that
already had PostHog would skip most of the run and never reach the task.

## Flags

The runner sets `wizard-orchestrator` and `wizard-orchestrator-seeded-tasks`
for any app whose `expect.json` says `seeded`. It merges them into whatever
`WIZARD_CI_FLAG_OVERRIDES` CI already exported, so the orchestrator flags the
rest of the leg needs stay set.

Every key here must be one the wizard reads — its `WIZARD_FLAG_KEYS` closed
set. A key outside that set is inert, and the wizard reports no error for it.
`wizard-use-pi-harness` sat in this list and did nothing: the real pi key is
`wizard-self-driving-use-pi-harness`, and it routes only the `self-driving`
program. A test now pins the runner's keys and the workflow's keys to that set.

## Conventions

The same rules as [`../warehouse`](../warehouse): static fixtures, placeholder
env values, real imports and real structure, and every manifest and `.env` file
within 3 directory levels of the app root.

## Running

```bash
pnpm wizard-ci warehouse-seeded/next-stripe --e2e
pnpm wizard-ci warehouse-seeded/next-stripe-declined --e2e
```
