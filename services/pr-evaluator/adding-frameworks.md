# Adding a new framework to the evaluator

After you've added your commandments to context-mill, the evaluator picks them up automatically. It loads local overrides from `CONTEXT_MILL_PATH` / `COMMANDMENTS_PATH` when set, and otherwise fetches the latest commandments from GitHub on every run.

The only thing you may need to do here is check framework detection.

## Check framework detection

There's usually no change needed here, but just to be safe, it's worth checking!

Open `services/pr-evaluator/prompt-builder.ts` and check `detectFramework()`. If your framework uses common file extensions or dependency files (`.py`, `package.json`, `Gemfile`, etc.), it's likely already detected.

If not, add one detection line:

```typescript
if (/my-framework/.test(depContent) || /my-framework/.test(filePaths)) tags.add("my-framework");
```

Also check `detectArchType()`: is your framework server-only, client-only, or full-stack? Add the tag to the appropriate array if missing.

## Add a test app and run the evaluator

```bash
# Add an example app under apps/{workflow}/{framework}/
# Run the wizard against it to generate a PR branch
# Then evaluate:
pnpm run evaluate -- -b HEAD --test-run my-framework-test
```

## Validate the evaluation

Check the output for false positives:

- `test-evaluations/my-framework-test/output.md` - are there false positives?
- `test-evaluations/my-framework-test/scores.json` - does the confidence score make sense?

If false positives exist, the commandments need to be more specific.

## How commandments sync works

The evaluator fetches commandments at startup in this order:

1. Reads from `CONTEXT_MILL_PATH` env var if set (`<CONTEXT_MILL_PATH>/context/commandments.yaml`, aligned with `context/skills/integration/config.yaml`)
2. Reads from `COMMANDMENTS_PATH` env var if set (standalone local `commandments.yaml` override)
3. Fetches latest from GitHub - `PostHog/context-mill` main branch, 5s timeout
4. Falls back to vendored copy at `services/pr-evaluator/prompts/commandments.yaml`
5. Parses the YAML into `tag -> rules[]` map
6. `detectFramework(prData)` matches PR files against known patterns to find tags
7. Matching commandments are injected into the system prompt as authoritative SDK rules

For local doc testing against unmerged `posthog.com` docs, set `POSTHOG_DOCS_BASE_URL` (for example `http://localhost:8000`) to rewrite `https://posthog.com` doc URLs at fetch time.

This means commandments in context-mill are picked up automatically on the next evaluator run - no manual sync needed.
