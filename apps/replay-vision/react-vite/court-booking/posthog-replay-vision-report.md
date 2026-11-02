# Replay Vision report

> ⚠️ **Needs your attention**
> - A project administrator must enable **Record user sessions** in **Settings → Session replay**, or rerun enablement with credentials that have `product_enablement:write`.
> - To create and size the prepared Replay Vision scanners, use credentials with `replay_scanner:read`, `replay_scanner:write`, and `session_recording:read`.

## What is ready to record

PostHog is now installed and initialized in the browser application with `posthog-js`. The client uses the configured public Vite key and ingestion host, initializes before React renders, and preserves PostHog's default autocapture and session-recording behavior.

Recordings cannot begin until Session Replay is enabled server-side. Once enabled, new browser sessions for this app will be recorded; the first Replay Vision observations arrive as those new recordings complete.

## Replay Vision scanners

No scanner could be created or updated with the available connection, so there is no current credit spend. Each scanner still needs replay-volume sizing, an estimate for its exact query, and a quota check before creation. Its estimated monthly credit spend is therefore **not yet available**.

| Scanner | What it watches | Intended query scope | Estimated monthly credits |
| --- | --- | --- | --- |
| **Court booking problems** | Booking-flow failures: court list or booking page does not load; a selected court is not found; time-slot selection fails; confirming does nothing; or the confirmation page does not appear. | Booking flow pages: `/`, `/book/:courtId`, and `/confirmation`, using the actual recording URL forms. | Not available — scanner and recording read access are required to size and estimate it. |
| **Booking outcome** | How a session went through the padel-booking flow, from selecting a court and time slot through confirming the booking. | For high volume, recordings beginning at `/book/:courtId`; for no/low volume, an unfiltered recordings query. | Not available — scanner and recording read access are required to choose the tier and estimate it. |
| **Padel booking session summaries** | Session summaries using the product vocabulary: padel courts, time slots, and bookings; browsing courts, selecting a time slot, and confirming a booking. | To be selected from actual replay volume; the prepared brief is currently unscoped until the required inventory and sizing checks can run. | Not available — scanner and recording read access are required to tier and estimate it. |

## Where to look

After Session Replay and the scanners are enabled, open the **Replay vision** page in PostHog. Results will appear there as newly completed recordings are processed.
