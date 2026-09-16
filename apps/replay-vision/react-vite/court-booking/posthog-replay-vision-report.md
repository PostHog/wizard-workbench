# Replay Vision Report — Court Booking

## What's now recording

PostHog was not installed in this project before this run — it is now.

- **SDK installed**: `posthog-js@^1.433.7` added via pnpm.
- **Initialized**: `src/main.tsx` calls `posthog.init(...)` before the app mounts, reading `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST` from environment variables (set in `.env`, documented in `.env.example`). Autocapture and session recording are left at SDK defaults — nothing in the code disables them.
- **Session replay is NOT yet turned on**, and this is the one thing that needs your action:
  - The client is ready to record as soon as replay is enabled server-side.
  - Turning it on failed automatically because this PostHog MCP connection is missing the `product_enablement:write` scope.
  - **Action needed**: go to **Settings → Session replay** in PostHog for this project and turn on "Record user sessions" — https://us.posthog.com/project/483112/settings/replay — or reauthorize the MCP connection with that scope and re-run.

## Scanners: none created — MCP permissions gap

All three scanner tasks (breakage monitor, frustration monitor, session-summary scanner) were fully scoped and drafted, but **none could be created**. Every `vision-scanners-*` call was rejected with the same cause: this MCP connection lacks `replay_scanner:read`, `replay_scanner:write`, and `session_recording:read` scopes. This is the same underlying gap that blocked enabling replay itself (`product_enablement:write`) — one reauthorization of the PostHog MCP connection is likely to fix all of it at once.

Nothing was billed or spent — no scanner exists yet, so there is no credit cost to report.

Drafted and ready to create once scopes are restored:

| Scanner | Watches for | Query scope | Sampling |
|---|---|---|---|
| **Court booking failures** (monitor) | Broken booking flow: dropdown not showing time slots, "Confirm booking" doing nothing, confirmation page never appearing or blank | Pages under `/book` (and `/confirmation`) | 0.5 |
| **Booking frustration** (monitor) | Rage-clicks on "Confirm booking", repeated dropdown cycling, retrying the same court/slot | Sessions with a `$rageclick` event (no page restriction) | per locked brief |
| **Padel booking session recaps** (summarizer) | Two-to-three sentence recap of what each user tried to do, did, and how the session ended | All sessions, no page restriction | 0.1 |

The booking flow these scanners target: pick a court on `/` → choose a time slot and confirm on `/book/:courtId` → land on `/confirmation`.

## Where to look

- **Session replay settings** (turn on recording first): https://us.posthog.com/project/483112/settings/replay
- **Replay vision page** (where scanner observations will appear once scanners exist and sessions are recorded): https://us.posthog.com/project/483112/replay

## Summary for you

1. PostHog is newly installed and initialized in this app — it wasn't there before.
2. Session recording is coded to work but is switched off at the project level; turn it on in Settings → Session replay, or reauthorize the MCP connection's `product_enablement:write` scope.
3. Three scanners are fully drafted but blocked on missing `replay_scanner:read/write` and `session_recording:read` scopes on this MCP connection — reauthorize once, then re-run to create them, at zero cost until they're created.
