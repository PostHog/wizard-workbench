# PostHog Replay Vision — Setup Report

## What was installed and initialized

PostHog (`posthog-js ^1.425.1`) was installed and initialized in this project for the first time. The SDK is initialized in `src/main.tsx` before `createRoot`, reading `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST` from environment variables. Both keys are written to `.env`. Autocapture (clicks, form submissions, pageviews) is active by default.

---

## What is recording

**Session replay is NOT yet active.** The client is ready — no `disable_session_recording` flag is set — but the server-side toggle must be turned on manually.

**Action required:**
Go to [Settings → Session replay → Record user sessions](https://us.posthog.com/project/483112/settings/session-replay) and enable recording. Once that is on, every new user session in this app will be captured automatically.

---

## Scanners configured

All three scanners were designed and fully specified during this run, but **none could be created** because the PostHog MCP connection is missing the required scopes (`replay_scanner:write`, `session_recording:read`). The scanner payloads are documented below — once scopes are restored, they can be created via the PostHog MCP or the UI under **Session Replay → Replay Vision**.

---

### 1 — Booking failures (broken-experiences scanner)

| | |
|---|---|
| **Type** | Monitor |
| **Watches** | Sessions touching `/book/` (the court booking form) |
| **What it flags** | Error messages or toasts, blank/white screens, failed loads, unresponsive buttons — especially: no available time slots, Confirm booking button failing, "Court not found" on a valid court, confirmation page never appearing after form submit |
| **Sampling rate** | 50 % of matching sessions |
| **Estimated monthly credit spend** | Low–moderate (50 % of booking-path sessions × ~1 credit/session) |
| **Model** | `gemini-3-flash-preview` |

**To create:** use `vision-scanners-create` with this payload:

```json
{
  "name": "Booking failures",
  "scanner_type": "monitor",
  "scanner_config": {
    "prompt": "Watch this session for moments where the product visibly broke for the user: an error message or toast, a blank/white screen, content that failed to load, obviously broken layout, a spinner that never resolves, or a button/form/action that clearly did nothing or failed. In this product that especially means: the slot picker showing no available time slots, the 'Confirm booking' button failing to submit or appearing to do nothing, the booking page showing 'Court not found' when a court should be available, or the confirmation page never appearing after the booking form is submitted. Only flag issues that are unambiguous on screen and would actually matter to the user – ignore cosmetic nits and anything you're unsure about. For each: what the user was trying to do, what broke, and the URL.\n\nA padel court booking app where users browse available courts and reserve a time slot to confirm a court reservation."
  },
  "query": {
    "kind": "RecordingsQuery",
    "properties": [
      { "key": "$current_url", "value": "/book/", "operator": "icontains", "type": "event" }
    ]
  },
  "sampling_rate": 0.5,
  "model": "gemini-3-flash-preview"
}
```

---

### 2 — Padel booking frustration (user-frustration scanner)

| | |
|---|---|
| **Type** | Monitor |
| **Watches** | Sessions containing a rage-click event (`$rageclick`) — all pages |
| **What it flags** | Repeated clicks on the same element, hammering an unresponsive button, looping retries — especially: hammering the time slot dropdown with no slots, retrying Confirm booking with no feedback, clicking courts with no availability info, stuck on "Court not found", losing a slot selection after navigating back |
| **Sampling rate** | 100 % of rage-click sessions |
| **Estimated monthly credit spend** | Low (only rage-click sessions qualify; typically a small fraction of total) |
| **Model** | `gemini-3-flash-preview` |

**To create:** use `vision-scanners-create` with this payload:

```json
{
  "name": "Padel booking frustration",
  "scanner_type": "monitor",
  "scanner_config": {
    "prompt": "Watch this session for clear signs the user got stuck or frustrated: repeatedly clicking the same element, hammering a button that isn't responding, retrying the same action over and over, visibly hunting for something they can't find, or abandoning a flow partway through. In this product that especially means: hammering the time slot dropdown when no available slots show, retrying Confirm booking with no response or error feedback, clicking repeatedly on courts with no availability information shown, getting stuck on Court not found with no recovery path, losing a time slot selection after navigating back through the booking flow. Only flag genuine struggle you can see – not normal browsing or a single mis-click. For each: what they were trying to do, where they got stuck, and the URL.\n\nA padel court booking app where users browse available courts, select a time slot, and confirm their reservation."
  },
  "query": {
    "kind": "RecordingsQuery",
    "events": [{ "id": "$rageclick", "type": "events" }]
  },
  "sampling_rate": 1.0,
  "model": "gemini-3-flash-preview"
}
```

---

### 3 — Court booking session summaries (session-summaries scanner)

| | |
|---|---|
| **Type** | Summarizer |
| **Watches** | All sessions (no filter) |
| **What it produces** | 2–3 sentence plain-English summary per session: what the user tried to do, main actions taken, how the session ended — using product vocabulary (courts, time slots, bookings) |
| **Sampling rate** | 10 % of all sessions |
| **Estimated monthly credit spend** | Low (10 % sampling keeps volume manageable) |
| **Model** | `gemini-3-flash-preview` |

**To create:** use `vision-scanners-create` with this payload:

```json
{
  "name": "Court booking session summaries",
  "scanner_type": "summarizer",
  "scanner_config": {
    "prompt": "Summarize what the user did in this session in two or three sentences: what they were trying to accomplish, the main things they did, and how the session ended. Use the product's own vocabulary: courts, time slots, bookings; browsing courts, selecting a time slot, confirming a booking.\n\nThis is a padel court booking app where users browse courts, select a time slot, and confirm a reservation."
  },
  "query": { "kind": "RecordingsQuery" },
  "sampling_rate": 0.1,
  "model": "gemini-3-flash-preview"
}
```

---

## What was skipped or deferred

| Item | Reason |
|---|---|
| Session replay server toggle | MCP connection missing `product_enablement:write` scope. User must enable manually in PostHog settings. |
| All three scanner creations | MCP connection missing `replay_scanner:write` and `session_recording:read` scopes. Payloads are ready above. |

---

## Two steps to go live

1. **Enable session recording** — [Settings → Session replay](https://us.posthog.com/project/483112/settings/session-replay) → turn on "Record user sessions".
2. **Create the scanners** — reauthorize the PostHog MCP connection with `replay_scanner:write` and `session_recording:read` scopes, then re-run the scanner steps, or paste the three payloads above into `vision-scanners-create`.

---

## Where to see results

Once recording is on and scanners are created, findings appear on the [Replay Vision page](https://us.posthog.com/project/483112/replay/vision). First scanner results will arrive after new sessions are recorded — typically within minutes of your first real user visit.
