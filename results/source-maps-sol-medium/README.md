# Source-maps sol-medium binding — verification runs

Each app ran the `error-tracking-upload-source-maps` program twice against project
**228144**: once on the new binding (`pi` + `gpt-5.6-sol`, `thinkingLevel: medium`)
and once on the prior default (`anthropic` + `claude-sonnet-4-6`). `SOURCE_MAPS_RUN_BUILD=1`,
so the host ran each app's real `npm run build` at the skill's test step — exercising the
actual `sourcemap process` upload. One directory per run: `app.diff` (what the agent
changed), `ctrl.log` (screen path), `result.json`.

## Uploads that landed

33 symbol sets in [project 228144](https://us.posthog.com/project/228144/error_tracking/configuration)
over the runs. Both bindings produce a working upload when the agent (a) writes the vaulted
upload key and (b) installs the build deps.

## Per-app outcome

| app | sol-medium (pi/gpt-5.6-sol) | anthropic (claude-sonnet-4-6) |
|-----|------------------------------|-------------------------------|
| `next` | **0 uploaded** — kept the fixture's stale `POSTHOG_API_KEY` | **29 chunks** — replaced the stale key with the vaulted one |
| `react-vite` | **1 chunk** — identical `vite.config.ts` | **1 chunk** — identical `vite.config.ts` |
| `node-raw` | **1 chunk** — ran `npm install`, build compiled | **0 uploaded** — never installed deps, `tsc: command not found` |

## Read

The integration logic is **1:1 across bindings** — both write the same env keys, the same
build-script/`withPostHogConfig`/`rollup-plugin` wiring, the same task plan (it's
skill-driven). Where they differ is **execution thoroughness**, and it cuts both ways:

- `next`: sol-medium trusted a stale `POSTHOG_API_KEY` already in the fixture's `.env.local`;
  anthropic overwrote it. (Anthropic better.)
- `node-raw`: sol-medium ran `npm install` first so `tsc` was on PATH; anthropic skipped it
  and the build couldn't compile. (Sol-medium better.)
- `react-vite`: no meaningful difference — the recipe left no room for judgment.

Net: the binding routes correctly and the upload works under both. The divergences are
run-to-run agent variance on edge cases (stale creds, missing deps), not a systematic
difference between `sol-medium` and `sonnet-4-6` — a 1-run sample per cell can't separate
model signal from noise.
