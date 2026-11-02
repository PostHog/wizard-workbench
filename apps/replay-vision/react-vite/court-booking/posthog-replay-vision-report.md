# Replay Vision report

> ❌ **Session replay is off:** a project admin must turn on **Record user sessions** under **Settings → Session replay** before Replay Vision scanners can run.

> **Deploy this change:** session replay only records from code your users run, so your scanners start when the first recording arrives. Deploy `package.json`, `pnpm-lock.yaml`, and `src/main.tsx`, and set `VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST` in production. Do not deploy environment files.

This run installed and initialized the browser PostHog SDK, so the app now has PostHog once the deployment is released with its production environment configuration.

There are currently **0 recordings in the last 30 days**. Replay Vision scanners cost nothing until recordings arrive. After session replay is enabled and the release reaches users, scanners begin with the first completed recording.

## Prepared scanners

No scanners were created because this connection lacks the Replay Vision and session-recording permissions needed to list, estimate, and create them. An authorized connection must perform the required inventory, estimate, and quota checks before creating or updating these monitors.

| Scanner | What it watches | Query scope | Estimated monthly credits |
| --- | --- | --- | --- |
| **Booking failures** | A booking flow that breaks: a court is not found, the time-slot selector does not load or accept a choice, **Confirm booking** does nothing, or **Booking confirmed** never appears. | Recordings containing the booking route (`/book/`, including parameterized court routes) and confirmation route (`/confirmation`). Planned sampling rate: 0.5; model: `gemini-3-flash-preview`. | **Unavailable** — estimation was blocked by missing permissions. |
| **Booking frustration** | Clear signs a person got stuck or frustrated: repeated slot choices, repeated confirmation attempts without success, or returning to the court list to retry. | Exactly the prepared `$rageclick`-only recordings query. | **Unavailable** — estimation was blocked by missing permissions. |
| **Padel court booking session summaries** | A concise summary of activity: browsing padel courts, choosing an available time slot, and confirming a booking. | Unscoped session summarizer. Planned sampling rate: 0.1; model: `gemini-3-flash-preview`. | **Unavailable** — estimation was blocked by missing permissions. |

## Deferred work

All three scanners are deferred because the connected API key is missing `replay_scanner:read`, `replay_scanner:write`, and `session_recording:read` access. Reconnect with those permissions, enable session replay, and deploy the SDK configuration. The authorized setup should then check for an existing compatible scanner, estimate the locked configuration, check quota, and create or update the scanner as appropriate.

## Where to look

Results appear on the **Replay vision** page in PostHog. The first observations arrive as new recordings complete after session replay has been enabled and users run the deployed app.
