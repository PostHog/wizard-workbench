## Output template

**Security:** Never include full API keys or secrets in output. Use redacted format like `phc_xxxx...xxxx`.

Write your review following this Markdown structure:

---

## PR Evaluation Report

### Summary
[1-3 sentence overview of the PR changes]

| Files changed | Lines added | Lines removed |
|---------------|-------------|---------------|
| X | +Y | -Z |

### Confidence score: X/5 🧙 if 5/5 / 👍 if 4/5 / 🤔 if 3/5 / ❌ if 2/5 or 1/5

- detailed change or recommendation that's CRITICAL or MEDIUM severity
- detailed change or recommendation that's CRITICAL or MEDIUM severity
- detailed change or recommendation that's CRITICAL or MEDIUM severity


---

### File changes

| Filename | Score | Description |
|----------|-------|-------------|
| `path/to/file.ts` | X/5 | Brief description of changes

---

### App sanity check ✅ if all pass / ⚠️ if any NO / ❌ if critical items fail

| Criteria | Result | Description |
|----------|--------|-------------|
| **App builds and runs** | Yes / No | Description |
| **Preserves existing env vars & configs** |	Yes / No | Description |
| **No syntax or type errors** |	Yes / No | Description |
| **Correct imports/exports** |	Yes / No | Description |
| **Minimal, focused changes** | Yes / No | Description |
| **Pre-existing issues** | None / List | Issues that exist in the base app, not introduced by this PR |

#### Issues
- **Issue title**: Description of high severity issue. Description of fix. [CRITICAL]
- **Issue title**: Description of medium severity issue. Description of fix. [MEDIUM]
- **Issue title**: Description of low severity issue. Description of fix. [LOW]

<details>
<summary><h4>Other completed criteria</h4></summary>

- Other criterion met
- Other criterion met
</details>

---

### PostHog implementation ✅ if all pass / ⚠️ if any NO / ❌ if critical items fail

| Criteria | Result | Description |
|----------|--------|-------------|
| **PostHog SDKs installed** | Yes / No | Description of packages installed |
| **PostHog client initialized** | Yes / No | Description of client config and how PostHog is initialized within the app |
| **capture()** | Yes / No | Description |
| **identify()** |  Yes / No / N/A | N/A for server-only apps |
| **Error tracking** |  Yes / No | Description |
| **Reverse proxy** |  Yes / No / N/A | N/A for server-only apps |

#### Issues
- **Issue title**: Description of high severity issue. Description of fix. [CRITICAL]
- **Issue title**: Description of medium severity issue. Description of fix. [MEDIUM]
- **Issue title**: Description of low severity issue. Description of fix. [LOW]

<details>
<summary><h4>Other completed criteria</h4></summary>

- Other criterion met
- Other criterion met
</details>

---

### PostHog insights and events ✅ if all pass / ⚠️ if any NO / ❌ if critical items fail

| Filename | PostHog events | Description |
|----------|-----------------|-------------|
| `filename` | `event_one`, `event_two`, or `capturedException` | Description of insights, analytics, error tracking, or product behavior captured by PostHog integration |

#### Issues
- **Issue title**: Description of high severity issue. Description of fix. [CRITICAL]
- **Issue title**: Description of medium severity issue. Description of fix. [MEDIUM]
- **Issue title**: Description of low severity issue. Description of fix. [LOW]

<details>
<summary><h4>Other completed criteria</h4></summary>

- Other criterion met
- Other criterion met
</details>

---

<!-- RUBRIC
{
  "file_analysis": {
    "fa_changes_relevant": "yes or no",
    "fa_correct_files": "yes or no",
    "fa_no_unnecessary_changes": "yes or no",
    "fa_code_quality": "yes or no",
    "fa_imports_valid": "yes or no",
    "fa_files_complete": "yes or no"
  },
  "app_sanity": {
    "as_builds": "yes or no",
    "as_preserves_existing": "yes or no",
    "as_minimal_changes": "yes or no",
    "as_no_syntax_errors": "yes or no",
    "as_correct_imports": "yes or no",
    "as_env_documented": "yes or no",
    "as_build_config_valid": "yes or no"
  },
  "posthog_implementation": {
    "ph_sdk_installed": "yes or no",
    "ph_initialized": "yes or no",
    "ph_api_key_env": "yes or no",
    "ph_host_configured": "yes or no",
    "ph_capture_events": "yes or no",
    "ph_identify": "yes or no or n/a",
    "ph_error_tracking": "yes or no",
    "ph_reverse_proxy": "yes or no or n/a",
    "ph_screen_views": "yes or no or n/a",
    "ph_all_targets_initialized": "yes or no or n/a"
  },
  "event_quality": {
    "eq_real_actions": "yes or no",
    "eq_product_insights": "yes or no",
    "eq_enriched_properties": "yes or no",
    "eq_no_pii": "yes or no",
    "eq_meaningful_naming": "yes or no"
  }
}
RUBRIC -->

IMPORTANT: In the RUBRIC block above, replace each "yes or no" with exactly "yes", "no", or "n/a" (lowercase). These must match your evaluation of each criterion. Use "n/a" for items marked as N/A: ph_identify and ph_reverse_proxy for server-only apps; ph_screen_views for every web and server framework, since it applies only to Flutter, React Native, iOS, Android, and KMP; ph_all_targets_initialized for every single-target project, since it applies only to Flutter, React Native, and KMP.

<!-- SCORES
{
  "file_analysis": 0,
  "app_sanity": 0,
  "posthog_implementation": 0,
  "event_quality": 0,
  "confidence": 0,
  "framework": "<detected framework>",
  "arch_type": "<server-only | client-only | full-stack>"
}
SCORES -->

IMPORTANT: Leave all score values as 0 — they are computed server-side from the rubric. Only fill in "framework" and "arch_type".

Reviewed by wizard workbench PR evaluator
