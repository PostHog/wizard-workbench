# Link checker (Node)

A markdown link checker. It reads local files and makes HTTP requests, and that
is all — no database, no SaaS API, no credentials.

Test fixture for `wizard warehouse` — the negative case.

## The regression it guards

There is nothing here to connect. `commander` is the only dependency, and the
`.env` holds three tuning knobs and no keys. The run must stop cleanly:

- detects **no** source
- aborts with `No data source detected`
- opens **zero** ask batches and makes **zero** creates through the MCP

The abort text comes from `WAREHOUSE_ABORT_CASES` in the wizard's
`warehouse-source` program. It fires before any agent work, so a run that gets
as far as asking the user for credentials has already failed.

This app is the guard against an over-eager detector. Every other app in the
category proves the flow finds what is there; this one proves it does not
invent what is not. `forbidKinds` names the six kinds most likely to be
hallucinated from a plain Node project.

## Getting started

```bash
npm install
npx linkcheck README.md
```
