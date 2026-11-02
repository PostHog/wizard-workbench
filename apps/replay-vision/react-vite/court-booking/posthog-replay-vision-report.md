# Replay Vision setup report

> ❌ **Session replay is off.** No scanner runs until a project admin turns on **Record user sessions** under **Settings → Session replay**.

## Deploy this change

Session replay only records from code your users run, so scanners start when the first recording arrives. Deploy the changes in:

- `package.json`
- `pnpm-lock.yaml`
- `src/main.tsx`
- `.env`

Set these environment variables in production:

- `VITE_POSTHOG_KEY`
- `VITE_POSTHOG_HOST`

This run installed and initialized the browser PostHog SDK (`posthog-js`), so the app now has the client integration needed to record sessions after the release and replay enablement.

## Current recording and cost status

There were **0 session recordings in the last 30 days**. Replay Vision scanners cost nothing until recordings arrive. Once replay is enabled and the deployed app receives traffic, new completed recordings will become available for scanning.

## Replay Vision scanners

No scanners were created or updated because this connection lacks the required Replay Vision and session-recording permissions. Their definitions are ready to create when a credential has `replay_scanner:read`, `replay_scanner:write`, and `session_recording:read`.

| Scanner | What it watches | Query scope | Estimated monthly credits |
| --- | --- | --- | --- |
| **Padel booking failures** | Visible breakage in the booking journey: a missing court, an unavailable or non-persistent time-slot selector, an unresponsive confirmation action, or a missing booking-confirmation screen. | Recordings on `/`, `/book/:courtId`, and `/confirmation`; no event gate. | Not available: estimation is permission-gated. |
| **Padel booking frustration** | Frustrated interaction around choosing a court, changing a time slot, repeatedly trying to confirm, or returning to courts after confirmation. | Recordings containing `$rageclick`; no URL or other filters. | Not available: estimation is permission-gated. |
| **Padel booking session summaries** | Summaries of browsing padel courts, selecting a time slot, and confirming a booking. | All recordings, sampled at 10%. | Not available: estimation is permission-gated. |

The failure and frustration monitors are intentionally separated: the failure monitor covers the booking routes, while the frustration monitor is gated only by rage clicks. Scanner creation, collision checks, quota checks, and credit estimates remain deferred until the required permissions are available.

## Where to look

Results appear on the **Replay Vision** page in PostHog. The first observations arrive as new recordings complete after session replay is enabled and the deployed browser SDK starts receiving real traffic.
