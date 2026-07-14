# Project detection evaluation

This service turns Wizard project-discovery regressions into versioned, field-level checks.

It is separate from `framework-detect`: that command remains a quick interactive debugger. This service owns case validation, isolated fixture copies, production target extraction, comparison, and durable reports.

## Evidence modes

| Mode | What it proves | Credentials |
|---|---|---:|
| `registry-crosscheck` | Deterministic framework behavior, case validity, reporting, and independent structural observations | No |
| `simulated` | Evaluator behavior for mismatches, tool policy, recommendation, selection, timeout, and infrastructure responses | No |

Simulated output is evaluator coverage, not production detector evidence. Real model-backed execution is not implemented in this review slice.

## Run the suite

Install the selected Wizard checkout, then run:

```bash
WIZARD_PATH=/absolute/path/to/wizard pnpm project-detection-eval --output-dir artifacts/project-detection-eval --json
```

Run one case:

```bash
WIZARD_PATH=/absolute/path/to/wizard pnpm project-detection-eval --case issue-113-pnpm-next-api --output-dir artifacts/project-detection-eval
```

The command writes `results.json` and `summary.md`. Each artifact records committed SHAs, non-secret working-tree digests when dirty, the executed deterministic registry runtime, field-level evidence ownership, and a reproduction command. Haiku, the Agent SDK, and `detectProjectsWithAgent` are future production targets, not executed runtime in registry-crosscheck mode.

Validate the harness before trusting a report:

```bash
pnpm test:project-detection-eval
pnpm typecheck:project-detection-eval
```

## Initial cases

- pnpm workspace with Next.js and an API;
- npm workspaces with a web app and worker;
- Turborepo with Next.js and Expo.

Cases live in `cases/*.json`. Minimal self-authored inputs live in `fixtures/`; existing Workbench applications can be referenced without modification. Every case declares which project roots are required, optional, or forbidden.

## Failure semantics

Hard fields are project presence and path, repository type, target ID, PostHog presence, recommendation containment, selection, and fallback. Framework display-label differences are warnings unless they imply a functional classification change.

No-manifest, detector, infrastructure, and timeout outcomes stay distinct. A missing fixture or dependency is not reported as a detection mismatch.

## Security and privacy

- Fixture paths must be contained and relative.
- Runs use throwaway copies when `copyBeforeRun` is true.
- Persisted reports redact secret-shaped values and local absolute paths.
- Dirty-tree fingerprints exclude secret-named tracked and untracked file contents and never follow symlink targets.
- The core evaluator makes no model or gateway request and needs no credential.

## Non-goals

This slice does not prove live project-discovery accuracy, recommendation quality, actual model tool discipline, latency, token use, cost, or analytics isolation. Those require a separately reviewed production-path runner.

## Further reading

- [Architecture decision](./ADR.md)
- [Adding a regression case](./CONTRIBUTING.md)
