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
└── misc/                 # Misc apps for skill runs
    └── quack-quack
```

To add a new test app, create a directory under the appropriate workflow folder in `/apps`.

## Services

The `services/` directory is a toolbox for scripts and utilities to help with Wizard development.

```
services/
├── pr-evaluator/     # AI-powered code evaluation for PRs and branches
├── wizard-ci/        # Automated wizard runs with PR creation
├── wizard-run/       # Interactive wizard runner
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

Install [phrocs](https://github.com/PostHog/posthog/tree/master/tools/phrocs)

```bash
brew tap posthog/tap && brew install phrocs
```

Install dependencies in this repo:

```bash
pnpm install
```

Copy and edit `.env` with your repo paths and API key:

```bash
cp .env.example .env
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `CONTEXT_MILL_PATH` | Yes | Path to your local context-mill repo (e.g., `~/development/context-mill`) |
| `MCP_PATH` | Yes | Path to MCP service (e.g., `~/development/posthog/services/mcp`) |
| `WIZARD_PATH` | Yes | Path to your local wizard repo (e.g., `~/development/wizard`) |
| `POSTHOG_PERSONAL_API_KEY` | For CI | PostHog personal API key for wizard CI mode and PR evaluator |
| `POSTHOG_REGION` | No | PostHog region (`us` or `eu`). Defaults to `us`. Can also be set via `--region` flag or workflow input. |
| `POSTHOG_WIZARD_LOG_DIR` | No | Directory for wizard verbose logs. Wizard writes `posthog-wizard.log` inside this directory (defaults to `/tmp`). |

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
| `context-mill` | 8765 | Context Mill server with MCP resources ZIP |
| `mcp` | 8787 | MCP server using local resources |
| `mcp-inspector` | 6274 | MCP Inspector UI for debugging |
| `wizard-build` | - | Builds and watches Wizard for changes |

#### Manual Processes (press `s` to start)

| Process | Description |
|---------|-------------|
| `wizard-run` | Interactive picker: choose a wizard command (`posthog-wizard`, `posthog-wizard revenue`, …) then an app |
| `wizard-tail-run` | Tail the wizard's verbose output (`$POSTHOG_WIZARD_LOG_DIR/posthog-wizard.log`, defaults to `/tmp/posthog-wizard.log`) |
| `wizard-ci-run` | Full CI flow: run wizard, create PR, evaluate |
| `wizard-ci-local-run` | CI flow with local evaluation (no PR) |
| `wizard-ci-create-pr` | Push branch and create PR only (skip wizard run) |
| `wizard-ci-evaluate-pr` | Evaluate an existing PR or local branch |
| `mitmproxy` | HTTPS-intercepting proxy on port 8888 |
| `wizard-run-proxy` | Run wizard with all fetch traffic routed through the proxy |

---

## Pointing at prod vs. local backends

Four knobs control where wizard traffic lands. Two are hardwired by the workbench, two are configurable:

| Knob | Default | Configurable? |
|------|---------|---------------|
| Wizard → MCP worker | `localhost:8787` | No — `--local-mcp` is always passed (`services/wizard-ci/utils.ts`) |
| Wizard → context-mill skills | `localhost:8765` | No — same flag |
| MCP worker → PostHog backend | Prod US/EU | **Yes** — `$MCP_PATH/.dev.vars` |
| Wizard → LLM gateway | `gateway.us.posthog.com/wizard` | No — baked in at wizard build time |

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
