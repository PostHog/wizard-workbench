# Replay Vision Setup Report — Court Booking App

## What's new

You started this run without PostHog installed at all — you now have the
PostHog JS SDK (`posthog-js` 1.434.12) installed and initialized:

- `src/lib/posthog.ts` calls `posthog.init()` using the project token
  (`VITE_PUBLIC_POSTHOG_KEY`) and host (`VITE_PUBLIC_POSTHOG_HOST`), both read
  from environment variables (`.env`, with `.env.example` documenting the
  keys for other developers).
- That module is imported at the top of `src/main.tsx`, so PostHog boots
  before anything else in the app.
- The build (`pnpm build`) was verified clean with this wiring in place.

Autocapture and PostHog's normal defaults are untouched — nothing in the
client config disables recording or capture.

## What's recording right now: nothing yet, action needed

Session replay is **not confirmed enabled** for this project. The step that
turns on server-side recording (`products-enable` for `session_replay`) was
rejected because the MCP connection used for this run doesn't carry the
`product_enablement:write` scope — this wasn't a decision, it was blocked.

The client half is already correct and needs no further code changes: there
is no `disable_session_recording` or other override sitting in
`src/lib/posthog.ts`. The moment recording is turned on server-side, the app
will start capturing sessions with no redeploy needed.

**To fix it, do one of:**
1. Reconnect/reauthorize the PostHog MCP connection with the
   `product_enablement:write` scope and re-run this step, or
2. In the PostHog app, go to **Settings → Session replay** for project
   `483112` and manually turn on "Record user sessions."

## Scanners: none created — same blocker

Three scanners were planned for this booking app (browse courts → pick a
time slot → confirm booking), but **all three creation attempts were
blocked**, not skipped by choice. The MCP connection is missing
`replay_scanner:read`, `replay_scanner:write`, and `session_recording:read`
(and `llm_skill:read` for the summarizer's reference skill) — the identical
class of scope gap that blocked enabling replay above. No scanner exists in
PostHog yet, so there's no credit-spend estimate to report.

Once the connection is reauthorized with those scopes, these are ready to
create immediately (specs already drafted, no further code exploration
needed):

- **Booking failures** (broken-experiences monitor) — watches recordings
  scoped to the `/book` URL, covering the time-slot picker and the confirm
  step (client-side navigation means `/confirmation` shows up in the same
  session). Looks for: the slot dropdown not responding, "Confirm booking"
  doing nothing, dead court links landing on "Court not found," or the
  confirmation screen never appearing.
- **Court booking frustration** (rage-click monitor) — watches all sessions
  for `$rageclick` events, tuned to this app's specific friction points: the
  fixed 17:00/18:00/19:00 slot list with no availability indication, no
  confirmation of what was actually booked, and dead-end court links.
- **Padel booking session recaps** (summarizer, 10% sampling) — plain-language
  recaps of what a user did each session, using this app's own vocabulary
  (courts, time slots, bookings).

## Where to look

Once recording is enabled and scanners are created, results will show up on
the **Replay vision** page in PostHog for project `483112` — first
observations will appear as new recordings complete afterward. Until the
scope issue above is resolved, that page will stay empty for this project.

## Bottom line

- **SDK: done.** `posthog-js` is installed, initialized, and verified to build.
- **Session replay: blocked** on a missing `product_enablement:write` scope
  (or a manual toggle in Settings → Session replay).
- **Scanners: blocked** on missing `replay_scanner:read/write` and
  `session_recording:read` scopes — three are fully specified and ready to
  create the moment access is restored.
