## Output template

**Security:** Never include full API keys or secrets in output. Use redacted format like `phc_xxxx...xxxx` or `sk_test_xxxx...xxxx`.

Write your review following this Markdown structure:

---

## PR Evaluation Report — Revenue Analytics

### Summary
[1-3 sentence overview of how this PR wires Stripe to PostHog revenue analytics]

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
| **Preserves existing Stripe integration** | Yes / No | Description |
| **No syntax or type errors** | Yes / No | Description |
| **Correct imports/exports** | Yes / No | Description |
| **Minimal, focused changes** | Yes / No | Description |
| **Pre-existing issues** | None / List | Issues that exist in the base app, not introduced by this PR |

#### Issues
- **Issue title**: Description. [CRITICAL]
- **Issue title**: Description. [MEDIUM]
- **Issue title**: Description. [LOW]

---

### Stripe ↔ PostHog wiring ✅ if all pass / ⚠️ if any NO / ❌ if critical items fail

| Criteria | Result | Description |
|----------|--------|-------------|
| **distinct_id threaded into Stripe metadata** | Yes / No | Where and how the PostHog distinct_id is written to Stripe metadata |
| **Webhook captures revenue events** | Yes / No | Which Stripe events map to which PostHog captures |
| **Server uses posthog-node** | Yes / No | Description |
| **distinct_id matches existing usage** | Yes / No | The same identifier already used by the app's existing `identify`/`capture` calls |
| **Consistent currency handling** | Yes / No | Description |

#### Issues
- **Issue title**: Description. [CRITICAL]
- **Issue title**: Description. [MEDIUM]
- **Issue title**: Description. [LOW]

---

### Revenue events ✅ if all pass / ⚠️ if any NO / ❌ if critical items fail

| Filename | Revenue events captured | Description |
|----------|--------------------------|-------------|
| `filename` | `invoice_paid`, `checkout_completed`, ... | Which Stripe events map to which PostHog events |

#### Issues
- **Issue title**: Description. [CRITICAL]
- **Issue title**: Description. [MEDIUM]
- **Issue title**: Description. [LOW]

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
    "as_env_documented": "yes or no or n/a",
    "as_build_config_valid": "yes or no"
  },
  "posthog_implementation": {
    "ph_distinct_id_in_stripe_metadata": "yes or no",
    "ph_webhook_captures_revenue_events": "yes or no",
    "ph_uses_posthog_node_server_side": "yes or no",
    "ph_distinct_id_matches_existing_usage": "yes or no",
    "ph_consistent_currency": "yes or no"
  },
  "event_quality": {
    "eq_real_revenue_actions": "yes or no",
    "eq_amount_and_currency_props": "yes or no",
    "eq_matches_posthog_revenue_shape": "yes or no",
    "eq_meaningful_naming": "yes or no"
  }
}
RUBRIC -->

IMPORTANT: In the RUBRIC block above, replace each "yes or no" with exactly "yes", "no", or "n/a" (lowercase). These must match your evaluation of each criterion. Use "n/a" ONLY for `as_env_documented` when no new env vars are introduced.

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

Reviewed by wizard workbench PR evaluator (revenue analytics)
