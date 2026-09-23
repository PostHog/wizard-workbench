# Replay Vision setup report

## PostHog: installed and initialized

This project had no PostHog at all before this run. It now does:

- Installed `posthog-js` (`^1.434.11`) via pnpm.
- Added `src/posthog.ts`, which reads `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST` from the environment and calls `posthog.init(...)`. Both keys are already set in `.env` with real project values (host `https://us.i.posthog.com`), and documented blank in `.env.example` for other environments.
- Imported that init file at the top of `src/main.tsx`, so PostHog loads before anything else runs.
- Verified the project still builds cleanly (`pnpm run build`).

Once session recording is turned on (see below), this wiring is all that's needed — no further code changes required for basic capture.

## Session replay: not recording yet — one manual step needed

The client SDK is configured correctly and does **not** disable recording (`disable_session_recording` is not set anywhere). However, the server-side "Record user sessions" toggle for this project could not be confirmed or enabled: the automation hit a PostHog MCP connection that lacks the `product_enablement:write` scope.

**Action needed:** a project admin should turn on session recording manually at [Settings → Session replay](https://us.posthog.com/project/483112/settings/environment-replay). Until that toggle is on, no recordings will be captured, and none of the scanners below will have anything to analyze.

## Scanners: drafted but not created (same permissions gap)

Three scanners were planned for this padel court-booking app (browse courts → pick a time slot → confirm booking), but **none could actually be created**. Every scanner tool (`vision-scanners-create`, `vision-scanners-list`, `vision-scanners-estimate-create`, etc.) returned a 403 for missing scopes (`replay_scanner:write`, `replay_scanner:read`, `session_recording:read`, and `llm_skill:read` depending on the tool). No PostHog state changed and no monthly credit spend was incurred, so there are no cost figures to report yet.

The three scanners are fully specified and ready to create as soon as the MCP connection is reauthorized with the missing scopes:

1. **Court booking failures** (monitor) — watches the booking flow itself: the court list failing to load, the time-slot picker not responding, "Confirm booking" doing nothing, a valid court showing "Court not found," or the confirmation page never appearing. Scoped to URLs containing `/book` and `/confirmation`. Planned sampling rate 50%, model `gemini-3-flash-preview`.
2. **Court booking frustration** (monitor) — watches for rage-clicks (`$rageclick`) anywhere in the app, covering things like re-clicking an already-booked slot or a booking form with no success/failure feedback. Unscoped by URL, sampling rate 100% (rage-click events are already rare), model `gemini-3-flash-preview`.
3. **Court booking session recaps** (summarizer) — plain-language recap of what a user did in a session (browsing courts, choosing a slot, confirming a booking). Unscoped, sampling rate 10%, model `gemini-3-flash-preview`.

## What still needs a human

1. Reauthorize/reconnect the PostHog MCP connection with: `product_enablement:write`, `replay_scanner:read`, `replay_scanner:write`, `session_recording:read`, and `llm_skill:read`.
2. Turn on **Record user sessions** for this project (Settings → Session replay), either via the reauthorized connection or manually in the app.
3. Re-run scanner creation using the three specs above once scopes are restored.

## Where to look

Once recording is enabled and the scanners are created, results will appear on the [Replay vision page](https://us.posthog.com/project/483112/replay/vision) in PostHog. The first observations will show up as soon as new recordings complete and get scanned — there's nothing retroactive to see until then.
