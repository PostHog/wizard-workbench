# PostHog Replay vision report

> ⚠️ **Needs your attention**
> - Enable **Record user sessions** in PostHog’s **Settings → Session replay** (or have an administrator enable `session_replay`). The browser SDK is ready, but server-side Replay enablement could not be confirmed because the PostHog MCP request failed.
> - Grant this MCP connection `replay_scanner:read`, `replay_scanner:write`, and `session_recording:read` scopes before creating the prepared Replay vision scanners.

## What is recording now

The Vite React app now has `posthog-js` installed and initialized before React renders. It reads the configured public token and ingestion host from `VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST`; neither value is embedded in source. Standard browser analytics is therefore ready to send when configured.

The client SDK does not disable session recording, so browser recordings will be eligible by default. They will actually begin flowing once **Record user sessions** is enabled server-side in PostHog. No custom events or recording-suppression settings were added.

## Replay vision scanners

No scanner was created or updated in this run: the available MCP connection lacks the required Replay Vision and session-recording scopes. Consequently, projected monthly credit spend could not be estimated and no quota check could be run. The following scanner definitions are prepared for creation after access is granted:

| Scanner | What it watches | Query scope | Estimated monthly credit spend |
| --- | --- | --- | --- |
| **Court booking failures** | Missing or failed court selection; missing time-slot picker; a Confirm booking action that does nothing; booking form submission failures; or the confirmation screen never appearing. | Recordings whose URL matches `/book/` or `/confirmation`. | Not available — estimation and quota tools require additional scopes. |
| **Booking frustration** | Clear signs a visitor got stuck or frustrated: retrying a court’s Book link, repeatedly changing the time slot, hammering Confirm booking, or trying to book again after confirmation. | Only recordings containing the `$rageclick` event. | Not available — estimation and quota tools require additional scopes. |
| **Padel booking session summaries** | Session summaries using the product vocabulary: padel courts, court surfaces, time slots, bookings, browsing courts, selecting a slot, and confirming a booking. | All recordings (unscoped); planned sampling rate: 10%. | Not available — estimation and quota tools require additional scopes. |

When authorized, the next setup should first check the existing scanner inventory for matching definitions, preserve the enabled state of any match, estimate each scanner’s spend, check Replay Vision quota, and only then create or update the scanner.

## Deferred work

- **Server-side Session Replay enablement:** deferred because the MCP transport failed while inspecting the required enablement tool. An administrator can enable it in PostHog settings.
- **All three Replay vision scanners:** deferred because this MCP connection is missing `replay_scanner:read`, `replay_scanner:write`, and `session_recording:read`. This also prevents accurate cost estimates and quota validation.

## Where to look

After session recordings complete, open the [Replay vision page](https://us.posthog.com/project/483112/replay/vision) in PostHog. New observations will appear there as eligible recordings finish processing. The scanner results will appear after the deferred scanners have been created and begin evaluating completed recordings.
