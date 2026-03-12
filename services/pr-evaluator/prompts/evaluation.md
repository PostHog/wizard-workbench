## Instructions

Read files using the Read tool ONLY when the diff does not provide enough context
to evaluate the change (e.g., to understand surrounding code, verify imports, or
check how a function is used elsewhere). Do NOT re-read files whose full content
is already visible in the diff.

## Evaluation method: Rubric

For each dimension below, evaluate every rubric item as **YES**, **NO**, or **N/A**.

- **YES**: The PR clearly satisfies this criterion — you have concrete evidence in the diff/files
- **NO**: The PR fails this criterion, it is missing, or done incorrectly
- **N/A**: This criterion does not apply to this architecture type (see notes on each item)

Be CRITICAL and DIRECT. Most competent work passes 60-80% of rubric items. Do not give YES unless
you have concrete evidence in the diff/files. Do not praise unnecessarily.

**Do NOT assign scores.** Only fill out the rubric and write the narrative review.
Scores are computed server-side from your rubric answers.

**Scope of evaluation:** Evaluate ONLY the changes introduced by this PR. If the
base app has pre-existing issues (broken configs, missing dependencies, etc.),
note them separately but do NOT let them affect your YES/NO answers. The wizard is
responsible for what it changed, not what was already broken.

## Rubric

### 1. File analysis

For each item, answer YES/NO based on the changed files:

- **fa_changes_relevant** — All changes relate to PostHog integration (no unrelated edits)
- **fa_correct_files** — Correct files modified for this framework (e.g., `apps.py` for Django, `instrumentation-client.ts` for Next.js, provider for React)
- **fa_no_unnecessary_changes** — No unnecessary modifications (no gratuitous reformatting, no unrelated refactors, no deleted code that should have been preserved)
- **fa_code_quality** — Code follows existing codebase patterns (naming, structure, indentation, idioms match surrounding code)
- **fa_imports_valid** — Imports and exports are correct (no missing imports, no importing from wrong packages like posthog-js on server)
- **fa_files_complete** — All necessary files are included (e.g., env example updated, config file added if needed)

### 2. App sanity

- **as_builds** — App builds without errors (no syntax errors, type errors, or missing dependencies that would prevent build)
- **as_preserves_existing** — Preserves existing app code and configs (no existing functionality broken, env vars intact, configs unmodified except for PostHog additions)
- **as_minimal_changes** — Changes are minimal and focused (only what is needed for PostHog integration, no scope creep)
- **as_no_syntax_errors** — No syntax or type errors introduced (valid syntax in all changed files, types match)
- **as_correct_imports** — Correct import/export statements (all imports resolve, correct package names)
- **as_env_documented** — Environment variables documented (new env vars like API key, host mentioned in .env.example or README or equivalent)
- **as_build_config_valid** — Build configuration is valid (package.json scripts work, tsconfig valid, requirements.txt parseable, etc.)

### 3. PostHog implementation

- **ph_sdk_installed** — PostHog SDK added to dependencies (posthog-js/posthog-node in package.json, posthog in requirements.txt, etc.)
- **ph_initialized** — PostHog client correctly initialized using framework-appropriate pattern:
  - JavaScript: Provider component or singleton client module
  - Next.js 15.3+: `instrumentation-client.ts`
  - Django: `AppConfig.ready()` in apps.py
  - Python: At app startup with proper configuration
  - Other: SDK initialized at app startup
- **ph_api_key_env** — API key loaded from environment variable (not hardcoded)
- **ph_host_configured** — API host correctly configured (points to correct PostHog host or reverse proxy endpoint)
- **ph_capture_events** — capture() calls for user actions (at least one meaningful `posthog.capture()` call)
- **ph_identify** — User identification implemented. **N/A for server-only apps.** Framework-specific:
  - JavaScript: `posthog.identify()` on login/signup
  - Python: NO `identify()` method — use `identify_context()` within `new_context()`, or `set()`
  - Server-only APIs: N/A (backend services may only use `capture()` with a distinct_id)
- **ph_error_tracking** — Error/exception tracking set up. Valid SDK methods:
  - JavaScript: `enableExceptionAutocapture` (init option), `captureException()`
  - Python: `enable_exception_autocapture` (constructor option), `capture_exception()`
  - Do NOT flag these as invalid or nonexistent methods
- **ph_reverse_proxy** — Reverse proxy configured. **N/A for server-only apps.** Only `posthog-js` in the browser benefits from a reverse proxy to circumvent ad blockers. Server-side SDKs (posthog-node, Python, Ruby, PHP) do NOT need one.

**Architecture-aware rules:**

- **Server-only** apps (Django, Flask, FastAPI, Express, Koa, Fastify, Rails): `ph_identify` and `ph_reverse_proxy` are N/A. Evaluate server-side patterns only.
- **Client-only** apps (React SPA, Angular, Svelte, Astro static): All items apply.
- **Full-stack** apps (Next.js, TanStack Start): All items apply. Evaluate both client and server patterns.

**Note:** Python SDK v7+ uses a context-based API. Do not flag `new_context()`, `capture()`, `identify_context()`, `tag()` patterns as errors.

### 4. Event Quality

- **eq_real_actions** — Events represent real user actions (not synthetic or meaningless events; map to actual product flows like signup, purchase, page view)
- **eq_product_insights** — Events enable product insights (could build a funnel, trend, or retention chart from these events)
- **eq_enriched_properties** — Events include relevant properties (events have contextual properties, not bare captures with no properties)
- **eq_no_pii** — No PII in event properties (emails, names, phones belong in identify()/person properties, not in capture() event properties). Apply this rule consistently across ALL frameworks.
- **eq_meaningful_naming** — Event names are descriptive and consistent (snake_case or consistent convention; names describe the action, not "event1" or "click")
