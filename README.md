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
| `EVALUATOR_ANTHROPIC_API_KEY` | Yes | Anthropic API key for the PR evaluator |
| `EXAMPLES_PATH` | Yes | Path to your local examples repo (e.g., `~/development/examples`) |
| `MCP_PATH` | Yes | Path to MCP service (e.g., `~/development/posthog/services/mcp`) |
| `WIZARD_PATH` | Yes | Path to your local wizard repo (e.g., `~/development/wizard`) |
| `POSTHOG_REGION` | For CI | PostHog region for wizard CI mode (`us` or `eu`) |
| `POSTHOG_PERSONAL_API_KEY` | For CI | PostHog personal API key for wizard CI mode |

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

## Services reference

### wizard-ci

Run wizard on test apps and optionally create PRs with evaluation.

```bash
pnpm wizard-ci                     # Select test app, run wizard, and create PR
pnpm wizard-ci --evaluate          # Also run PR evaluator 
pnpm wizard-ci --local --evaluate  # Run locally (no PR created)
pnpm wizard-ci --app next-js/15-app-router-saas --local  # Pre-select test app
pnpm wizard-ci --push-only --branch wizard-ci/my-feature/abc1234 # Create PR from existing branch
```

### pr-evaluator

AI evaluation of PostHog integration quality in pull requests or local branches.

```bash
pnpm run evaluate --pr <number>               # Evaluate a GitHub PR and post comment
pnpm run evaluate --test-run --branch <name>  # Save evaluation output to local dir
```

When using `--test-run`, the evaluator locally saves these files to `test-evaluations/<name>/`:

| File | Description |
|------|-------------|
| `prompt.md` | The full prompt sent to the AI |
| `output.md` | The AI's evaluation response |
| `usage.md` | Token usage and cost information |