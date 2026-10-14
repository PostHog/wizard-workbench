# Replay Vision setup report

> ⚠️ **Needs your attention**
> - Enable **Record user sessions** in **Settings → Session replay**. Browser instrumentation is ready, but no recordings will arrive until a project administrator enables this product setting.
> - Grant the MCP credential `replay_scanner:read`, `replay_scanner:write`, and `session_recording:read` to create the prepared Replay Vision scanners and calculate their actual credit usage.

## What is ready

The app now includes and initializes the browser PostHog SDK (`posthog-js`) before React renders. Its production configuration reads the configured PostHog public token and host from Vite environment variables; the SDK keeps PostHog’s default autocapture and session-recording behavior enabled.

Replay recording is **not yet flowing** because project-side Session Replay has not been enabled. Once **Record user sessions** is enabled, new browser sessions can be recorded without another client-side change.

## Replay Vision scanners

No scanners were created or updated in this run. The required Replay Vision API permissions prevented scanner inventory checks, credit estimates, quota checks, and creation. Therefore, the monthly estimates below are **pending calculation**, not zero-cost estimates.

| Scanner | What it will watch | Query scope | Sampling / model | Estimated monthly credit spend |
| --- | --- | --- | --- | --- |
| **Booking failures** | Visible breakage in the booking flow: unavailable or missing time slots, a court-not-found screen, Confirm booking doing nothing or failing, and a missing booking-confirmed screen. | URL-scoped to `/book` and `/confirmation` recordings. | 0.5 sampling rate; `gemini-3-flash-preview`. | **Pending** — must be estimated against the current recording volume and quota before creation. |
| **Booking frustration** | Visible signs of being stuck: repeatedly selecting a court, changing or retrying a time slot, confirming without reaching confirmation, or attempting another slot after confirmation. | Exactly recordings gated by the `$rageclick` event; no URL or extra filters. | Prepared monitor configuration; final estimate/model details require the permitted creation workflow. | **Pending** — must be estimated against the current recording volume and quota before creation. |
| **Padel booking session summaries** | A concise summary of what the user did while browsing courts, selecting a time slot, and confirming a booking. | Unscoped recordings query. | 0.1 sampling rate; `gemini-3-flash-preview`. | **Pending** — must be estimated against the current recording volume and quota before creation. |

## Deferred work and why

- **Session Replay activation** was deferred because the available MCP credential lacks `product_enablement:write`. A project administrator can complete it in **Settings → Session replay** by enabling **Record user sessions**.
- **All three Replay Vision scanners** were deferred because the credential lacks `replay_scanner:read`, `replay_scanner:write`, and `session_recording:read`. Those permissions are needed to check for existing matching scanners, calculate each scanner’s monthly credits, confirm available quota, and safely create or update them.

## Where to look

After Session Replay is enabled and new sessions complete, recordings and scanner observations will appear on the **Replay Vision** page in PostHog. The first observations will arrive only after matching new recordings have completed and the scanners have been created and run.
