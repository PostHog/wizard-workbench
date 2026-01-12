# wizard-workbench

The wizard workbench is a few things: 

1. A collection of PostHog-less apps and codebases for testing and experimenting with the [PostHog Wizard](https://github.com/PostHog/wizard)
2. A toolbox of scripts and utilities to help you analyze, debug, and inspect Wizard runs
3. A workshop and target practice environment where you can run the full local development stack

## Test apps

A stable of test applications and codebases, with no PostHog installed, lives in `/apps/<framework>/<app-name>`. 

```
apps/
└── next-js/
│   ├── 15-app-router-saas
│   ├── 15-app-router-todo
│   ├── 15-pages-router-saas
│   └── 15-pages-router-todo
└── react/
```

To add a new test app, create a directory under `/apps`.

## Services

The `services/` directory is a toolbox for scripts and utilities to help with Wizard development.

```
services/
├── pr-evaluator/    # AI-powered code evaluation for PRs and branches
├── wizard-ci/       # Automated wizard runs with PR creation
├── wizard-run/      # Interactive wizard runner
└── github/          # GitHub/git utilities
```

---

## Wizard local dev stack

The workbench can run the entire Wizard stack in local development mode, with hot reload where supported. It uses `mprocs` to run all the repos defined in your `.env` file:

- [Examples repo](https://github.com/PostHog/examples)
- [Wizard repo](https://github.com/PostHog/wizard)
- [MCP repo](https://github.com/PostHog/posthog/tree/master/services/mcp) (within PostHog monorepo)

![local dev stack](https://res.cloudinary.com/dmukukwp6/image/upload/q_auto,f_auto/wizard_workbench_local_dev_760610ecfb.png)

### Setup

Install [mprocs](https://github.com/pvolok/mprocs):

```bash
brew install mprocs
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
| `EXAMPLES_PATH` | Yes | Path to your local examples repo (e.g., `~/development/examples`) |
| `MCP_PATH` | Yes | Path to MCP service (e.g., `~/development/posthog/services/mcp`) |
| `WIZARD_PATH` | Yes | Path to your local wizard repo (e.g., `~/development/wizard`) |
| `POSTHOG_REGION` | For CI | PostHog region for wizard CI mode (`us` or `eu`) |
| `POSTHOG_PERSONAL_API_KEY` | For CI | PostHog personal API key for wizard CI mode and PR evaluator|

Make sure you've set up and installed dependencies for all required repos.

### Running

Enter `mprocs` to run the local dev stack:

```bash
mprocs
```

### mprocs Commands

Use keyboard shortcuts in mprocs: `s` to start, `x` to stop, `r` to restart, `q` to quit.

#### Auto-start Processes (run automatically)

| Process | Port | Description |
|---------|------|-------------|
| `examples` | 8765 | Examples server with MCP resources ZIP |
| `mcp` | 8787 | MCP server using local resources |
| `mcp-inspector` | 6274 | MCP Inspector UI for debugging |
| `wizard-build` | - | Builds and watches Wizard for changes |

#### Manual Processes (press `s` to start)

| Process | Description |
|---------|-------------|
| `wizard-run` | Interactive app selector - choose which app to run wizard on |
| `wizard-tail-run` | Tail the wizard's verbose output (`/tmp/posthog-wizard.log`) |
| `wizard-ci-run` | Full CI flow: run wizard, create PR, evaluate |
| `wizard-ci-local-run` | CI flow with local evaluation (no PR) |
| `wizard-ci-create-pr` | Push branch and create PR only (skip wizard run) |
| `wizard-ci-evaluate-pr` | Evaluate an existing PR or local branch |

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

### GitHub workflows

![wizard CI github workflows](https://res.cloudinary.com/dmukukwp6/image/upload/q_auto,f_auto/pasted_image_2026_01_12_T18_57_17_075_Z_a1e3b9f146.png)

The `wizard-ci-trigger.yml` is the main entry point for CI/CD and accepts several inputs to customize and create Wizard runs.

| Input | Default | Description |
|-------|---------|-------------|
| `app` | - | `all`, directory (`next-js`), or app path (`next-js/15-app-router-todo`) |
| `evaluate` | `true` | Run PR evaluator after wizard completes |
| `wizard_ref` | `main` | Wizard repo branch/tag/sha |
| `examples_ref` | `main` | Examples repo branch/tag/sha |
| `posthog_ref` | `master` | PostHog repo branch/tag/sha (for MCP) |
| `trigger_id` | auto-gen | Seven character ID |

Each trigger is assigned a unique short ID that tracks the group of wizard CI runs it created. 

![wizard CI trigger ID](https://res.cloudinary.com/dmukukwp6/image/upload/q_auto,f_auto/pasted_image_2026_01_12_T19_21_18_324_Z_3a92099297.png)

You can activate `wizard-ci-trigger.yml` in a few ways.

1. **Manual** - Run from GitHub Actions UI
2. **Cron** - Scheduled via `wizard-ci-cron.yml`
3. **Dispatch** - Webhook call via `repository_dispatch` 
