# Project discovery monorepo goalposts

Production and custom monorepos for grading `PostHog/wizard` project discovery
(`wizard-project-discovery`) and monorepo E2E flows.

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

## Running the deterministic grader ($0, zero LLM calls)

```bash
git submodule update --init --recursive apps/project-discovery/production
pnpm discovery-eval --wizard /path/to/wizard
```

Pass `--strict` to fail on advisory checks (such as Bazel and Rush markers not yet implemented in `WORKSPACE_MARKERS`), `--filter <name>` to run a subset, or `--json` for machine output.

## E2E expectations

E2E specs live beside the deterministic specs in `expectations/*.e2e.json` (and `.wizard-ci/e2e.json` on custom fixtures) so `wizard-ci --e2e` can grade full runs once the deterministic baseline is green. Do not burn LLM tokens on E2E legs whose deterministic checks still fail.
