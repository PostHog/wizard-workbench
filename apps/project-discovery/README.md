# Project discovery monorepo goalposts

Production and custom monorepos for grading `PostHog/wizard` project discovery (`wizard-project-discovery`) and monorepo E2E flows.

## Fixtures

### Production monorepos (`production/`, git submodules)

| Fixture | Repo | Tool | What it tests |
|---|---|---|---|
| `turbo-next-forge` | `vercel/next-forge` | Turborepo | Multi-app Next.js (`apps/app`, `apps/web`, `apps/api`, `apps/docs`), shared `packages/*`, per-project tools, variant `matchKeys` |
| `nx-analog` | `analogjs/analog` | Nx + pnpm | Nx workspace, Astro/Angular apps, filtering `-e2e` test harnesses out of `PlanScreen` |
| `bazel-aspect-examples` | `aspect-build/bazel-examples` | Bazel | `MODULE.bazel` + `BUILD.bazel` polyglot workspace (JS, Go, Python, Ruby, Swift) |
| `uv-fastapi-fullstack` | `fastapi/full-stack-fastapi-template` | Python / uv + Vite | Polyglot FastAPI (`backend/pyproject.toml`) + React/TanStack Router (`frontend/`), Postgres scoping, `frameworkVariant` |
| `rush-microsoft-example` | `microsoft/rush-example` | Rush | `rush.json` workspace recognition, `libraries/` vs `apps/` role classification |
| `cargo-axum` | `tokio-rs/axum` | Cargo | Rust `[workspace]` with frameworkless root and 60+ member crates |

### Custom edge-case monorepos (`custom/`)

| Fixture | Edge cases reproduced |
|---|---|
| `pnpm-comment-and-extras` | Frameworkless root (`#1588`), column-0 `# comment` in `pnpm-workspace.yaml` (`#1585`), Next.js Pages Router `frameworkVariant` (`#1586`), FastAPI PEP 508 extras (`#1584`), Postgres tool isolation (`#1586`) |
| `cargo-go-gradle-polyglot` | Frameworkless root with `go.work`, `Cargo.toml` `[workspace]`, and `settings.gradle.kts` (`#1585`, `#1588`) |
| `pnpm-negation-and-nested` | `!apps/legacy/**` exclusion globs (`#1585`), `tooling/eslint-config` filtering, nested launch from `apps/dashboard` |
| `lerna-yarn-workspaces` | `lerna.json` + Yarn `workspaces.packages` (`#1585`), per-project Stripe/Postgres isolation |
| `large-monorepo-caps` | 30 sub-packages (past `MAX_DETECTED_PROJECTS = 25`, `#1586`) + `<script>` host detection in `apps/web/public/index.html` |

## 1. Deterministic grader ($0, zero LLM calls)

Run this first against a local `PostHog/wizard` checkout. Do not spend tokens on E2E legs until the deterministic checks for that fixture pass.

```bash
git submodule update --init --recursive apps/project-discovery/production
pnpm discovery-eval --wizard /path/to/wizard
```

Useful flags:

- `--filter <substring>`: run a subset of fixtures or scenarios
- `--strict`: fail on advisory checks (such as Bazel and Rush markers not yet in `WORKSPACE_MARKERS`)
- `--json`: machine-readable report

### How deterministic grading works

`services/discovery-eval/index.ts` spawns `node <wizard>/dist/bin.js --test-discovery` (or `tsx src/bin.ts` if unbuilt) in each scenario's `launchDir` with zero network or LLM calls, then grades the JSON output with `services/discovery-eval/checks.ts` against `services/discovery-eval/expectations/*.discovery.json`:

- Workspace detection (`isMonorepo`, `workspaceRoot`, `workspaceTool`)
- Discovered `memberPaths` and excluded `forbidMemberPaths` (for example `!apps/legacy/**`)
- Per-project `framework`, `frameworkVariant`, `role`, `requiredTools`, and `forbidTools` (cross-project tool isolation)
- `PlanScreen` candidate list (`requiredPlanOffered`, `forbidPlanOffered`) and auto-pick (`expectedPlanPicked` for nested single-project launches)

## 2. Full E2E runs (`wizard-ci --e2e`)

Six fixtures also have full E2E specs in `services/discovery-eval/expectations/*.e2e.json`. The specs live outside `apps/` so Wizard CI's app finder does not mistake the spec folder for an app. The other fixtures are discovery-only, and `wizard-ci --e2e` refuses to run them:

- Custom: `pnpm-comment-and-extras`, `cargo-go-gradle-polyglot`, `pnpm-negation-and-nested`, `lerna-yarn-workspaces`
- Production: `turbo-next-forge`, `uv-fastapi-fullstack`

### Running an E2E leg

Make sure the fixture's deterministic checks pass first, then run `wizard-ci --e2e` with your PostHog CI credentials and a local `WIZARD_PATH` checkout:

```bash
export WIZARD_PATH=/path/to/wizard
export POSTHOG_PERSONAL_API_KEY=phx_...
export POSTHOG_GATEWAY_TOKEN=phs_... # or WIZARD_CI_GATEWAY_TOKEN_FILE=/path/to/token

# Custom fixture (nested launch)
pnpm wizard-ci project-discovery/custom/pnpm-negation-and-nested --e2e --project-id <id>

# Production submodule fixture (root launch)
pnpm wizard-ci project-discovery/production/turbo-next-forge --e2e --project-id <id>
```

### How E2E running and grading works

`services/wizard-ci/e2e.ts` automatically loads `services/discovery-eval/expectations/<id>.e2e.json` (via `services/wizard-ci/project-discovery-checks.ts`) and:

1. Copies the full monorepo into `/tmp/wizard-e2e-<name>` via `rsync` (never mutates the fixture).
2. Merges `flags` (such as `{"wizard-project-discovery":"one-project"}`) into `WIZARD_CI_FLAG_OVERRIDES`.
3. Sets `APP_DIR` to `launchDir` inside the `/tmp` copy (for example `/tmp/wizard-e2e-pnpm-negation-and-nested/apps/dashboard`).
4. Exports `E2E_NOTICE` (`profile.notice`) and `E2E_PLAN_PICK` (`profile.plan`) to the wizard TUI harness.
5. After the run finishes, diffs the entire `/tmp` copy against the source fixture with `changedFiles()` and grades:
   - `completed without abort` (or expected `abortReason` when `expectAbort` is set)
   - `edits inside <expectedChangedPrefix>`
   - `posthog wired inside <expectedChangedPrefix>` (replaces root-only `package.json` checks because monorepo installs touch the picked subrepo)
   - `no edits under <prefix>` for every entry in `forbidChangedPrefixes` (root lockfile updates like `pnpm-lock.yaml` or `yarn.lock` are allowed)

### Wizard-side prerequisite for multi-app `PlanScreen` legs

- Single-target nested runs (`pnpm-negation-and-nested`) skip `PlanScreen` once deterministic discovery passes, so they run headlessly right away.
- Multi-app root runs (the other 5 `.e2e.json` specs) open `PlanScreen` to ask which subrepo to integrate. `PostHog/wizard`'s `e2e-harness/e2e-profile.ts` (`decideE2eAction`) and `scripts/tui-host.no-jest.ts` need a `PlanScreen` handler that reads `process.env.E2E_PLAN_PICK` and selects that subrepo. Until that hook lands in `PostHog/wizard`, multi-app root runs pause on `PlanScreen`.

### Not in scheduled Wizard CI yet

`apps/manifest.json` sets `"ciCapable": false` for `project-discovery`, so GitHub Actions Wizard CI runs (`all`, `sample`, and dispatches) do not pick up these fixtures. Local `pnpm wizard-ci project-discovery/... --e2e` runs still work. Flip it to `true` once the `PlanScreen` hook above lands in `PostHog/wizard`.
