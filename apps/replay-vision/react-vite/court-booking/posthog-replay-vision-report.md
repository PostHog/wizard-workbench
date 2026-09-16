# Replay Vision Setup Report — Court Booking App

## What's recording

PostHog is now installed and initialized in this app — you started this command without PostHog, and now have it:

- **SDK**: `posthog-js` `^1.433.6`, added to `package.json` via pnpm.
- **Init**: `posthog.init(...)` added at the top of `src/main.tsx`, before the app renders, reading `VITE_PUBLIC_POSTHOG_KEY` / `VITE_PUBLIC_POSTHOG_HOST` from environment variables (already set in `.env`, documented empty in `.env.example`).
- **Client config**: defaults set to `'2026-05-30'`, autocapture and session recording left at SDK defaults — nothing in the client code disables or restricts recording.

**Follow-up needed to actually start recording:** the server-side "Record user sessions" toggle for this project could not be flipped. The PostHog MCP connection used for this run is missing the `product_enablement:write` scope, so the enable step was rejected as a permission error rather than completing. To start capturing recordings:
1. Reconnect/reauthorize the PostHog MCP connection with the `product_enablement:write` scope and re-run this step, **or**
2. Have a project admin manually enable **Record user sessions** under **Settings → Session replay** for project 483112.

The client is ready and will start sending recordings the moment either path completes — no further code changes are needed.

## Scanners: none created yet (same permission gap)

Three scanners were designed and fully specced during this run, but **none could be created** — every Replay Vision scanner endpoint (`vision-scanners-create`, `vision-scanners-list`, `vision-quota-retrieve`, etc.) rejected the calls with the same class of error: the MCP connection is missing scopes `replay_scanner:read`, `replay_scanner:write`, and `session_recording:read` (and `llm_skill:read` for the session-summaries brief). This is the same reauthorization gap as the recording toggle above — one fix (reconnecting the MCP connection with the right scopes) unblocks all of it.

Once reauthorized, these three scanners are ready to submit verbatim from the handoffs of this run:

| Scanner | Watches for | Query scope | Est. monthly credit spend |
|---|---|---|---|
| **Court booking failures** (monitor) | Visible breakage in the booking flow: "Court not found" errors, a stuck/no-op "Confirm booking" button, an empty courts list, or a confirmation page that never appears | Recordings where `$current_url` contains `/book` or `/confirmation` (the booking step and completion page); sampled at 50% | Not yet estimated — quota/estimate calls are blocked by the same scope gap |
| **Booking frustration** (monitor) | Rage-clicks anywhere in the app — signals the user got stuck or frustrated | Unscoped: all recordings with a `$rageclick` event | Not yet estimated |
| **Court booking session recaps** (summarizer) | Produces a 2–3 sentence recap of each session (what the user tried to do, what they did, how it ended), in this app's own vocabulary (courts, time slots, bookings) | Unscoped, sampled at 10% | Not yet estimated |

None of these could be checked against existing scanners for a duplicate/collision either, since listing scanners is also blocked. That check must happen as the first step once access is restored.

## Where results will appear

Once recording is enabled and the scanners are created, everything shows up on the **Replay Vision** page in PostHog for this project (project 483112). The first scanner observations will appear as soon as new recordings complete and get scanned — there's nothing further to configure in the app itself once the MCP connection has the right scopes.

## Summary of what's blocking you

A single root cause is blocking every remaining step: **the PostHog MCP connection used for this run is under-scoped.** It's missing:
- `product_enablement:write` (to turn on session recording)
- `replay_scanner:read`, `replay_scanner:write`, `session_recording:read` (to list/create scanners)
- `llm_skill:read` (to load the scanner-authoring skill)

Reconnect or reauthorize the PostHog MCP connection with these scopes (or use a personal API key that has them), then re-run the enable-replay and scanner steps — no code changes are required on your end, everything on the app side is already wired up and waiting.
