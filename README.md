# wizard-workbench

The wizard workbench is a few things: 

1. A collection of PostHog-less apps and codebases for testing and experimenting with the [PostHog Wizard](https://github.com/PostHog/wizard)
2. A toolbox of scripts and utilities to help you analyze, debug, and inspect Wizard runs
3. A workshop and target practice environment where you can run the full local development stack

## Test apps

Test apps are organized by workflow under `/apps/<workflow>/<framework>/<app-name>`.

```
apps/
├── basic-integration/    # Default PostHog integration
│   ├── next-js/
│   │   ├── 15-app-router-saas
│   │   └── 15-pages-router-saas
│   ├── react-router/
│   ├── django/
│   └── ...
├── revenue/              # Revenue analytics (Stripe + PostHog)
│   └── stripe/
│       ├── stripe-next-js-saas-starter
│       └── stripe-saas-demo
├── warehouse/            # Data warehouse sources (e2e-only, mocked backend)
│   ├── stripe-node
│   ├── multi-source-next
│   ├── monorepo-env
│   └── zero-source
├── warehouse-seeded/     # Warehouse task inside the install run (e2e-only)
│   ├── next-stripe
│   └── next-stripe-declined
└── misc/                 # Misc apps for skill runs
    └── quack-quack
```

To add a new test app, create a directory under the appropriate workflow folder in `/apps`.

The `warehouse` and `warehouse-seeded` categories are marked `e2eOnly` in
`apps/manifest.json`. Their apps run only under `pnpm wizard-ci <app> --e2e`,
against the stub MCP server in `services/mcp-stub` — a warehouse run creates
PostHog resources rather than editing the app, so there is no diff to grade.
The diff-mode runners (`wizard-run`, `wizard-benchmark`) hide both categories,
and `wizard-ci` routes them to the `--e2e` path instead of the PR pipeline.

Each app carries a `.wizard-ci/expect.json`, and the run is graded against it:
what was detected, what the stub MCP was really asked to create, what the report
claims, and whether the two agree. The runner prints one `E2E_RESULT` line and
one `E2E_CHECK` line per assertion, and CI turns the leg red when one fails.

`warehouse/` covers the standalone `wizard warehouse` command.
`warehouse-seeded/` covers the same step offered as a task inside the default
install run — different code, and where the recent regressions were. See
[`apps/warehouse/README.md`](apps/warehouse/README.md) and
[`apps/warehouse-seeded/README.md`](apps/warehouse-seeded/README.md).

## Workbench ownership

Reviews are auto-requested via [`.github/CODEOWNERS`](.github/CODEOWNERS) — the
file is the source of truth; this table just mirrors it for readability.
`team-wizard-docs` is the default reviewer; the team-owned apps below route
review to their owning team instead.

| Path | Owning team |
|---|---|
| `*` (everything else, including all other apps) | `@PostHog/team-wizard-docs` |
| `/apps/basic-integration/` | `@PostHog/team-wizard-docs` |
| `/apps/error-tracking-upload-source-maps/` | `@PostHog/team-error-tracking` |
| `/apps/self-driving/` | `@PostHog/team-self-driving` |

Ownership is by directory. Apps not listed above fall through the default and
are owned by `team-wizard-docs`. Today CODEOWNERS only auto-requests review —
approval is not a merge gate.

## Services

The `services/` directory is a toolbox for scripts and utilities to help with Wizard development.

```
services/
├── pr-evaluator/     # AI-powered code evaluation for PRs and branches
├── wizard-ci/        # Automated wizard runs with PR creation
├── wizard-run/       # Interactive wizard runner
├── mcp-stub/         # Stub PostHog MCP server for warehouse e2e runs
├── wizard-commands.ts # Registry of wizard commands (integration, revenue, …)
└── github/           # GitHub/git utilities
```

Adding a new wizard command to the pickers: append an entry to
`services/wizard-commands.ts`. All runners (`wizard-run`, `wizard-ci`,
`wizard-benchmark`) read from that registry and pick it up automatically.

---

## Wizard local dev stack

The workbench can run the entire Wizard stack in local development mode, with hot reload where supported. It uses `phrocs` to run all the repos defined in your `.env` file:

- [Context Mill repo](https://github.com/PostHog/context-mill)
- [Wizard repo](https://github.com/PostHog/wizard)
- [MCP repo](https://github.com/PostHog/posthog/tree/master/services/mcp) (within PostHog monorepo)

![local dev stack](https://res.cloudinary.com/dmukukwp6/image/upload/q_auto,f_auto/pasted_image_2026_01_26_T20_15_17_777_Z_473d28d6e1.png)

### Setup

**Starting fresh?** If you've just cloned wizard-workbench and don't already have the dependency repos (`context-mill`, `wizard`, `posthog`) cloned or their packages installed, run:

```bash
bash fresh-setup
```

This installs `phrocs`, clones `context-mill`, `wizard`, and `posthog` **as siblings next to this repo** (e.g. `../context-mill`), writes your `.env` with the right paths, prompts for an optional PostHog API key, and runs `pnpm install` everywhere.

macOS only for now.

Flags: 
`--force` overwrites an existing .env, 
`--skip-posthog` skips the (large) monorepo clone, 
`--non-interactive` skips the API key prompt.

> **Already have the repos / your own setup?** You don't need `fresh-setup` — it's for clean machines. Use the manual steps below to point `.env` at wherever your repos already live (any path works; they don't have to be siblings). `fresh-setup` is also safe to re-run: it skips repos that are already cloned and leaves an existing `.env` alone unless you pass `--force`.

<details> <summary>Manual setup (if you'd rather do it yourself, or already have the repos)</summary>
Install phrocs:
```
brew tap posthog/tap && brew install phrocs
```
Install dependencies in this repo:
```
pnpm install
```

Copy and edit .env with your repo paths and API key:

```
cp .env.example .env
```
</details>

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `CONTEXT_MILL_PATH` | Yes | Path to your local context-mill repo (e.g., `~/development/context-mill`) |
| `MCP_PATH` | Yes | Path to MCP service (e.g., `~/development/posthog/services/mcp`) |
| `WIZARD_PATH` | Yes | Path to your local wizard repo (e.g., `~/development/wizard`) |
| `POSTHOG_PERSONAL_API_KEY` | For CI | PostHog personal API key for wizard CI mode and PR evaluator |
| `POSTHOG_REGION` | No | PostHog region (`us` or `eu`). Defaults to `us`. Can also be set via `--region` flag or workflow input. |

These `*_PATH` vars say **where the repos live** — which binary and which
servers get started. They're separate from the wizard's own `--local-*` flags,
which say **where a wizard run points**. See
[Pointing at prod vs. local backends](#pointing-at-prod-vs-local-backends).

Make sure you've set up and installed dependencies for all required repos.

### Running

Enter `phrocs` to run the local dev stack:

```bash
phrocs
```

### phrocs Commands

Use keyboard shortcuts in phrocs: `r` to run/restart, `s` to stop, `q` to quit.

#### Auto-start Processes (run automatically)

| Process | Port | Description |
|---------|------|-------------|
| `context-mill` | 8765 | Context Mill server with MCP resources ZIP — the wizard reads these via `--local-context-mill` |
| `mcp` | 8787 | MCP server using local resources (`autostart: false` — hogli owns this port; reach it with `--local-mcp`) |
| `mcp-inspector` | 6274 | MCP Inspector UI for debugging |
| `wizard-build` | - | Builds and watches Wizard for changes |

A local PostHog (Django on **8010**) isn't started by any pane — run `./bin/start`
in the `posthog/` repo yourself, then pass the wizard `--local-posthog`.

#### Manual Processes (press `s` to start)

| Process | Description |
|---------|-------------|
| `wizard-run` | Interactive picker: choose a wizard command (`posthog-wizard`, `posthog-wizard revenue`, …) then an app |
| `wizard-tail-run` | Tail the wizard's verbose output (`/tmp/posthog-wizard.log`) |
| `wizard-ci-run` | Full CI flow: run wizard, create PR, evaluate |
| `wizard-ci-local-run` | CI flow with local evaluation (no PR) |
| `wizard-ci-create-pr` | Push branch and create PR only (skip wizard run) |
| `wizard-ci-evaluate-pr` | Evaluate an existing PR or local branch |
| `mitmproxy` | HTTPS-intercepting proxy on port 8888 |
| `wizard-run-proxy` | Run wizard with all fetch traffic routed through the proxy |

---

## Pointing at prod vs. local backends

Five knobs control where wizard traffic lands. The wizard has one flag per
service, so each is independently switchable:

| Knob | Default here | How to change it |
|------|--------------|------------------|
| Wizard → context-mill skills | `localhost:8765` | `--local-context-mill`, passed by `services/wizard-ci/utils.ts` |
| Wizard → MCP worker | **Prod** `mcp.posthog.com` | add `--local-mcp` |
| Wizard → PostHog API/app | **Prod** US/EU | add `--local-posthog` (or `--base-url`) |
| MCP worker → PostHog backend | Prod US/EU | `$MCP_PATH/.dev.vars` |
| Wizard → LLM gateway | `gateway.us.posthog.com/wizard` | baked in at wizard build time — see below |

`--local-dev` turns on the first three at once. Full catalog:
[`docs/local-dev.md`](https://github.com/PostHog/wizard/blob/main/docs/local-dev.md)
in the wizard repo.

> **Changed:** `--local-mcp` used to switch skills *and* MCP together, so this
> workflow had to set `MCP_URL=https://mcp.posthog.com/mcp` to undo half of it.
> That override is gone — the runner passes `--local-context-mill`, which
> switches skills only. If you have `--local-mcp` in a personal script expecting
> local skills, use `--local-context-mill` (or `--local-dev` for both).

Note the local MCP worker on `:8787` is **not** running by default — the `mcp`
mprocs pane is `autostart: false` because hogli's stack owns that port. So the
default here is local skills against the production MCP.

### Point MCP worker at prod PostHog (default)

In `$MCP_PATH/.dev.vars`, keep these commented out:

```
# POSTHOG_API_BASE_URL=http://localhost:8010
# POSTHOG_MCP_APPS_ANALYTICS_BASE_URL=http://localhost:8010
# POSTHOG_ANALYTICS_HOST=http://localhost:8010
```

Restart the `mcp` proc.

### Point MCP worker at local PostHog

1. Start a local PostHog Django on `:8010` (`./bin/start` in the `posthog/` repo).
2. Uncomment the three lines above.
3. Restart the `mcp` proc.

### Point wizard at local LLM gateway

Requires a wizard code change. The gateway URL is locked at build time — `wizard/tsdown.config.ts` hard-codes `NODE_ENV=production`, and `agent-interface.ts:697` unconditionally overwrites `ANTHROPIC_BASE_URL` at runtime.

To enable it:

1. In `wizard/tsdown.config.ts`, change `NODE_ENV: 'production'` to `NODE_ENV: process.env.NODE_ENV ?? 'production'`.
2. Rebuild with `NODE_ENV=development pnpm build`.
3. Start `llm-gateway` locally on `:3308` (no workbench proc does this today — run it from the `posthog/services/llm-gateway` repo yourself).

---

## Wizard CI/CD

The Wizard CI automates running the PostHog Wizard on test apps, creating PRs with the changes, and evaluating the quality of the integration.

### Services

The `wizard-ci` service runs the Wizard on a test app and handles the full CI flow. It also uses the `github` service to checkout branches and open PRs in the remote repo for code diffs.

```bash
# Run on a specific app
pnpm wizard-ci --app next-js/15-app-router-saas --evaluate
```

What it does: 

1. Resets the test app to a clean state
2. Runs the Wizard to add PostHog integration
3. Commits changes to a branch and creates a PR
4. Optionally runs the PR evaluator to assess integration quality

### GitHub workflow

The `wizard-ci.yml` workflow is a unified CI/CD pipeline that handles app discovery, parallel execution, PR creation, evaluation, and Slack notifications.

| Input | Default | Description |
|-------|---------|-------------|
| `app` | `all` | `all`, directory (`next-js`), or app path (`next-js/15-app-router-todo`) |
| `evaluate` | `true` | Run PR evaluator after wizard completes |
| `base_branch` | `main` | Base branch for PR |
| `wizard_ref` | `main` | Wizard repo branch/tag/sha |
| `context_mill_ref` | `main` | Context Mill repo branch/tag/sha |
| `posthog_ref` | `master` | PostHog repo branch/tag/sha (for MCP) |
| `posthog_region` | `us` | PostHog region (`us` or `eu`) |
| `trigger_id` | auto-gen | Seven character ID |
| `notify_slack` | `false` | Post notifications to Slack |

Each trigger is assigned a unique short ID that tracks the group of wizard CI runs it created.

![wizard CI trigger ID](https://res.cloudinary.com/dmukukwp6/image/upload/q_auto,f_auto/pasted_image_2026_01_12_T19_21_18_324_Z_3a92099297.png)

You can activate `wizard-ci.yml` in a few ways:

1. **Manual** - Run from GitHub Actions UI
2. **Schedule** - Runs on cron
3. **Dispatch** - Webhook call via `repository_dispatch` with event type `wizard-ci-trigger`

---

## Running with a proxy

To inspect network traffic, simulate outages, or throttle requests, you can run the Wizard through an HTTPS-intercepting proxy. All Node `fetch` traffic is routed through the proxy via **undici**'s `ProxyAgent`.

### Setup (one-time)

Install mitmproxy:

```bash
brew install mitmproxy
```

Generate and trust the mitmproxy CA certificate:

```bash
./proxy/setup-mitmproxy
```

This generates the CA cert at `~/.mitmproxy/mitmproxy-ca-cert.pem` and adds it to your macOS system keychain so Node trusts the proxy's SSL certificates.

### Usage

In phrocs, start the `mitmproxy` process first, then start `wizard-run-proxy`. Traffic will appear in the mitmproxy TUI.

Alternatively, you can use [Charles Proxy](https://www.charlesproxy.com/) (GUI-based, paid license) on port `8888` instead of mitmproxy.
