# Replay Vision setup report — Court Booking

## PostHog SDK: installed and initialized

This project had no PostHog before this run. It does now:

- `posthog-js` (1.435.3) added to `package.json` via pnpm.
- Initialized in `src/main.tsx`, the app's single entry point, before React mounts.
- Reads `VITE_PUBLIC_POSTHOG_KEY` / `VITE_PUBLIC_POSTHOG_HOST` from `.env` (real project values written there; `.env.example` has empty placeholders for other developers).
- Autocapture left at its default (on). No provider component was needed for this plain Vite SPA.
- Verified with a clean `tsc -b` and a successful `pnpm build`.

## Session recording: code is ready, but not confirmed live yet

The client-side config is already correct — `src/main.tsx` does not set `disable_session_recording`, so recording will run as soon as it's turned on for the project.

However, the run could **not** confirm "Record user sessions" is turned on server-side for project 483112. The `products-enable` call failed because the MCP API key is missing the `product_enablement:write` scope.

**What you need to do:** turn on session replay manually at [Session replay settings](https://us.posthog.com/project/483112/settings/environment-replay), or add `product_enablement:write` to the API key and re-run enablement. Until this happens, no recordings will be captured, and none of the scanners below have anything to analyze.

## Scanners: none could be created — API key is missing required scopes

Three scanners were planned for this padel court-booking app (courts list → time-slot booking → confirmation, no backend calls), but **all three failed identically**: the MCP connection's API key lacks `replay_scanner:read`, `replay_scanner:write`, and `session_recording:read` (one also needs `llm_skill:read`). This is a hard scope gate on the whole scanner tool family, not a per-call rejection, so nothing was created or modified in PostHog.

**What you need to do:** add these scopes to the personal API key backing this MCP connection — `replay_scanner:read`, `replay_scanner:write`, `session_recording:read`, `llm_skill:read` — wait ~2 minutes for them to take effect, then re-run the scanner tasks. Each one left a fully-drafted brief ready to submit without re-deriving anything:

### 1. "Court booking failures" (breakage monitor)
- **Watches:** the booking + confirmation flow (`/book/:courtId` and `/confirmation`), for a court showing "Court not found," a time-slot selector that doesn't respond, a "Confirm booking" click that doesn't advance, or a confirmation that never appears.
- **Query scope:** URL-filtered to `/book` and `/confirmation` only (the courts list `/` is two steps removed and excluded).
- **Sampling / model:** locked at 0.5 sampling, `gemini-3-flash-preview` (fixed by the scanner brief, not adjustable per-project).

### 2. "Court booking frustration" (rage-click monitor)
- **Watches:** rage-clicking "Confirm booking," repeated clicks on "Book," toggling time slots without confirming, or repeatedly clicking "Back to courts" after a "Court not found" error.
- **Query scope:** `$rageclick` events only, no URL restriction (frustration can happen anywhere in the flow).

### 3. "Court booking session recaps" (summarizer)
- **Watches:** nothing — summarizes every sampled session in 2-3 sentences using the app's own vocabulary (courts, time slots, bookings).
- **Query scope:** all recordings.
- **Sampling / model:** 0.1 sampling, `gemini-3-flash-preview` — kept low to stay a small fraction of the replay-vision budget.

None of these have an estimated monthly credit spend yet — the estimate step (`vision-scanners-estimate` + quota check) couldn't run because scanner creation itself was blocked.

## Where results will appear

Once session recording is confirmed on and the scopes above are added, everything lands on the [Replay vision page](https://us.posthog.com/project/483112/replay) in PostHog. First observations will appear as soon as new recordings complete and the scanners have run against them — there's nothing to see there yet, since no recordings have been captured and no scanners exist.

## Summary of what's blocking you

| Step | Status | Blocker |
|---|---|---|
| SDK install + init | ✅ Done | — |
| Session recording enabled server-side | ⚠️ Unconfirmed | Missing `product_enablement:write` scope |
| Breakage scanner | ⛔ Not created | Missing `replay_scanner:write`, `session_recording:read`, `llm_skill:read` |
| Frustration scanner | ⛔ Not created | Missing `replay_scanner:read/write`, `session_recording:read` |
| Session summarizer | ⛔ Not created | Missing `replay_scanner:read/write`, `session_recording:read` |

All three scanner blockers and the enablement blocker are scope issues on the same API key — fixing the key's scopes once should unblock everything in one pass.
