# Replay Vision setup report — Court Booking

## PostHog SDK: installed and initialized

This project had no PostHog integration before this run. It now does:

- `posthog-js` (v1.435.9) added to `package.json` via pnpm.
- `src/posthog.ts` created — reads `VITE_PUBLIC_POSTHOG_KEY` / `VITE_PUBLIC_POSTHOG_HOST` from env and calls `posthog.init(...)` with current defaults (`defaults: '2026-05-30'`). No autocapture or session-replay options were touched — everything is left at PostHog's defaults.
- `src/main.tsx` now imports `./posthog` for side effects at app startup, so every page load initializes PostHog.
- Real credentials written to `.env` (gitignored); `.env.example` committed with empty placeholders for `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST`.

Product analytics (events, autocapture) will start flowing as soon as the app is built and run with these env vars present.

## Session recording: not yet turned on — needs a follow-up

Session replay needs a server-side flag in addition to client config. The client side is clean (no `disable_session_recording` or other blocking override in `src/posthog.ts`), but turning on the product itself failed:

> The MCP connection's personal API key is missing the `product_enablement:write` scope.

**To fix:** either add `product_enablement:write` to the personal API key used by this integration and re-run the enable step, or have a project admin manually turn on **Settings → Session replay → Record user sessions** in the PostHog app. Nothing else needs to change in the code once that's flipped — recordings will start arriving automatically.

## Scanners: none created — blocked on missing MCP capability

Three scanners were planned (breakage monitor, frustration monitor, session summarizer). All three hit the same wall: the `vision-scanners-create` tool is not exposed at all on this MCP connection (not just permission-denied — it doesn't appear even as a scope-gated tool), and the read-side scanner tools (`vision-scanners-list`, `-get`, `-estimate`, quota) are separately gated behind `replay_scanner:read` / `replay_scanner:write` / `session_recording:read`, which this key also lacks.

**To fix:** add `replay_scanner:read` and `replay_scanner:write` (and `session_recording:read`) to the personal API key, confirm the scanner-create/update tool is exposed for this org, then re-run the scanner tasks. Briefs are already prepared so the re-run is fast:

1. **Court booking failures** (breakage monitor) — watches URLs containing `/book` or `/confirmation` for moments the booking flow visibly breaks (time-slot picker failing, Confirm button doing nothing, confirmation page never appearing, "Court not found" errors). Sampling rate 0.5, model `gemini-3-flash-preview`.
2. **Court booking frustration** (rage-click monitor) — watches for `$rageclick` events anywhere in the app (hammering Confirm, repeatedly switching time slots, retrying after bouncing off confirmation). Sampling rate 0.5, model `gemini-3-flash-preview`.
3. **Court booking session summaries** (summarizer) — unscoped, summarizes what users did each session using court/booking vocabulary (browsing courts, picking a time slot, confirming a booking). Sampling rate 0.1, model `gemini-3-flash-preview`.

Credit estimates couldn't be computed this run (the estimate tool is behind the same missing scopes) — get them from `vision-scanners-estimate` once scopes are restored, before creating the scanners.

## Where to look

Once recording is enabled and the scanners above are created, results will appear on the **Replay vision** page in PostHog (https://us.posthog.com/project/483112/replay). The first observations show up as new recordings complete — until the two follow-ups above are resolved, this page will stay empty for this project.
