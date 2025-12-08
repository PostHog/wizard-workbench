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
└── pr-evaluator/
└── wizard-run/
```

## Wizard local dev stack

The workbench can run the entire Wizard stack in local development mode, with hot reload where supported. It uses `mprocs` to run all the repos defined in your `.env` file:

- [Examples repo](https://github.com/PostHog/examples)
- [Wizard repo](https://github.com/PostHog/wizard)
- [MCP repo](https://github.com/PostHog/posthog/tree/master/products/mcp) (within PostHog monorepo)

![local dev stack](https://res.cloudinary.com/dmukukwp6/image/upload/q_auto,f_auto/wizard_workbench_local_dev_760610ecfb.png)

### Setup

Install [mprocs](https://github.com/pvolok/mprocs):

```bash
brew install mprocs
```

Install [meta](https://github.com/meta-cli/meta) for managing multiple git repositories:

```bash
npm i -g meta
```

Pull down repos and install dependencies in this repo:

```bash
pnpm pull # this will pull down the latest versions of all repos
pnpm install:all # this will install dependencies in this repo
```

Copy and edit `.env` with your repo paths and API key:

```bash
cp .env.example .env
```

```bash
ANTHROPIC_API_KEY=sk-ant-...   # Required for wizard PR evaluator

# Adjust if your repos are in different locations
EXAMPLES_PATH=repos/examples
MCP_PATH=repos/posthog/products/mcp
WIZARD_PATH=repos/wizard
```

### Running

Enter `mprocs` to run the local dev stack:

```bash
mprocs
```

This starts 4 auto-running processes:

| Process | Description |
|---------|-------------|
| `examples` | Examples server at `localhost:8765` |
| `mcp` | MCP server at `localhost:8787` |
| `mcp-inspector` | MCP inspector at `localhost:6274` |
| `wizard` | Builds and watches Wizard for changes |

Manual processes (press `s` to start):

| Process | Description |
|---------|-------------|
| `wizard-run` | Run the Wizard on a test app |
| `workbench-evaluate` | Evaluate a PR or branch's Wizard integration |
