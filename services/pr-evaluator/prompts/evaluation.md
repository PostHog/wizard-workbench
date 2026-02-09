## Instructions

**IMPORTANT: Before evaluating, you MUST read each changed file using the Read tool.** The files are located in the GitHub repository at the paths shown in the diff (e.g., `apps/next-js/15-app-router-todo/components/todos/todo-form.tsx`). This allows you to understand the full context of changes and assess whether existing code/logic is preserved.

For each file in the PR:
1. Use the Read tool to view the complete file at its path from the diff
2. Compare the full file against the diff to understand what changed
3. Assess the impact and quality of changes

After reading all files, provide your evaluation.

## Scoring Scale (apply to all sections)

| Score | Meaning |
|-------|---------|
| 5 | Complete, correct, production-ready |
| 4 | Works with minor gaps or polish issues |
| 3 | Core works but notable issues or missing pieces remain |
| 2 | Major problems, risky to ship |
| 1 | Does not function, critical failures |

Most competent work scores 3-4. Be specific about gaps and what's missing, not just what's present. Be CRITICAL and DIRECT. Do not praise unnecessarily or inflate scores.

## Evaluation criteria

### 1. File analysis (score 1-5)
For each file changed in the PR, assess:
- What changed and how it fits into the PostHog integration
- How well the file’s changes upholds reliability, correctness, and best practices within the original app codebase 

### 2. App sanity check (score 1-5)
Check for:
- App builds, runs, and is functional
- Preserves existing app code, configs, and logic
- Minimal, focused changes (no unnecessary modifications)
- Clear, readable code
- Consistent with existing patterns
- Appropriate error handling
- No syntax errors
- Correct import/export statements
- Environment variables documented
- Build configuration is valid

### 3. PostHog implementation (score 1-5)

Check for:

- PostHog SDK in dependencies:
  - JavaScript: `posthog-js` or `posthog-node` in package.json
  - Python: `posthog` in requirements.txt or pyproject.toml
  - Other: appropriate SDK for the language/framework
- Correct initialization patterns by framework:
  - JavaScript: Provider component or singleton client module
  - Django: `AppConfig.ready()` in apps.py
  - Other: SDK initialized at app startup
- Correct API host configuration
- PostHog initialization with API key (via environment variable, not hardcoded)
- Captures baseline events (pageviews, screen views, custom events)
- `posthog.capture()` calls for user actions
- Page view tracking setup
- User identification:
  - JavaScript: `posthog.identify()`
  - Python: `identify_context()` within `new_context()` blocks
- Error tracking setup (exception capture)
- No PII in event properties
- Proper cleanup on unmount (React)
- Reverse proxy that circumvents adblock issues when sending events to PostHog

**Note:** Python SDK v7+ uses a context-based API. Do not flag `new_context()`, `capture()`, `tag()` patterns as errors.

### 4. Quality of PostHog insights and events (score 1-5)
Check for:
- Captured events that represent real user actions, product flows, and friction points
- Captured events that can be used to build PostHog insights and help answer product questions
- Events enriched with relevant properties

### 5. Confidence score (score 1-5)
A final composite score summarizing how safe, reliable, and useful this PR is to merge. This score should heavily weight sections #1–#3, since they determine whether the integration is technically correct, stable, and functional.

The App sanity check (#2) should have the strongest influence. If the app does not run, introduces regressions, or includes major structural problems, the confidence score cannot exceed the app sanity score.