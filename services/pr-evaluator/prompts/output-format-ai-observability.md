## Output template

**Security:** Never include full API keys or secrets in output. Use redacted format like `phc_xxxx...xxxx`.

Write your review following this Markdown structure:

---

## PR Evaluation Report — AI observability

### Summary
[1-3 sentence overview of how the PR captures this app's model calls]

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
| **Preserves existing model behavior** | Yes / No | Description |
| **No syntax or type errors** |	Yes / No | Description |
| **Correct imports/exports** |	Yes / No | Description |
| **Minimal, focused changes** | Yes / No | Description |
| **Manual capture ledger and report** | Yes / No / N/A | Check the report exists and reconciles every README inference path |
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

### AI observability implementation ✅ if all pass / ⚠️ if any NO / ❌ if critical items fail

| Criteria | Result | Description |
|----------|--------|-------------|
| **Every model path captured** | Yes / No | Check each path in the app README, including direct calls |
| **Trace and session grouping** | Yes / No | State the actual request and conversation IDs |
| **Tool spans** | Yes / No / N/A | Check executed tools and parent links |
| **Stream and error outcomes** | Yes / No | Check completion, provider errors, and cancellation |
| **Provider token fields** | Yes / No | Trace source fields to emitted token properties |
| **Output choice roles** | Yes / No / N/A | Inspect actual response shapes for a `role` on every manual output choice |
| **Protocol terminal events** | Yes / No / N/A | Parse each stream's terminal signal, including valid SSE formatting and WebSocket upstream paths |

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

### AI events ✅ if all pass / ⚠️ if any NO / ❌ if critical items fail

| Filename | AI events | Description |
|----------|-----------------|-------------|
| `filename` | `$ai_generation`, `$ai_span`, or `$ai_embedding` | Which real model or tool actions emit them |

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
    "as_dependency_version_valid": "yes or no",
    "as_flushes_before_exit": "yes or no or n/a",
    "as_manual_capture_ledger_delivered": "yes or no or n/a"
  },
  "posthog_implementation": {
    "ph_instrumentation_initialized_once": "yes or no",
    "ph_generations_captured": "yes or no",
    "ph_trace_groups_the_request": "yes or no",
    "ph_session_id_set": "yes or no",
    "ph_session_id_correct_key": "yes or no",
    "ph_session_cardinality_correct": "yes or no",
    "ph_identity_scope_correct": "yes or no",
    "ph_no_hand_authored_spans": "yes or no or n/a",
    "ph_additive_only": "yes or no"
  },
  "event_quality": {
    "eq_events_would_render_as_tree": "yes or no",
    "eq_output_choices_have_role": "yes or no or n/a",
    "eq_stream_terminal_parsed": "yes or no or n/a",
    "eq_person_attribution": "yes or no",
    "eq_span_parenting": "yes or no or n/a",
    "eq_no_fabricated_structure": "yes or no",
    "eq_privacy_respected": "yes or no"
  }
}
RUBRIC -->

IMPORTANT: In the RUBRIC block above, replace each placeholder with exactly "yes", "no", or "n/a" (lowercase). These keys are the AI observability criteria. Use "n/a" only where the rubric permits it: `as_flushes_before_exit` for long-running servers, `as_manual_capture_ledger_delivered` outside manual capture, `ph_no_hand_authored_spans` when the app has no tools or spans, `eq_span_parenting` when no manual spans are captured, `eq_output_choices_have_role` when the event is built by an SDK or instrumentor, and `eq_stream_terminal_parsed` when no streams are manually captured. The manual capture path also permits "n/a" for `fa_imports_valid`.

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

Reviewed by wizard workbench PR evaluator (AI observability)
