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

### App sanity check: X/5 ✅ if 5/5 or 4/5 / ⚠️ if 3/5 / ❌ if 2/5 or 1/5

| Criteria | Result | Description |
|----------|--------|-------------|
| **App builds and runs** | Yes / No | Description |
| **Preserves existing env vars & configs** |	Yes / No | Description |
| **No syntax or type errors** |	Yes / No | Description |
| **Correct imports/exports** |	Yes / No | Description |
| **Minimal, focused changes** | Yes / No | Description |

#### Issues
- **Issue title**: Description of high severity issue. Description of fix. [CRITICAL] 
- **Issue title**: Description of medium severity issue. Description of fix. [MEDIUM] 
- **Issue title**: Description of low severity issue. Description of fix. [LOW]

<details>
<summary><h4>Other completed criteria</h4><summary>
- Other criterion met
- Other criterion met
</details>

---

### PostHog implementation: X/5 ✅ if 5/5 or 4/5 / ⚠️ if 3/5 / ❌ if 2/5 or 1/5

| Criteria | Result | Description |
|----------|--------|-------------|
| **PostHog SDKs installed** | Yes / No | Description of packages installed |
| **PostHog client initailized** | Yes / No | Description of client config and how PostHog is initialized within the app |
| **capture()** | Yes / No | Description |
| **Identify()** |  Yes / No | Description |
| **Error tracking:** |  Yes / No | Description |
| **Reverse proxy:** |  Yes / No | Description |

#### Issues
- **Issue title**: Description of high severity issue. Description of fix. [CRITICAL] 
- **Issue title**: Description of medium severity issue. Description of fix. [MEDIUM] 
- **Issue title**: Description of low severity issue. Description of fix. [LOW]

<details>
<summary><h4>Other completed criteria</h4><summary>
- Other criterion met
- Other criterion met
</details>

---

### PostHog insights and events: X/5 ✅ if 5/5 or 4/5 / ⚠️ if 3/5 / ❌ if 2/5 or 1/5

| Filename | PostHog events | Description |
|----------|-----------------|-------------|
| `filename` | `event_one`, `event_two`, or `capturedException` | Description of insights, analytics, error tracking, or product behavior captured by PostHog integration | 

#### Issues
- **Issue title**: Description of high severity issue. Description of fix. [CRITICAL] 
- **Issue title**: Description of medium severity issue. Description of fix. [MEDIUM] 
- **Issue title**: Description of low severity issue. Description of fix. [LOW]

<details>
<summary><h4>Other completed criteria</h4><summary>
- Other criterion met
- Other criterion met
</details>

---

Reviewed by wizard workbench PR evaluator